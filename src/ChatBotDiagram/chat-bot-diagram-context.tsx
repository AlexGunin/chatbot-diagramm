import React, {
  Dispatch, ReactNode, createContext, useReducer,
} from 'react';
import { ReactFlowProvider } from 'reactflow';
import {
  ChatBotDiagramAction,
  ChatBotDiagramReducer,
} from './chat-bot-diagram-reducer';
import { ChatBotDiagramState } from './types';
import { CHAT_BOT_DIAGRAM_INITIAL_STATE } from './constants';

const ChatBotDiagramStateContext = createContext<ChatBotDiagramState>(
  CHAT_BOT_DIAGRAM_INITIAL_STATE,
);
ChatBotDiagramStateContext.displayName = 'Состояние диаграмм чатбота';
const ChatBotDiagramDispatchContext = createContext<
  Dispatch<ChatBotDiagramAction>
>(() => {});
ChatBotDiagramDispatchContext.displayName = 'Диспатчер диаграмм чатбота';

interface Props {
  children: ReactNode;
  initialState?: ChatBotDiagramState;
}

export function ChatBotDiagramContextProvider({
  children,
  initialState = CHAT_BOT_DIAGRAM_INITIAL_STATE,
}: Props) {
  const [state, dispatch] = useReducer(ChatBotDiagramReducer, {
    ...CHAT_BOT_DIAGRAM_INITIAL_STATE,
  });

  return (
    <ChatBotDiagramStateContext.Provider value={state}>
      <ChatBotDiagramDispatchContext.Provider value={dispatch}>
        <ReactFlowProvider>{children}</ReactFlowProvider>
      </ChatBotDiagramDispatchContext.Provider>
    </ChatBotDiagramStateContext.Provider>
  );
}

export const useChatBotDiagramStateContext = () => {
  const context = React.useContext(ChatBotDiagramStateContext);
  if (context === undefined) {
    throw new Error(
      'useChatBotStateContext must be used within the ChatBotDiagramContext provider',
    );
  }
  return context;
};

export const useChatBotDiagramDispatchContext = () => {
  const context = React.useContext(ChatBotDiagramDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useChatBotDiagramDispatchContext must be used within the ChatBotDiagramContext provider',
    );
  }
  return context;
};
