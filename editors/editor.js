import { ArrayType } from '../_types.js';

export class Node {
  contents = '';
  get children() { return []; }
  
  static type = [{ name: contents, type: String }, { name: children, type: ArrayType.of(Node) }];
};

export default class Editor {
  AST = null;
  // NOTE: open, close etc. are *not* handled by editor. editor mainly handles AST operations
  static actions = [];
}
