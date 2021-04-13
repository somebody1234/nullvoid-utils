import { sub } from './_.js';

export default class Audio {
  context = new AudioContext();
  nodes = [];
  current = null;
  
  constructor() {
    sub(this, 'set', ({ nodes: nodesArg }) => {
      const oldNodes = this.nodes;
      const nodes = this.nodes = [];
      if (nodes.length === 0) {
        if (this.current) {
          for (const node of oldNodes) { node.disconnect(); }
          this.current.disconnect();
          this.current = null;
        }
        return;
      }
      for (const { node, inputs } of nodesArg) {
        nodes.push(node);
        node.disconnect();
        for (const input of inputs) { nodes[input].connect(node); }
      }
      if (this.current) { this.current.disconnect(); }
      this.current = nodes[nodes.length - 1];
      this.current.connect(this.context.destination);
    });
  }
  
  static inputs = [
    { name: 'set', type: { nodes: [AudioNode] } }
  ];
  static outputs = [];
  
  static events = new Set(['set']);
}
