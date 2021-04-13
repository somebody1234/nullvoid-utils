import { sub } from './_.js';

export default class Notes {
  notes = [];
  
  constructor() {
    // NOTE: this.notes isn't just for text.
    
    // NOTE: no need to send events; others can subscribe to the same events
    sub(this, 'insert', ({ position: pos, value: val }) => {
      this.notes.splice(pos, 0, val);
    });
    
    sub(this, 'remove', ({ position: pos }) => {
      this.notes.splice(pos, 1);
    });
    
    sub(this, 'move', ({ source: src, destination: dest }) => {
      this.notes.splice(dest - (dest > src), 0, this.notes.splice(src, 1));
    });
  }
  
  static inputs = [
    { name: 'insert', type: { position: Number, value: null } },
    { name: 'remove', type: { position: Number } },
    { name: 'move', type: { source: Number, destination: Number } }
  ];
  static outputs = [];
  
  static events = new Set(['insert', 'remove', 'move']);
}
