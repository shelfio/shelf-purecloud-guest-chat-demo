export interface ChatData {
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
    chatTitle?: string;
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
  chatData: ChatData;
  isConnectedToAgent: boolean;
  createChatWithAgent: (chat: ChatData) => void;
  addMessage: (message: string) => void;
  pureCloudCredentials?: PureCloudCredentials;
  pureCloudEnvironment: string;
  chatHistory: string[];
  removeChat: () => void;
  lang: string;
  i18n: any;
  t: any;
}
