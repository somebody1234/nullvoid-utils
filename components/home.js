export default class Home extends HTMLElement {
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
<a href="/">
  <svg width="24" height="24" viewBox="0 0 4 4">
    <path fill="currentColor" d="M 0 2  L 2 0  L 4 2 v 2  h -4"/>
  </svg>
</a>`;
    return el;
  })();
}

window.customElements.define('nv-home', Home);
