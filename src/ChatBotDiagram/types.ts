import { Node } from "reactflow";

export interface ChatBotDiagramState {
  someExampleId: string;
}

export interface CardAction {
  suggestionId: string;
  type: "url" | "phone" | "reply";
  displayText: string;
  url: string;
  phone: number;
}

export interface RichCard {
  title: string;
  description: string;
  attachmentId: number;
  attachmentUrl: string;
  actions: CardAction[];
}

export interface Geolocation {
  title: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface ChatBotMessage {
  id: number;
  name: string;
  isWelcome?: boolean;
  chatBotMessageType?: "richcards" | "geolocation";
  chatBotScriptId?: number;
  status?:
    | "CREATED"
    | "MODERATION"
    | "MODERATION_FAILED"
    | "MODERATION_SUCCESS";
  richCards?: RichCard[];
  geolocations?: Geolocation[];
  actions: CardAction[];
}

type ChildId = string;
type ParentId = string;
type TargetNodeId = NodeId;
export type ParentChildMap = Map<ChildId, ParentId>;

export type EdgeSources = Map<NodeId, Set<TargetNodeId>>;

interface NodeData {
  label: string;
  targetIds: Set<TargetNodeId>;
  childrenIds: string[];
  deep?: number;
  isInitial?: boolean;
}

type NodeId = string;

type BoxId = string;

export type NodeTypes = "initial" | "message";

export type ChatBotNode = Node<NodeData, NodeTypes>;

export type NodesMap = Map<NodeId, ChatBotNode>;

export interface TraversalCbProps {
  parent: ChatBotNode;
  children: ChatBotNode[];
  deep: number;
}

export type TraversalCb = (props: TraversalCbProps) => void;

export interface ApplyTraversalCbProps extends TraversalCbProps {
  cbs?: TraversalCb | TraversalCb[];
}

export interface LayoutOptions {
  verticalGap: number;
  horizontalGap: number;
}

export interface BoxPosition {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Box {
  id: BoxId;
  parent?: Box;
  children: Box[];
  size: Size;
  position: BoxPosition;
  node: ChatBotNode;
}

export type Boxes = Map<BoxId, Box>;
