import { MindMapNode, defaultStyle } from './MindMapNode';
import { ref,reactive,effect } from 'vue';
import {SVG,Svg} from '@svgdotjs/svg.js';

export class MindMap {
  /** svg */
  draw: Svg;

  /** 根节点 */
  root: MindMapNode;

  /** 当前节点 */
  currentNode: MindMapNode;

  _id:number = 1;

  //dom容器
  _selector: HTMLElement;

  constructor(selector: HTMLElement) {
    this.root = {
      id: (this._id++).toString(),
      text: 'Root Node',
      children: [],
    };
    // 初始化dom容器
    this._selector = selector;
    this.currentNode = reactive(this.root);
    this.draw = SVG().size(selector.clientWidth, selector.clientHeight).addTo(selector);
    // 计算中心位置放置root节点
    const centerX = (this._selector.clientWidth) / 2  - 300;
    const centerY = (this._selector.clientHeight) / 2 - 100;
    // 递归遍历每个节点的子节点
    this.renderNode(this.root, centerX, centerY);
  }

  
  /**
   * 递归遍历每个节点的子节点
   * @param node 节点
   * @param parentX 父节点的x坐标
   * @param parentY 父节点的y坐标
   */
  renderNode(node: MindMapNode, parentX: number, parentY: number) {
    // 计算子节点的位置
    const childX = parentX + 150;
    const childY = parentY;
    // 绘制子节点
    node._svgElement = this.draw.foreignObject(100, 50).move(childX, childY);
    node._svgElement.node.innerHTML = `<div style="
    width: 100px; 
    height: 50px; 
    padding: ${node.style?.padding || defaultStyle.padding}px;
    background-color: ${node.style?.backgroundColor || defaultStyle.backgroundColor}; 
    color: ${node.style?.color || defaultStyle.color}; 
    font-size: ${node.style?.fontSize || defaultStyle.fontSize}px; 
    font-weight: ${node.style?.fontWeight || defaultStyle.fontWeight}; 
    line-height: ${node.style?.lineHeight || defaultStyle.lineHeight};
    ">${node.text}</div>`;
    // 递归遍历每个子节点的子节点
    node.children.forEach((child) => {
      this.renderNode(child, childX, childY);
    });
  }

  /**
   * 添加节点
   * @param node 节点
   */
  addNode(text:string) {
    this.currentNode.children.push({
      id: (this._id++).toString(),
      text,
      children: [],
    });
    // 计算当前节点的位置
    const parentX = this.currentNode._svgElement?.x() as number || 0;
    const parentY = this.currentNode._svgElement?.y() as number || 0;
    const lastIndex = this.currentNode.children.length - 1;
    this.renderNode(this.currentNode.children[lastIndex], parentX, parentY);
  }

  /**
   * 转换为json字符串
   * @returns json字符串
   */
  toJson() {

    return JSON.stringify(this.root,(key, value) => {
      if (/^_/.test(key)) {
        return undefined   // 返回 undefined 会被忽略
      }
      return value
    });
  }

}
