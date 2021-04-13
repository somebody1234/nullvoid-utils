export default class Fullscreen extends HTMLElement {
  static metatype = 'element';
  
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(this.constructor.template.content.cloneNode(true));
  }
  
  static template = (() => {
    const el = document.createElement('template');
    el.innerHTML = `\
<style>
:host {
  position: fixed;
  width: 100vw;
  height: 100vh;
}
::slotted(*) {
  width: 100%;
  height: 100%;
}
</style>
<slot></slot>`;
    return el;
  })();
}

window.customElements.define('nv-fullscreen', Fullscreen);
