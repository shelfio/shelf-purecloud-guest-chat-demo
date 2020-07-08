export interface NewChatData {
  id: string;
  jwt: string;
  eventStreamUri: string;
  member: {
    id: string;
  };
}

export interface PureCloudCredentials {
  chatBotCredentials: {
    accountId: string;
    shelfDomain: string;
    intentGroupId: string;
    chatTitle?: string;
    dialogFlowAccessToken?: string;
    libraryId?: string;
    useRecommendations?: boolean;
  };
  chatCredentials: {
    organizationId: string;
    deploymentId: string;
    memberInfo: {
      displayName: string;
    };
    routingTarget: {
      targetType: string;
      targetAddress: string;
    };
  };
}

export interface WidgetProps {
  chatData: NewChatData;
  createChatWithAgent: (chat: NewChatData) => void;
  addMessage: (message: string) => void;
  pureCloudCredentials?: PureCloudCredentials;
  pureCloudAPIHost?: string;
  chatHistory: string[];
  removeChat: () => void;
  lang: string;
  i18n: any;
  t: any;

}
