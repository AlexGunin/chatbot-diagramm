import { Edge, MarkerType } from "reactflow";
import {
  ApplyTraversalCbProps,
  CardAction,
  ChatBotMessage,
  ChatBotNode,
  EdgeSources,
  NodesMap,
  ParentChildMap,
  TraversalCb,
  TraversalCbProps,
} from "./types";
import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from "./constants";
import styles from "./chat-bot-diagram.module.css";

export class GraphService {
  public head?: ChatBotNode;

  public nodes: ChatBotNode[] = [];

  public edges: Edge[] = [];

  protected nodesMap: NodesMap = new Map();

  protected parentChildMap: ParentChildMap = new Map();

  protected edgeSources: EdgeSources = new Map();

  protected unrelatedNodes?: ChatBotNode[];

  constructor(messages: ChatBotMessage[]) {
    [this.nodes, this.edges] = this.transformMessagesToChatBotNodes(messages);
    this.edgeSources = this.createEdgeSources();
    this.nodesMap = this.createNodesMap();
    this.head = this.getHead();
  }

  public getUnrelatedNodes = () => {
    if (!this.unrelatedNodes) this.unrelatedNodes = this.findUnrelatedNodes();
    return this.unrelatedNodes;
  };

  public getOutgoingEdges = (nodeId: string) =>
    this.edgeSources.get(nodeId) ?? new Set();

  public getParentIdByChildId = (childId: string) =>
    this.parentChildMap.get(childId);

  public traversalChildrenNodes = (
    cbs?: TraversalCb | TraversalCb[],
    parent = this.head
  ) => {
    if (!parent) {
      return;
    }
    this.visitedNodes = new Set();
    // const getChildrenNodes = this.createGetChildrenNodes();

    const currentDeepChildren = this.getChildrenNodes(parent.id);

    const nextDeepChildren: ChatBotNode[] = [];

    this.applyTraversalCb({
      cbs,
      parent,
      children: currentDeepChildren,
      deep: parent.data.deep ?? 0,
    });

    while (currentDeepChildren.length || nextDeepChildren.length) {
      if (currentDeepChildren.length === 0) {
        currentDeepChildren.push(...nextDeepChildren);
        nextDeepChildren.length = 0;
      }
      const currentChild = currentDeepChildren.pop();

      if (!currentChild) {
        continue;
      }

      const currentNextChildren = this.getChildrenNodes(currentChild.id);

      this.applyTraversalCb({
        cbs,
        parent: currentChild,
        children: currentNextChildren,
        deep: currentChild.data.deep ?? 1,
      });

      nextDeepChildren.push(...currentNextChildren);
    }
  };

  protected visitedNodes = new Set();

  protected getChildrenNodes = (parentId: string) => {
    // @ts-ignore
    const targetIds = [...this.getTargetIds(parentId)];
    const childrenNodes = targetIds.reduce(
      (acc: ChatBotNode[], targetId: string) => {
        const targetNode = this.nodesMap?.get(targetId);
        if (targetNode && !this.visitedNodes.has(targetNode)) {
          acc.push(targetNode);
          this.visitedNodes.add(targetNode);
        }
        return acc;
      },
      [] as ChatBotNode[]
    );

    return childrenNodes;
  };

  public setParams = ({ parent, children, deep }: TraversalCbProps) => {
    this.setChildrenIds(parent, children);
    this.setDeep(parent, deep);
    this.setParamsToChildren(parent, children, deep + 1);

    this.setNodeToNodesMap(parent);
  };

  protected createGetChildrenNodes = () => {
    const visitedNodes = new Set<ChatBotNode>();

    return (parentId: string) => {
      const targetIds = Array.from(this.getTargetIds(parentId));
      const childrenNodes = targetIds.reduce(
        (acc: ChatBotNode[], targetId: string) => {
          const targetNode = this.nodesMap?.get(targetId);
          if (targetNode && !visitedNodes.has(targetNode)) {
            acc.push(targetNode);
            visitedNodes.add(targetNode);
          }
          return acc;
        },
        [] as ChatBotNode[]
      );
      return childrenNodes;
    };
  };

