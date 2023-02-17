import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from "./constants";
import { GraphService } from "./GraphService";
import {
  Box,
  Boxes,
  BoxPosition,
  LayoutOptions,
  Size,
  TraversalCbProps,
  ChatBotNode,
} from "./types";

export class LayoutService {
  protected boxes: Boxes = new Map();

  protected graphService: GraphService;

  protected layoutOptions: LayoutOptions;

  constructor(graphService: GraphService, layoutOptions: LayoutOptions) {
    this.graphService = graphService;
    this.layoutOptions = layoutOptions;
  }

  public layout = () => {
    this.graphService.traversalChildrenNodes([this.layoutBox]);

    const headBox = this.getBoxById(this.graphService.head?.id);

    if (!headBox) return;

    this.updateChildrenBoxesPosition(headBox);
    this.layoutUnrelatedNodes(headBox);
  };

  protected layoutBox = ({ parent, children }: TraversalCbProps) => {
    const parentBox = this.createBoxIfNotExist(parent);

    this.createChildrenBoxes(parentBox, children);
    this.updateBoxSize(parentBox);
  };

  protected createBoxIfNotExist = (node: ChatBotNode) => {
    if (!this.boxes.has(node.id)) {
      this.createDefaultBox(node);
    }

    return this.getBoxById(node.id) as Box;
  };

  protected createDefaultBox = (node: ChatBotNode): Box => {
    const box = {
      id: node.id,
      parent: this.getBoxById(this.graphService.getParentIdByChildId(node.id)),
      children: [],
      position: this.getDefaultBoxPosition(node),
      size: this.getNodeSize(node),
      node,
    };

    this.boxes.set(node.id, box);

    return box;
  };

  protected getBoxById = (boxId?: string) =>
    boxId ? this.boxes.get(boxId) : undefined;

  protected getDefaultBoxPosition = (node: ChatBotNode): BoxPosition => ({
    x: node.position.x,
    y: node.position.y,
  });

  protected getNodeSize = (node: ChatBotNode): Size => ({
    width: Number(node.style?.width) ?? DEFAULT_NODE_WIDTH,
    height: Number(node.style?.height) ?? DEFAULT_NODE_HEIGHT,
  });

  protected createChildrenBoxes = (parent: Box, children: ChatBotNode[]) => {
    const childrenBoxes = children.map(this.createDefaultBox);
    this.setChildBoxesToParent(parent, childrenBoxes);

    return childrenBoxes;
  };

  protected setChildBoxesToParent = (parent: Box, children: Box[]) => {
    parent.children = children;
    this.boxes.set(parent.id, parent);
  };

  protected updateBoxSize = (box: Box) => {
    const newSize = {
      width: Math.max(box.size.width, this.getChildrenWidth(box.children)),
      height: Math.max(
        box.size.height,
        this.calculateBoxHeightWithChildren(box)
      ),
    };

    const isSameSize = this.checkIsSameSize(box.size, newSize);

    if (!isSameSize) {
      box.size = newSize;
      this.boxes.set(box.id, box);
    }

    if (!box.parent) return;

    this.updateBoxSize(box.parent);
  };

  protected getChildrenWidth = (children: Box[]) => {
    const sumChildrenWidth = children.reduce(
      (acc: number, cur: Box) => acc + cur.size.width,
      0
    );
    const sumChildrenGap =
      (children.length - 1) * this.layoutOptions.horizontalGap;

    return sumChildrenGap + sumChildrenWidth;
  };

  protected calculateBoxHeightWithChildren = (parent: Box) => {
    const maxChildrenHeight = Math.max(
      ...parent.children.map((child: Box) => child.size.height)
    );
    return (
      this.getNodeSize(parent.node).height +
      this.layoutOptions.verticalGap +
      maxChildrenHeight
    );
  };

  protected layoutUnrelatedNodes = (headBox: Box) => {
    const nodes = this.graphService.getUnrelatedNodes();

    nodes.forEach((node, index) => {
      const prev = nodes[index - 1];
      const nodeSize = this.getNodeSize(node);

      if (prev) {
        let carryRow = 0;
        const prevNodeSize = this.getNodeSize(prev);
        const positionX =
          prev.position.x +
          prevNodeSize.width +
          this.layoutOptions.horizontalGap;
        if (
          positionX + nodeSize.width >
          headBox.position.x + headBox.size.width
        )
          carryRow = 1;
        const prevBasedX = carryRow === 1 ? headBox.position.x : positionX;
        const prevBasedY =
          carryRow === 1
            ? prev.position.y +
              prevNodeSize.height +
              this.layoutOptions.verticalGap
            : prev.position.y;
        node.position = {
          x: prevBasedX,
          y: prevBasedY,
        };
      } else {
        node.position = {
          x: headBox.position.x,
          y:
            headBox.position.y +
            headBox.size.height +
            this.layoutOptions.verticalGap * 2,
        };
      }
    });
  };

  protected checkIsSameSize = (oldSize: Size, newSize: Size) =>
    oldSize.width === newSize.width && oldSize.height === newSize.height;

  protected updateChildrenBoxesPosition = (parentBox: Box) => {
    const parentNodeSize = this.getNodeSize(parentBox.node);

    parentBox.node.position = this.getNodePositionRelativeToParentBox(
      parentBox,
      parentNodeSize.width
    );

    parentBox.children.forEach((childBox: Box, index: number, arr: Box[]) => {
      const prevChildBox = arr[index - 1];

      const position = this.getBoxPositionRelativeToParentBox(
        parentBox,
        parentNodeSize,
        prevChildBox
      );

      childBox.position = position;

      this.updateChildrenBoxesPosition(childBox);
    });
  };

  protected getNodePositionRelativeToParentBox = (
    parentBox: Box,
    nodeWidth: number
  ) => ({
    x: parentBox.position.x + parentBox.size.width / 2 - nodeWidth / 2,
    y: parentBox.position.y,
  });

  protected getBoxPositionRelativeToParentBox = (
    parentBox: Box,
    parentNodeSize: Size,
    prevChildBox?: Box
  ): BoxPosition => ({
    x: prevChildBox
      ? this.getCoordinateRelativeToPreviousBox(prevChildBox)
      : parentBox.position.x,
    y:
      parentBox.position.y +
      parentNodeSize.height +
      this.layoutOptions.verticalGap,
  });

  protected getCoordinateRelativeToPreviousBox = (box: Box) =>
    box.position.x + box.size.width + this.layoutOptions.horizontalGap;
}
