import { NeoHTMLElement } from '../_.js';
import { importScript, importStyle } from '../_import.js';

importStyle('//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10/build/styles/default.min.css');
importScript('//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10/build/highlight.min.js');
/* global hljs */

// this looks
// not half bad tbh
// is it actually visible anywhere @panekk ~grian

let hljsExists = false;

export class HLJS extends NeoHTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(this.constructor.template.content.cloneNode(true));
    
    if (hljsExists) {
      this.classList.add('language-' + this.getAttribute('data-language'));
      hljs.highlightBlock(this);
      this.classList.remove('language-' + this.getAttribute('data-language'));
    }
    const handle = setInterval(() => {
      if (!('hljs' in window)) { return; }
      clearInterval(handle);
      hljsExists = true;
      this.classList.add('language-' + this.getAttribute('data-language'));
      // TODO: it's getting replaced with some other thing
      hljs.highlightBlock(this);
      this.classList.remove('language-' + this.getAttribute('data-language'));
    }, 50);
  }
  
  static template = (() => {
    const el = document.createElement('template');
    el.innerHTML = `\
<style>
:host { font-family: monospace; background-color: var(--secondary-background) !important; }
</style>
<slot></slot>`;
    return el;
  })();
}
export default HLJS;

window.customElements.define('nv-hljs', HLJS);
