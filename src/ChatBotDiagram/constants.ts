import { ChatBotDiagramState, ChatBotMessage, LayoutOptions } from "./types";

export const CHAT_BOT_DIAGRAM_INITIAL_STATE: ChatBotDiagramState = {
  someExampleId: "",
};

export const DEFAULT_NODE_WIDTH = 162;
export const DEFAULT_NODE_HEIGHT = 54;

export const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
  verticalGap: 60,
  horizontalGap: 40,
};

export const MOCK_CHATBOT_MESSAGES: ChatBotMessage[] = [
  {
    id: 1,
    name: "Приветственное",
    isWelcome: true,
    actions: [
      {
        suggestionId: "1",
        type: "reply",
        displayText: "Test",
        url: "2",
        phone: 123,
      },
      {
        suggestionId: "2",
        type: "reply",
        displayText: "Test3",
        url: "21",
        phone: 123,
      },
      {
        suggestionId: "3",
        type: "reply",
        displayText: "Test2",
        url: "3",
        phone: 123,
      },
      {
        suggestionId: "4",
        type: "reply",
        displayText: "Test2",
        url: "100",
        phone: 123,
      },
      {
        suggestionId: "5",
        type: "phone",
        displayText: "Test3",
        url: "3",
        phone: 123,
      },
    ],
  },
  {
    id: 2,
    name: "Курсы ЕГЭ",
    actions: [      {
      suggestionId: "3",
      type: "reply",
      displayText: "Test2",
      url: "101",
      phone: 123,
    },
      {
        suggestionId: "4",
        type: "reply",
        displayText: "Test2",
        url: "102",
        phone: 123,
      },],
  },
  {
    id: 21,
    name: "Курсы ЕГЭ2",
    actions: [],
  },
  {
    id: 3,
    name: "Курсы ОГЭ",
    actions: [
      {
        suggestionId: "5",
        type: "reply",
        displayText: "Test",
        url: "4",
        phone: 123,
      },
      {
        suggestionId: "7",
        type: "reply",
        displayText: "Test",
        url: "5",
        phone: 123,
      },
    ],
  },
  {
    id: 4,
    name: "Новое сообщение",
    actions: [
      {
        suggestionId: "6",
        type: "reply",
        displayText: "Test",
        url: "3",
        phone: 123,
      },
    ],
  },
  {
    id: 5,
    name: "Новое сообщение5",
    actions: [],
  },
  {
    id: 100,
    name: "Новое сообщение",
    actions: [],
  },
  {
    id: 101,
    name: "Новое сообщение",
    actions: [],
  },
  {
    id: 102,
    name: "Новое сообщение",
    actions: [],
  },
  {
    id: 103,
    name: "Новое сообщение",
    actions: [],
  },
  {
    id: 104,
    name: "Новое сообщение",
    actions: [],
  },
  {
    id: 105,
    name: "Новое сообщение",
    actions: [],
  },
];
