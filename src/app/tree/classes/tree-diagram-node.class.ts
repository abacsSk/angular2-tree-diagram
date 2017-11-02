import { TreeDiagramNodesList } from './tree-diagram-nodes-list.class';

export class TreeDiagramNode {

  public parentId: string | null;
  public guid: string;
  public width: number;
  public height: number;
  public isDragover: boolean;
  public isDragging: boolean;
  public children: Set<string>;
  public displayName: string;

  public config;

  private _toggle: boolean;

  constructor (props, config, public getThisNodeList: () => TreeDiagramNodesList) {
    if (!props.guid) {
      return;
    }
    for (let prop in props) {
      if (props.hasOwnProperty(prop)) {
        this[prop] = props[prop];
      }
    }

    this._toggle = false;

    this.config = config;

    if (config.nodeWidth) {
      this.width = config.nodeWidth;
    }
    if (config.nodeHeight) {
      this.height = config.nodeHeight;
    }
    this.children = new Set(<string[]> props.children);
  }

  public destroy () {
    this.getThisNodeList().destroy(this.guid);
  }

  public get isExpanded () {
    return this._toggle;
  }

  public hasChildren () {
    return !!this.children.size;
  }

  public toggle (state = !this._toggle) {
    this._toggle = state;
    return state && this.getThisNodeList().toggleSiblings(this.guid);
  }

  public childrenCount () {
    return this.children.size;
  }

  public isRoot () {
    return this.parentId == null;
  }

  public dragenter (event): void {
    if (this.config.readOnly) {
      return;
    }
    event.dataTransfer.dropEffect = 'move';
  }

  public dragleave (event): void {
    if (this.config.readOnly) {
      return;
    }
    this.isDragover = false;
  }

  public dragstart (event): void {
    if (this.config.readOnly) {
      return;
    }

    event.dataTransfer.effectAllowed = 'move';
    this.isDragging = true;
    this.toggle(false);
    this.getThisNodeList().draggingNodeGuid = this.guid;
  }

  public dragover (event): boolean {
    if (this.config.readOnly) {
      return false;
    }

    event.preventDefault();
    if (!this.isDragging) {
      this.isDragover = true;
    }
    event.dataTransfer.dropEffect = 'move';
    return false;
  }

  public dragend (event): void {
    if (this.config.readOnly) {
      return;
    }

    this.isDragover = false;
    this.isDragging = false;
  }

  public drop (event): boolean {
    if (this.config.readOnly) {
        return false;
    }

    event.preventDefault();
    let guid = this.getThisNodeList().draggingNodeGuid;
    this.getThisNodeList().transfer(guid, this.guid);
    return false;
  }

  public addChild () {
    let newNodeGuid = this.getThisNodeList().newNode(this.guid);
    this.children.add(newNodeGuid);
    this.toggle(true);
  }

}
