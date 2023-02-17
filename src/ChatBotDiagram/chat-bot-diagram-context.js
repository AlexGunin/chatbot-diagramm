var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useReducer, } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { ChatBotDiagramReducer, } from './chat-bot-diagram-reducer';
import { CHAT_BOT_DIAGRAM_INITIAL_STATE } from './constants';
var ChatBotDiagramStateContext = createContext(CHAT_BOT_DIAGRAM_INITIAL_STATE);
ChatBotDiagramStateContext.displayName = 'Состояние диаграмм чатбота';
var ChatBotDiagramDispatchContext = createContext(function () { });
ChatBotDiagramDispatchContext.displayName = 'Диспатчер диаграмм чатбота';
export function ChatBotDiagramContextProvider(_a) {
    var children = _a.children, _b = _a.initialState, initialState = _b === void 0 ? CHAT_BOT_DIAGRAM_INITIAL_STATE : _b;
    var _c = useReducer(ChatBotDiagramReducer, __assign({}, CHAT_BOT_DIAGRAM_INITIAL_STATE)), state = _c[0], dispatch = _c[1];
    return (_jsx(ChatBotDiagramStateContext.Provider, __assign({ value: state }, { children: _jsx(ChatBotDiagramDispatchContext.Provider, __assign({ value: dispatch }, { children: _jsx(ReactFlowProvider, { children: children }) })) })));
}
export var useChatBotDiagramStateContext = function () {
    var context = React.useContext(ChatBotDiagramStateContext);
    if (context === undefined) {
        throw new Error('useChatBotStateContext must be used within the ChatBotDiagramContext provider');
    }
    return context;
};
export var useChatBotDiagramDispatchContext = function () {
    var context = React.useContext(ChatBotDiagramDispatchContext);
    if (context === undefined) {
        throw new Error('useChatBotDiagramDispatchContext must be used within the ChatBotDiagramContext provider');
    }
    return context;
};
