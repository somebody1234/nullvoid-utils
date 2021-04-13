import { NeoHTMLElement } from '../_.js';
import { importScript, importStyle } from '../_import.js';

importScript('//cdn.jsdelivr.net/gh/dixonandmoe/rellax@master/rellax.min.js');

let rellaxExists = false;

export class Rellax2 extends NeoHTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(this.constructor.template.content.cloneNode(true));
    
    if (rellaxExists) {
      new window.Rellax(this);
    }
    const handle = setInterval(() => {
      if (!('Rellax' in window)) { return; }
      clearInterval(handle);
      new window.Rellax(this);
      rellaxExists = true;
    }, 50);
  }
  
  static template = (() => {
    const el = document.createElement('template');
    el.innerHTML = `\
<style>
:host { display: block; }
</style>
<slot></slot>`;
    return el;
  })();
}

window.customElements.define('nv-rellax', Rellax2);
