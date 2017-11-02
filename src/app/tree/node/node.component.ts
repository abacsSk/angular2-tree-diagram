import {
  Component,
  Input
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { TreeDiagramNode } from '../classes/tree-diagram-node.class';
import { TreeDiagramNodeMaker } from '../classes/tree-diagram-node-maker.class';
import { NodesListService } from '../services/nodes-list.service';

@Component({
  selector: '[treeDiagramNode]',
  styleUrls: [ './node.component.scss' ],
  templateUrl: './node.component.html',
})
export class NodeComponent {

  public node: TreeDiagramNode | TreeDiagramNodeMaker;
  public childrenTransform;

  constructor(
      private nodesSrv: NodesListService,
      private sanitizer: DomSanitizer,
  ) { }

  @Input() set treeDiagramNode (guid) {
    this.node = this.nodesSrv.getNode(guid);
    this.childrenTransform = this.sanitizer.bypassSecurityTrustStyle(
        `translate(calc(-50% + ${Math.round(this.node.width / 2)}px), 45px)`
    );
  }

  public isEditable (): boolean {
    return ! this.node.config.readOnly;
  }

}
