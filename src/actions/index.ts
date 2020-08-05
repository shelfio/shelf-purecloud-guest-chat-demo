import * as types from "../actions/types";
import { NewChatData } from "../types";

export const createChatWithAgent = (newChatData: NewChatData) => ({
  type: types.ADD_CHAT_TO_STORE,
  newChatData,
});

export const addMessage = (historyPiece: string) => ({
  type: types.ADD_MESSAGE,
  historyPiece,
});

export const removeChat = () => ({
  type: types.REMOVE_CHAT,
});
