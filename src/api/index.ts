import {ChatData, PureCloudCredentials} from '../types';

export const createNewGuestChat = (
  pureCloudCredentials: PureCloudCredentials,
  pureCloudEnvironment
) => {
  const purecloudUrl = `https://api.${pureCloudEnvironment}/api/v2/webchat/guest/conversations`;

  const body = JSON.stringify(
    pureCloudCredentials
      ? pureCloudCredentials.chatCredentials
      : {
          organizationId: process.env.REACT_APP_PURECLOUD_ORGANIZATIONID,
          deploymentId: process.env.REACT_APP_PURECLOUD_DEPLOYMENTID,
          memberInfo: {
            displayName: 'Guest'
          },
          routingTarget: {
            targetType: 'queue',
            targetAddress: process.env.REACT_APP_PURECLOUD_QUEUE || 'Web Chat'
          }
        }
  );

  return fetch(purecloudUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  }).then(resp => resp.json());
};

export const searchInRecommendations = (
  text: string,
  pureCloudCredentials?: PureCloudCredentials
) => {
  const domain =
    pureCloudCredentials?.chatBotCredentials?.shelfDomain ||
    process.env.REACT_APP_SHELF_DOMAIN ||
    'gsstaging.net';

  const accountId = pureCloudCredentials?.chatBotCredentials?.accountId || 'harvard';
  const libraryId = pureCloudCredentials?.chatBotCredentials?.libraryId || 'purecloud';
  const url = `https://api.${domain}/recommendations/gems/recommendations_self_service`;

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      account_id: accountId,
      library_ids: [libraryId],
      text
    })
  }).then(resp => resp.json());
};

export const sendMessageToAgent = ({
  host,
  chatData,
  message
}: {
  host: string;
  chatData: ChatData;
  message: string;
}) => {
  const {id, jwt, member} = chatData;
  const url = `https://api.${host}/api/v2/webchat/guest/conversations/${id}/members/${member.id}/messages`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`
    },
    body: JSON.stringify({
      body: message,
      bodyType: 'standard | notice'
    })
  });
};

export const getMemberInfo = ({host, chat, agentId}) => {
  const url = `https://api.${host}/api/v2/webchat/guest/conversations/${chat.id}/members/${agentId}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${chat.jwt}`
    }
  }).then(resp => resp.json());
};
