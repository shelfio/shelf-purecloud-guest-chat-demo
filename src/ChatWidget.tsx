import React, {Component} from 'react';
import {Widget, addResponseMessage} from 'react-chat-widget';
import {find, get, includes, isEmpty, isEqual, toLower} from 'lodash';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {handleSearchInLibrary, handleSearchInRecommendations} from './helpers';
import {addMessage, createChatWithAgent, removeChat} from './actions';
import {createNewGuestChat, getMemberInfo, sendMessageToAgent, textRequestDialogFlow} from './api';
import {WidgetProps} from './types';
import 'react-chat-widget/lib/styles.css';
import './ChatWidget.scss';

class ChatWidget extends Component<WidgetProps> {
  static defaultProps = {
    lang: 'en'
  };
  state = {
    changedLang: false
  };
  componentDidMount() {
    const {lang, i18n} = this.props;

    if (!this.state.changedLang) {
      this.setState({changedLang: true}, () => {
        i18n.changeLanguage(lang || 'en').then(t => {
          addResponseMessage(t('welcome'));
        });
      });
    }
  }

  startChatWithAgent = async (lastMessage: string) => {
    const {pureCloudCredentials, pureCloudAPIHost, chatHistory, t} = this.props;
    const fullHistory = [...chatHistory, lastMessage];

    try {
      const chat = await createNewGuestChat(pureCloudCredentials, pureCloudAPIHost);
      this.props.createChatWithAgent(chat);
      if (!chat) {
        return;
      }

      const socket = new WebSocket(chat.eventStreamUri);

      socket.addEventListener('open', async () => {
        addResponseMessage(t('connect'));
        if (!isEmpty(fullHistory)) {
          for (const message of fullHistory) {
            await sendMessageToAgent({
              host: pureCloudAPIHost,
              chat,
              newMessage: message
            });
          }
        }
      });
      socket.addEventListener('message', async event => {
        const message = JSON.parse(event.data);
        const outsideMessage = !isEqual(
          get(message, 'eventBody.sender.id'),
          get(chat, 'member.id')
        );
        const agentLeave = isEqual(get(message, 'eventBody.bodyType'), 'member-leave');
        const agentJoin = isEqual(get(message, 'eventBody.bodyType'), 'member-join');

        // Chat message
        if (message.metadata) {
          switch (message.metadata.type) {
            case 'message': {
              if (message.eventBody.body && outsideMessage) {
                return addResponseMessage(message.eventBody.body);
              }

              if (agentLeave && !outsideMessage) {
                removeChat();

                return addResponseMessage(t('endChatMessage'));
              }

              if (agentJoin && outsideMessage) {
                const memberInfo = await getMemberInfo(
                  pureCloudAPIHost,
                  chat,
                  get(message, 'eventBody.sender.id')
                );

                if (isEqual(toLower(memberInfo.role), 'agent')) {
                  return addResponseMessage(t('agentJoin'));
                }
              }
              break;
            }
            case 'member-change': {
              break;
            }
            default: {
              console.debug(`Unknown message type: ${message.metadata.type}`);
            }
          }
        }
      });
    } catch (e) {
      console.debug('error', e);
    }
  };

  handleNewUserMessage = async (newMessage: string) => {
    const {t, pureCloudCredentials} = this.props;
    const chat = get(this, 'props.chatData');
    const dialogFlowAccessToken =
      get(pureCloudCredentials, 'chatBotCredentials.dialogFlowAccessToken') ||
      process.env.REACT_APP_DIALOGFLOW_ACCESS_TOKEN;
    const useRecommendations = get(
      pureCloudCredentials,
      'chatBotCredentials.useRecommendations',
      false
    );

    this.props.addMessage(newMessage);
    if (!chat) {
      if (includes(newMessage.toLowerCase(), t('agent'))) {
        return this.startChatWithAgent(newMessage);
      }
    }

    if (dialogFlowAccessToken && !chat && !useRecommendations) {
      const dialogFlow = await textRequestDialogFlow(newMessage, dialogFlowAccessToken);
      const fulfillment = get(dialogFlow, 'result.fulfillment');
      const resultMessage = get(fulfillment, 'speech');
      const messages = get(fulfillment, 'messages');
      const useApi = get(find(messages, 'payload'), 'payload.api');

      if (useApi) {
        return handleSearchInLibrary({
          intentName: get(dialogFlow, 'result.metadata.intentName'),
          addMessage: this.props.addMessage,
          pureCloudCredentials: this.props.pureCloudCredentials,
          articleResponse: t('articleResponse')
        });
      }

      if (resultMessage) {
        this.props.addMessage(`bot reply: ${resultMessage}`);
        addResponseMessage(resultMessage);
      }
    }
    if (useRecommendations) {
      return handleSearchInRecommendations({
        message: newMessage,
        addMessage: this.props.addMessage,
        pureCloudCredentials: this.props.pureCloudCredentials,
        articleResponse: t('articleResponse')
      });
    }

    if (chat && chat.id) {
      await sendMessageToAgent({host: this.props.pureCloudAPIHost, chat, newMessage});
    }
  };

  render() {
    const {t} = this.props;
    const title = get(this, 'props.pureCloudCredentials.chatBotCredentials.chatTitle', t('title'));
    const subtitle = get(
      this,
      'props.pureCloudCredentials.chatBotCredentials.chatSubtitle',
      t('placeholder')
    );

    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          showCloseButton
          title={title}
          subtitle={subtitle}
          senderPlaceHolder={t('placeholder')}
        />
      </div>
    );
  }
}

export default withTranslation()(
  connect(
    state => ({
      chatData: state.chat.newChatData,
      chatHistory: state.chat.history
    }),
    {createChatWithAgent, addMessage, removeChat}
  )(ChatWidget)
);