  protected getTargetIds = (parentId: string) =>
    this.nodesMap?.get(parentId)?.data.targetIds ?? [];

  protected applyTraversalCb = ({
    cbs,
    parent,
    children,
    deep,
  }: ApplyTraversalCbProps) => {
    const traversalCbs = [this.setParams];
    if (cbs) {
      Array.isArray(cbs) ? traversalCbs.push(...cbs) : traversalCbs.push(cbs);
    }
    console.log("APPLY TRAVERSAL CB", traversalCbs, parent, children);
    traversalCbs.forEach((cb: TraversalCb) => cb({ parent, children, deep }));
  };

  protected setChildrenIds = (node: ChatBotNode, children: ChatBotNode[]) => {
    node.data.childrenIds = children.map((child: ChatBotNode) => child.id);
  };

  protected setDeep = (node: ChatBotNode, deep: number) =>
    (node.data.deep = deep);

  protected setParamsToChildren = (
    parent: ChatBotNode,
    children: ChatBotNode[],
    deep: number
  ) =>
    children.forEach((child: ChatBotNode) => {
      this.setParent(child, parent);
      this.setDeep(child, deep);
    });

  protected setParent = (node: ChatBotNode, parent: ChatBotNode) => {
    this.parentChildMap.set(node.id, parent.id);
  };

  protected setNodeToNodesMap = (node: ChatBotNode) =>
    this.nodesMap?.set(node.id, node);

  protected transformMessagesToChatBotNodes = (
    messages: ChatBotMessage[]
  ): [nodes: ChatBotNode[], edges: Edge[]] => {
    const nodes: ChatBotNode[] = [];
    const edges: Set<Edge> = new Set();

    const createEdge = this.cachedCreateEdge();

    messages.forEach((message: ChatBotMessage) => {
      nodes.push(this.createNode(message));
      message.actions.forEach((action: CardAction) => {
        if (action.type !== "reply") {
          return;
        }

        edges.add(createEdge(message.id, action.url));
      });
    });

    return [nodes, Array.from(edges)];
  };

  protected cachedCreateEdge = () => {
    const cache = new Map<string, Edge>();

    return (sourceId: number, targetId: string): Edge => {
      const edgeId = this.createEdgeId(sourceId, targetId);

      if (!cache.has(edgeId)) {
        cache.set(edgeId, {
          id: edgeId,
          source: String(sourceId),
          target: targetId,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
      return cache.get(edgeId) as Edge;
    };
  };

  // eslint-disable-next-line class-methods-use-this
  protected createEdgeId = (
    sourceId: string | number,
    targetId: string | number
  ) => `e${sourceId}-${targetId}`;

  protected createNode = (message: ChatBotMessage): ChatBotNode => ({
    id: String(message.id),
    data: {
      label: message.name,
      isInitial: message.isWelcome,
      targetIds: new Set(),
      childrenIds: [],
    },
    position: { x: 0, y: 0 },
    style: { width: DEFAULT_NODE_WIDTH, height: DEFAULT_NODE_HEIGHT },
    className: message.isWelcome ? "initial" : undefined,
    draggable: false,
    connectable: false,
    deletable: false,
    focusable: false,
  });

  protected createEdgeSources = () => {
    const result: EdgeSources = new Map();

    this.edges.forEach((edge: Edge) => {
      const targetIds = result.get(edge.source) ?? new Set
      console.log('EDGE BEFORE', edge ,targetIds, result)
      result.set(
        edge.source,
        targetIds.add(edge.target)
      );
      console.log('EDGE AFTER', targetIds, result)
    });

    return result;
  };

  protected createNodesMap = () =>
    new Map(
      this.nodes.map((node: ChatBotNode) => {
        const targetIds = this.edgeSources.get(node.id);
        if (targetIds) {
          node.data.targetIds = targetIds;
        }
        return [node.id, node];
      })
    );

  protected findUnrelatedNodes = () =>
    this.nodes.filter(
      (node) =>
        node.data.targetIds.size === 0 &&
        this.getParentIdByChildId(node.id) === undefined
    );

  protected getHead = () =>
    this.nodes.find((node: ChatBotNode) => node.data.isInitial);
}
