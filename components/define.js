export default class Define extends HTMLElement {
  static metatype = 'element';
  name = '';
  template = document.createElement('template');
  class = null;
  
  constructor() {
    super();
    
    const self = this;
    this.name = this.getAttribute('data-name');
    this.class = { [name]: class {
      constructor() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(self.template.content.cloneNode(true));
      }
    } };
    const observe = () => {
      template.innerHTML = this.innerHTML;
    };
    const observer = new MutationObserver(observe);
    observer.observe(this, { childList: true, subtree: true });
    window.customElements.define(name, this.class);
  }
}

window.customElements.define('nv-define', Define);
