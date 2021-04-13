export default class Back extends HTMLElement {
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
a {
  color: unset;
  text-decoration: unset;
}
</style>
<a href="..">
  <svg width="24" height="24" viewBox="0 0 4 4">
    <path fill="currentColor" d="M 0 2  L 2 0  v 1  h 2  v 2  h -2 v 1"/>
  </svg>
</a>`;
    return el;
  })();
}

window.customElements.define('nv-back', Back);
