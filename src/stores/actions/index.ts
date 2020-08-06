import * as types from './types';
import {ChatData} from '../../types';

export const createChatWithAgent = (data: ChatData) => ({
  type: types.ADD_CHAT_TO_STORE,
  data
});

export const addMessage = (historyPiece: string) => ({
  type: types.ADD_MESSAGE,
  historyPiece
});

export const removeChat = () => ({
  type: types.REMOVE_CHAT
});
