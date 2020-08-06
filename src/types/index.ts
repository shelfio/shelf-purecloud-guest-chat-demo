export interface ChatData {
  id: string;
  jwt: string;
  eventStreamUri: string;
  member: {
    id: string;
  };
}

export interface AppState {
  chat: {data: ChatData; history: string[]};
}

export interface PureCloudCredentials {
  chatBotCredentials: {
    accountId: string;
    shelfDomain: string;
    chatTitle?: string;
    chatSubtitle?: string;
    useRecommendations?: boolean;
    allowedSSPLibraryIds?: string[];
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
  pureCloudCredentials: PureCloudCredentials;
  pureCloudEnvironment: string;

  lang?: string;
}

export interface WidgetStateProps {
  chatHistory: string[];
  isConnectedToAgent: boolean;
  chatData: ChatData;
}

export interface WidgetDispatchProps {
  removeChat: () => void;
  createChatWithAgent: (chat: ChatData) => void;
  addMessage: (message: string) => void;
}
