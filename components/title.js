export default class Title extends HTMLElement {
  static metatype = 'element';
  static provides = ['title'];
  static meta = { alwaysActive: true };
  
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(this.constructor.template.content.cloneNode(true));
    
    // TODO: idk how to do this properly
    const observer = new MutationObserver(() => { if (document.title !== this.textContent) { document.title = this.textContent } });
    observer.observe(this, { characterData: true, subtree: true });
  }
  
  static template = (() => {
    const el = document.createElement('template');
    el.innerHTML = `\
<style>
:host {
  display: none;
}
</style>
<slot></slot>`;
    return el;
  })();
}

window.customElements.define('nv-title', Title);
