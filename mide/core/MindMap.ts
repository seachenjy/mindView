import { MindMapNode, defaultStyle, allNodeBound, rootNode } from './MindMapNode';
import {SVG,Svg,Box} from '@svgdotjs/svg.js';


export class MindMap {
  /** svg */
  draw: Svg;

  /** 根节点 */
  root: MindMapNode|null = null;

  /** 当前节点 */
  currentNode: MindMapNode|null = null;

  _id:number = 1;

  //dom容器
  _selector: HTMLElement;

  constructor(selector: HTMLElement) {
    // 初始化dom容器
    this._selector = selector;
    this.draw = SVG().size(selector.clientWidth, selector.clientHeight).addTo(selector);
  }

  getBoundingBox():Box {
    return this.draw.bbox();
  }

  //递归获得当前节点下所有子节点的边界框,返回最大的边界框
  getChildrenBound(node: MindMapNode):allNodeBound {
    let bounds:allNodeBound = {
      minX: Number.MAX_VALUE,
      minY: Number.MAX_VALUE,
      maxX: Number.MIN_VALUE,
      maxY: Number.MIN_VALUE,
    };
    node.children.forEach(child => {
      const box = child._svgElement?.bbox();
      bounds.minX = Math.min(bounds.minX, box?.x || 0);
      bounds.minY = Math.min(bounds.minY, box?.y || 0);
      bounds.maxX = Math.max(bounds.maxX, box?.x || 0);
      bounds.maxY = Math.max(bounds.maxY, box?.y || 0);
      const childBounds = this.getChildrenBound(child);
      bounds.minX = Math.min(bounds.minX, childBounds.minX);
      bounds.minY = Math.min(bounds.minY, childBounds.minY);
      bounds.maxX = Math.max(bounds.maxX, childBounds.maxX);
      bounds.maxY = Math.max(bounds.maxY, childBounds.maxY);
    })
    
    return bounds;
  }

  
  /**
   * 递归遍历每个节点的子节点
   * @param node 节点
   * @param parentX 父节点的x坐标
   * @param parentY 父节点的y坐标
   * @param parentNode 父节点对象
   * @param siblingIndex 兄弟节点索引
   */
  renderNode(node: MindMapNode, parentX: number, parentY: number, parentNode?: MindMapNode, siblingIndex?: number) {
    // 绘制当前节点
    node._svgElement = this.draw.foreignObject(100, 50).move(parentX, parentY);
    const _dom = document.createElement('div');
    //点击事件
    node._svgElement.on('click',() => {
      console.log('click')
      this.currentNode = node;
      this.addNode('new node');
    })
    let backgroundColor = node.style?.backgroundColor || defaultStyle.backgroundColor;
    if(this.currentNode == node) {
      backgroundColor = '#fc0';
      node._svgElement.node.innerHTML = _dom.innerHTML
    }
    node._svgElement.node.innerHTML = `<div style="
    width: 100px; 
    height: 50px; 
    padding: ${node.style?.padding || defaultStyle.padding}px;
    background-color: ${backgroundColor}; 
    color: ${node.style?.color || defaultStyle.color}; 
    font-size: ${node.style?.fontSize || defaultStyle.fontSize}px; 
    font-weight: ${node.style?.fontWeight || defaultStyle.fontWeight}; 
    line-height: ${node.style?.lineHeight || defaultStyle.lineHeight};
    ">${node.text}</div>`;

    
    // 计算子节点的位置
    if (node.children.length > 0) {
      const childX = parentX + 150; // 子节点在父节点右侧150px
      const nodeHeight = 60; // 每个节点高度50px，间距10px
      
      // 计算子节点的起始Y坐标
      // 从父节点中心开始垂直排列
      let startY = parentY - (node.children.length * nodeHeight) / 2 + nodeHeight / 2;
      
      // 考虑父节点的兄弟节点，调整子节点的垂直位置
      if (parentNode && siblingIndex !== undefined) {
        // 计算前面兄弟节点的总高度
        let previousSiblingsHeight = 0;
        for (let i = 0; i < siblingIndex; i++) {
          const sibling = parentNode.children[i];
          // 计算兄弟节点的子节点数量
          const siblingChildCount = this.getNodeCount(sibling);
          // 每个子节点占用60px高度
          previousSiblingsHeight += Math.max(1, siblingChildCount) * nodeHeight;
        }
        
        // 调整起始Y坐标，避免与前面兄弟节点的子节点重叠
        startY += previousSiblingsHeight;
      }
      
      // 递归遍历每个子节点的子节点
      node.children.forEach((child, index) => {
        const childY = startY + index * nodeHeight; // 每个子节点垂直间距60px
        this.renderNode(child, childX, childY, node, index);
        
        // 绘制连接线
        this.draw.line(parentX + 100, parentY + 25, childX, childY + 25)
          .stroke({ width: 2, color: '#999' });
      });
    }
  }

  /**
   * 获取节点的子节点数量（包括所有层级）
   * @param node 节点
   * @returns 子节点数量
   */
  getNodeCount(node: MindMapNode): number {
    let count = 0;
    if (node.children) {
      count = node.children.length;
      node.children.forEach(child => {
        count += this.getNodeCount(child);
      });
    }
    return count;
  }

  /**
   * 添加节点
   * @param text 节点文本
   */
  addNode(text:string) {
    if(!this.currentNode) {
      this.currentNode = this.root = {
        id: (this._id++).toString(),
        text,
        children: [],
        parent: rootNode,
      };
      this.renderNode(this.root, 300, 100);
    }else{
      this.currentNode.children.push({
        id: (this._id++).toString(),
        text,
        children: [],
        parent: this.currentNode,
      });
    }
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
