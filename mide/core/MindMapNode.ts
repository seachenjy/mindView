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
export const rootNode:Symbol = Symbol('rootNode');
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
  /** 父节点 */
  parent: MindMapNode|Symbol;
  /** dom元素 */
  _svgElement?: ForeignObject;
}

/** 所有节点的边界框 */
export interface allNodeBound {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}