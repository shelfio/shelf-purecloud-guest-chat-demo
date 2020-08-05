import {PureCloudCredentials} from '../types';

export const createNewGuestChat = (
  pureCloudCredentials?: PureCloudCredentials,
  pureCloudAPIHost?
) => {
  const purecloudUrl = `https://${
    pureCloudAPIHost || 'api.mypurecloud.de'
  }/api/v2/webchat/guest/conversations`;

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
  }).then(resp => {
    return resp.json();
  });
};

export const searchInLibrary = (
  intentName: string,
  pureCloudCredentials?: PureCloudCredentials
) => {
  const domain =
    pureCloudCredentials?.chatBotCredentials?.shelfDomain ||
    process.env.REACT_APP_SHELF_DOMAIN ||
    'gsstaging.net';

  const accountId = pureCloudCredentials?.chatBotCredentials?.accountId || 'harvard';
  const intentGroupId = pureCloudCredentials?.chatBotCredentials?.intentGroupId || 'purecloud';
  const url = `https://api.${domain}/chatbot/${accountId}/${intentGroupId}/${intentName}`;

  return fetch(url, {
    method: 'GET'
  }).then(resp => {
    return resp.json();
  });
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
  }).then(resp => {
    return resp.json();
  });
};

export const sendMessageToAgent = ({host, chat, newMessage}) => {
  const url = `https://${host || 'api.mypurecloud.de'}/api/v2/webchat/guest/conversations/${
    chat.id
  }/members/${chat.member.id}/messages`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${chat.jwt}`
    },
    body: JSON.stringify({
      body: newMessage,
      bodyType: 'standard | notice'
    })
  });
};

export const getMemberInfo = (host, chat, agentId) => {
  const url = `https://${host || 'api.mypurecloud.de'}/api/v2/webchat/guest/conversations/${
    chat.id
  }/members/${agentId}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${chat.jwt}`
    }
  }).then(resp => {
    return resp.json();
  });
};

export const textRequestDialogFlow = (query: string, accessToken: string) => {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${accessToken}`);

  const url = `https://api.dialogflow.com/v1/query?v=20150910&query=${query}&sessionId=1&lang=en`;

  return fetch(url, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  })
    .then(response => response.json())
    .catch(error => console.debug('error', error));
};
