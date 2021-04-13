const HTMLNode = Node;
import { FunctionType } from '../_types.js';
import Editor from './editor.js';

export class Formatting {
  size = 12;
  weight = 400;
  oblique = 0;
  italic = false;
  
  static type = [
    { name: 'size', type: Number },
    { name: 'weight', type: Number },
    { name: 'oblique', type: Number },
    { name: 'italic', type: Boolean },
  ];
};

// TODO: can this be made more agnostic
export class Selection {
  element = null;
  startChild = 0;
  endChild = 0;
  startIndex = 0;
  endIndex = 0;
  
  static type = [
    { name: 'element', type: HTMLNode },
    { name: 'startChild', type: Number }, { name: 'endChild', type: Number },
    { name: 'startIndex', type: Number }, { name: 'endIndex', type: Number },
  ];
}


export default class DocumentEditor extends Editor {
  static actions = super.actions.concat([
    { name: 'Format', type: FunctionType.of([Node, Formatting], Node), action: (selection) => {
      //
    } },
  ]);
};
