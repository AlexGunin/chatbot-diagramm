import { ChatBotDiagramState } from './types';

export enum ChatBotDiagramActionType {
  setSomeExampleId = 'refreshSomeExampleId',
}

interface SetSomeExampleId {
  type: ChatBotDiagramActionType.setSomeExampleId;
  payload: string;
}

export type ChatBotDiagramAction = SetSomeExampleId;
//  | SetSomeOtherThing
export const ChatBotDiagramReducer = (
  state: ChatBotDiagramState,
  action: ChatBotDiagramAction,
): ChatBotDiagramState => {
  switch (action.type) {
    case ChatBotDiagramActionType.setSomeExampleId: {
      return {
        ...state,
        someExampleId: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
