export default class AlwaysActive extends HTMLElement {
  static metatype = 'element';
  static meta = { alwaysActive: true };
  
  constructor() {
    super();
  }
}

window.customElements.define('nv-alwaysactive', AlwaysActive);
