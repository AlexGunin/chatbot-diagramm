import React, { useCallback } from "react";
import ReactFlow, { NodeMouseHandler } from "reactflow";
import { useGetMessages } from "./useGetMessages";
import { useGetChatBotParams } from "./useGetChatBotParams";
import "reactflow/dist/style.css";
import styles from "./chat-bot-diagram.module.css";

export interface ChatBotDiagramProps {
  height: number;
  onClick?: (messageId: number) => void;
}

const isFn = (value: unknown): value is Function => typeof value === "function";

export function ChatBotDiagram({ height, onClick }: ChatBotDiagramProps) {
  const messages = useGetMessages();
  const { zoom, zoomOut, zoomIn, ...props } = useGetChatBotParams(messages);

  const onNodeClick: NodeMouseHandler = useCallback(
    (e, node) => {
      if (!node || !isFn(onClick)) return;
      onClick(Number(node.id));
    },
    [onClick]
  );

  return (
    <div style={{ height }}>
      <ReactFlow
        onNodeClick={onNodeClick}
        className={styles.wrapper}
        fitView
        {...props}
      >
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.buttonControls}
            onClick={() => zoomOut()}
          >
            -
          </button>
          <span className={styles.zoomControls}>{zoom}</span>
          <button
            type="button"
            className={styles.buttonControls}
            onClick={() => zoomIn()}
          >
            +
          </button>
        </div>
      </ReactFlow>
    </div>
  );
}
