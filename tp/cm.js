import { NeoHTMLElement } from '../_.js';
import { importScript, importStyle } from '../_import.js';

const start = new Date();
importStyle('//cdn.jsdelivr.net/npm/codemirror@5/lib/codemirror.min.css');
importScript('//cdn.jsdelivr.net/npm/codemirror@5/lib/codemirror.min.js');
/* global CodeMirror */

let cmExists = false;

export default class CodeMirror extends NeoHTMLElement {
  editor = null;
  
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(this.constructor.template.content.cloneNode(true));
    
    if (cmExists) {
      this.editor = CodeMirror(this);
    }
    const handle = setInterval(() => {
      if (!('hljs' in window)) { return; }
      clearInterval(handle);
      cmExists = true;
      this.editor = CodeMirror(this);
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

window.customElements.define('nv-cm', CodeMirror);
