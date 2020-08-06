import React, {Component} from 'react';
import {Widget, addResponseMessage, renderCustomComponent} from 'react-chat-widget';
import {filter, forEach, get, includes, isEmpty, isEqual, join, map, take, toLower} from 'lodash';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {addMessage, createChatWithAgent, removeChat} from './stores/actions';
import {
  createNewGuestChat,
  getMemberInfo,
  searchInRecommendations,
  sendMessageToAgent
} from './api';
import {WidgetProps} from './types';
import 'react-chat-widget/lib/styles.css';
import './ChatWidget.scss';

class ChatWidget extends Component<WidgetProps> {
  static defaultProps = {
    lang: 'en',
    pureCloudAPIHost: 'api.mypurecloud.de'
  };

  componentDidMount() {
    const {lang, i18n} = this.props;

    i18n.changeLanguage(lang || 'en').then(t => {
      addResponseMessage(t('welcome'));
    });
  }

  replyToAgent = (message: string) => {
    const {pureCloudEnvironment, chatData} = this.props;

    return sendMessageToAgent({
      host: pureCloudEnvironment,
      chatData,
      message
    });
  };

  startChatWithAgent = async () => {
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

  getSSPRecommendationsForMessage = async (message: string) => {
    const {pureCloudCredentials} = this.props;

    const response = await searchInRecommendations(message, pureCloudCredentials);
    const {recommendations} = response || {};
    const sspReccomendations = take(filter(recommendations, 'publicURL'), 3);

    if (!isEmpty(sspReccomendations)) {
      this.renderSSPRecommendations(sspReccomendations);
    }
  };

  renderSSPRecommendations = (recommendations: any[]) => {
    const botRepliedMessage = `bot reply: 
          ${join(
            map(recommendations, gem => `[${gem.title}](${gem.publicURL})`),
            '\n'
          )}`;

    this.props.addMessage(botRepliedMessage);

    addResponseMessage(this.props.t('articleResponse'));

    forEach(recommendations, gem =>
      renderCustomComponent(() => (
        <div className={'Widget__gem'} key={gem._id}>
          <a
            className={'Widget__gem-grid'}
            href={gem.publicURL}
            target={'_blank'}
            rel="noopener noreferrer"
          >
            <div className={'Widget__image'}></div>
            <div className={'Widget__title'}>{gem.title}</div>
            <div className={'Widget__description'}>
              <span>{gem.description}</span>
            </div>
          </a>
        </div>
      ))
    );
  };

  handleNewUserMessage = async (message: string) => {
    const {t, pureCloudCredentials, isConnectedToAgent} = this.props;

    const useRecommendations = get(
      pureCloudCredentials,
      'chatBotCredentials.useRecommendations',
      false
    );

    this.props.addMessage(message);

    // Chat is connected to PureCloud agent
    // So only send message directly to agent
    if (isConnectedToAgent) {
      return this.replyToAgent(message);
    }

    // If message contains "agent" -> connect agent
    if (includes(message.toLowerCase(), t('agent').toLowerCase())) {
      return this.startChatWithAgent();
    }

    if (useRecommendations) {
      return this.getSSPRecommendationsForMessage(message);
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
    ({chat: {data, history}}) => ({
      isConnectedToAgent: Boolean(data),
      chatData: data,
      chatHistory: history
    }),
    {createChatWithAgent, addMessage, removeChat}
  )(ChatWidget)
);
