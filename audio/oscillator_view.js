import { NeoHTMLElement } from './_.js';

// TODO: localstorage
export default class OscillatorView extends NeoHTMLElement {
  static metatype = 'view';
  static provides = 'nv-audionode';
  
  constructor() {
    super();
    
    this.model = new OscillatorNode();
    const observe = ({ attributeName: attr }) => {
      switch (attr) {
        case 'data-freq': this.model.frequency.value = Number(this.getAttribute(attr));  break;
        case 'data-detune': this.model.detune.value = Number(this.getAttribute(attr)); break;
      }
    };
    const observer = new MutationObserver(observe);
    observer.observe(this, { attributes: true });
  }
  
  // TODO: display type div??? (for arbitrary display)
  static parts = [{ role: display, type: 'span' }, { role: 'content', type: 'div' }];
}

window.customElements.define('nv-oscillator', OscillatorView);
