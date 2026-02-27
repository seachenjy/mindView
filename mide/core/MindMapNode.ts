import { ForeignObject, Svg } from '@svgdotjs/svg.js';

export interface MindMapNodeStyle {
    backgroundColor: string;
    color: string;
    fontSize: number;
    fontWeight: string;
    lineHeight: number;
    padding: number;
}

export const defaultStyle: MindMapNodeStyle = {
  backgroundColor: '#f0f0f0',
  color: '#000000',
  fontSize: 14,
  fontWeight: 'normal',
  lineHeight: 1.5,
  padding: 8,
};

/**连线样式枚举 */
export enum LineStyle {
  Solid = 'solid',
  Dashed = 'dashed',
  Dotted = 'dotted',
}

export interface MindMapLineStyle {
    color: string;
    width: number;
    style: LineStyle;
}

export const defaultLineStyle: MindMapLineStyle = {
  color: '#000000',
  width: 1,
  style: LineStyle.Solid,
};

/** 脑图节点 */
export interface MindMapNode {
  /** 节点ID */
  id: string;
  /** 节点文字 */
  text: string;
  /** 子节点 */
  children: MindMapNode[];
  /** 样式 */
  style?: MindMapNodeStyle;
  /** 连线样式 */
  lineStyle?: MindMapLineStyle;
  /** dom元素 */
  _svgElement?: ForeignObject;
}

/**node节点的svg矩形呈现 */
export function createNodeSvgElement(draw: Svg,node: MindMapNode): Svg {
  const { text, style, lineStyle } = node;
  const { backgroundColor, color, fontSize, fontWeight, lineHeight, padding } = style || defaultStyle;
  const { color: lineColor, width: lineWidth, style: lineStyleEnum } = lineStyle || defaultLineStyle;

  // 创建矩形元素
  const rect = draw.rect().attr({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    fill: backgroundColor,
    stroke: lineColor,
    'stroke-width': lineWidth,
    'stroke-dasharray': lineStyleEnum === LineStyle.Dashed ? '5,5' : lineStyleEnum === LineStyle.Dotted ? '1,1' : undefined,
  });
  // 创建文本元素
  const textElement = draw.text(text).attr({
    x: padding,
    y: padding + fontSize,
    fill: color,
    'font-size': fontSize,
    'font-weight': fontWeight,
    'line-height': lineHeight,
  });
  // 设置文本元素的位置
  textElement.move(padding, padding + fontSize);
  // 返回svg元素
  return draw;

}
