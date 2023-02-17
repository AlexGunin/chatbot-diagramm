import React from "react";
import "./App.css";
import { ChatBotDiagram } from "./ChatBotDiagram/ChatBotDiagram";

function App() {
  return (
    <div className="App">
      <ChatBotDiagram height={850} onClick={() => null} />
    </div>
  );
}

export default App;
