// TODO: might not work right with display: block etc?

export default class Center extends HTMLElement {
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
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
  text-align: center;
}
.flex-h {
  display: flex;
  flex-flow: row nowrap;
}
.filler {
  flex: 1 0 auto;
}
</style>
<div class="filler"></div>
<div class="flex-h"><div class="filler"></div><slot></slot><div class="filler"></div></div>
<div class="filler"></div>`;
    return el;
  })();
}

window.customElements.define('nv-center', Center);
