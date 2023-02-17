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
export var ChatBotDiagramActionType;
(function (ChatBotDiagramActionType) {
    ChatBotDiagramActionType["setSomeExampleId"] = "refreshSomeExampleId";
})(ChatBotDiagramActionType || (ChatBotDiagramActionType = {}));
//  | SetSomeOtherThing
export var ChatBotDiagramReducer = function (state, action) {
    switch (action.type) {
        case ChatBotDiagramActionType.setSomeExampleId: {
            return __assign(__assign({}, state), { someExampleId: action.payload });
        }
        default: {
            return state;
        }
    }
};
