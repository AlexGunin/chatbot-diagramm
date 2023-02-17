import type {
  Edge,
  ZoomInOut,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Viewport,
  NodeMouseHandler,
} from "reactflow";
import { useCallback, useLayoutEffect, useMemo } from "react";
import {
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useViewport,
} from "reactflow";
import { ChatBotMessage, ChatBotNode } from "./types";
import { DEFAULT_LAYOUT_OPTIONS } from "./constants";
import { GraphService } from "./GraphService";
import { LayoutService } from "./LayoutService";

interface ChatBotParams {
  nodes: ChatBotNode[];
  edges: Edge[];
  zoomIn: ZoomInOut;
  zoomOut: ZoomInOut;
  zoom: string;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  // onConnect: OnConnect;
  defaultViewport: Viewport;
  onNodeMouseEnter: NodeMouseHandler;
  onNodeMouseLeave: NodeMouseHandler;
}

const DEFAULT_VIEWPORT = { x: 0, y: 0, zoom: 1 };
const TRANSITION_DURATION = 800;

export const useGetChatBotParams = (
  messages: ChatBotMessage[]
): ChatBotParams => {
  const chatBotGraphService = useMemo(
    () => new GraphService(messages),
    [messages]
  );
  const layoutService = useMemo(
    () => new LayoutService(chatBotGraphService, DEFAULT_LAYOUT_OPTIONS),
    [chatBotGraphService]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useLayoutEffect(() => {
    layoutService.layout();
    setNodes(chatBotGraphService.nodes);
    setEdges(chatBotGraphService.edges);
  }, [messages]);

  const { zoomIn: zoomInSharp, zoomOut: zoomOutSharp } = useReactFlow();
  const { zoom } = useViewport();

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    []
  );
  const zoomIn = useCallback(
    () => zoomInSharp({ duration: TRANSITION_DURATION }),
    [zoom]
  );
  const zoomOut = useCallback(
    () => zoomOutSharp({ duration: TRANSITION_DURATION }),
    [zoom]
  );
  console.log("LAYOUT SERVICE", layoutService, chatBotGraphService);
  const onNodeMouseEnter: ChatBotParams["onNodeMouseEnter"] = useCallback(
    (event, node) => {
      if (!node) return;
      const targetNodes = chatBotGraphService.getOutgoingEdges(node.id);
      if (!targetNodes.size) return;

      setEdges((prev) =>
        prev.map((edge) => {
          const isActive =
            targetNodes.has(edge.target) && edge.source === node.id;

          return {
            ...edge,
            style: {
              ...edge.style,
              stroke: isActive ? "#0097FD" : "#E2E5EB",
            },
            markerEnd:
              edge.markerEnd && typeof edge.markerEnd !== "string"
                ? {
                    ...edge.markerEnd,
                    color: isActive ? "#0097FD" : "#E2E5EB",
                  }
                : undefined,
          };
        })
      );
      setNodes((prev) =>
        prev.map((item) =>
          item.id === node.id
            ? {
                ...node,
                style: {
                  ...node.style,
                  backgroundColor: "rgba(225,243,254,0.5)",
                  border: "1px solid #0097FD",
                  color: "#0097FD",
                },
              }
            : item
        )
      );
    },
    []
  );

  const onNodeMouseLeave: ChatBotParams["onNodeMouseLeave"] = useCallback(
    (event, node) => {
      if (!node) return;

      setEdges(chatBotGraphService.edges);
      setNodes(chatBotGraphService.nodes);
    },
    []
  );

  const percentageZoom = useMemo(() => `${Math.floor(zoom * 100)}%`, [zoom]);

  return {
    // @ts-ignore
    nodes,
    edges,
    zoom: percentageZoom,
    zoomIn,
    zoomOut,
    onNodesChange,
    onEdgesChange,
    // onConnect,
    defaultViewport: DEFAULT_VIEWPORT,
    onNodeMouseEnter,
    onNodeMouseLeave,
  };
};
