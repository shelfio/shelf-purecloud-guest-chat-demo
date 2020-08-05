import * as types from '../../actions/types';
import createReducer from './createReducer';
import {NewChatData} from '../../types';

export const chat = createReducer(
  {history: []},
  {
    [types.ADD_CHAT_TO_STORE](state: NewChatData, {newChatData}) {
      return {...state, newChatData};
    },
    [types.ADD_MESSAGE](state, {historyPiece}) {
      return {...state, history: [...state.history, historyPiece]};
    },
    [types.REMOVE_CHAT]() {
      return {history: []};
    }
  }
);
