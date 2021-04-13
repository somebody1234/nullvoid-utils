import { NeoHTMLElement } from './_.js';
import Audio from './audio.js';

// TODO: localstorage
export default class AudioView extends NeoHTMLElement {
  static metatype = 'view';
  
  constructor() {
    super();
    
    const observe = () => {
      // TODO
      const names = {};
      const nodes = [];
      for (const child of this.children) {
        if (child.constructor.provides === 'nv-audionode') {
          //
        }
      }
    };
    setTimeout(() => observe(), 0);
    const observer = new MutationObserver(observe);
    // we don't observe attributes since children are expected to handle their own attributes
    observer.observe(this, { childList: true, subtree: true });
  }
  
  static model = Audio;
  // TODO: display type div??? (for arbitrary display)
  static parts = [{ role: display, type: 'span' }, { role: 'content', type: 'div' }];
}

window.customElements.define('nv-audio', AudioView);
