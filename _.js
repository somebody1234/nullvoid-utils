const EVENT_TYPE_LOOKUP = {
  // resource events
  error: UIEvent, abort: Event, load: Event, beforeunload: Event, unload: Event,
  // network events
  online: Event, offline: Event,
  // focus events
  focus: FocusEvent, blur: FocusEvent, focusin: FocusEvent, focusout: FocusEvent,
  // websocket events
  open: Event, message: MessageEvent, /* error: UIEvent, */ close: CloseEvent,
  // session history events
  pagehide: PageTransitionEvent, pageshow: PageTransitionEvent, popstate: PopStateEvent,
  // css animation events
  animationstart: AnimationEvent, animationcancel: AnimationEvent, animationend: AnimationEvent, animationiteration: AnimationEvent,
  // css transition events
  transitionstart: TransitionEvent, transitioncancel: TransitionEvent, transitionend: TransitionEvent, transitionrun: TransitionEvent,
  // form events
  reset: Event, submit: SubmitEvent,
  // printing events
  beforeprint: Event, afterprint: Event,
  // text composition events
  compositionstart: CompositionEvent, compositionupdate: CompositionEvent, compositioned: CompositionEvent,
  // view events
  fullscreenchange: Event, fullscreenerror: Event, resize: UIEvent, scroll: Event,
  // clipboard events
  cut: ClipboardEvent, copy: ClipboardEvent, paste: ClipboardEvent,
  // keyboard events
  keydown: KeyboardEvent, keypress: KeyboardEvent, keyup: KeyboardEvent,
  // mouse events
  click: MouseEvent,
  // TODO:
  // drag & drop events
  drag: DragEvent, dragend: DragEvent, dragenter: DragEvent, dragstart: DragEvent, dragleave: DragEvent, dragover: DragEvent, drop: DragEvent,
  // TODO: the rest. i'm lazy will do later
  // https://developer.mozilla.org/en-US/docs/Web/Events
  input: InputEvent, change: Event,
};
const EVENTS = new WeakMap();
export function pub(object, event, data) {
  // TODO: !object instanceof NeoHTMLElement maybe
  if (object instanceof EventTarget && event in EVENT_TYPE_LOOKUP) {
    // we're fine with it erroring out (event key not found); we want s p e e d
    object.dispatchEvent(new EVENT_TYPE_LOOKUP[event](event, data));
  }
  if (!EVENTS.has(object)) { return; }
  const callbacks = EVENTS.get(object)[event];
  if (callbacks) {
    for (const callback of callbacks) {
      callback(data);
    }
  }
}
// sub is called waaay less often than pub and hence can be a lot more expensive
export function sub(object, event, callback) {
  if (object instanceof EventTarget && event in EVENT_TYPE_LOOKUP) {
    object.addEventListener(event, callback);
    return function unsub() { object.removeEventListener(event, callback); }
  }
  let dict;
  if (!EVENTS.has(object)) {
    EVENTS.set(object, dict={});
  } else {
    dict = EVENTS.get(object);
  }
  let evList;
  if (event in dict) {
    (evList = dict[event]).push(callback);
  } else {
    evList = dict[event] = [callback];
  }
  return function unsub() {
    evList.splice(evList.indexOf(callback), 1);
  }
}

export function pipe(obj1, evtType1, obj2, evtType2, tf=null) {
  if (tf === null) {
    return sub(obj1, evtType1, (data) => pub(obj2, evtType2, data));
  } else {
    return sub(obj1, evtType1, (data) => pub(obj2, evtType2, tf(data)));
  }
}

export function chain(fn1, fn2) {
  return function chained() { fn1(); fn2(); }
}

export function allChildren(el) {
  const children = Array.from(el.childNodes);
  const queue = Array.from(el.childNodes);
  let next;
  while (next = queue.shift()) {
    children.push(...next.childNodes);
    queue.push(...next.childNodes);
  }
  return children;
}

export class NeoHTMLElement extends HTMLElement {
  /** @type string */
  static metatype = 'element';
  /** @type string[] */
  static provides = [];
  /** @type { [part: string]: HTMLElement } */
  parts = {};
  /** @type any | null */
  model = null;
  /** @type { [part: string]: () => void } */
  unsubs = {};
  
  constructor() {
    super();
    
    if (this.constructor.model) {
      this.model = new this.constructor.model();
    }
    
    for (const event in this.constructor.events) {
      sub(this, event, this.constructor.events[event].bind(this));
    }
    
    // NOTE: while it'd be nice to expose this, we'll be keeping it internal since it'd be a bit awkward to expose an observer observing a subset of properties
    const observe = (muts) => {
      for (const mut of muts) {
        for (const node of mut.addedNodes) {
          if (node instanceof HTMLElement && 'role' in (node.dataset ?? {})) {
            const targetRoles = node.dataset.role.split(' ');
            for (const targetRole of targetRoles) {
              if (targetRole in this.parts) { throw `error: element of type ${this.constructor.name} already has element with role ${targetRole}`; }
              const info = this.constructor.parts.find(({role}) => role === targetRole);
              if (info) {
                // toLowerCase() is ew but oh well
                if (node.tagName.toLowerCase() !== info.type && node.constructor.provides !== info.type && (!Array.isArray(node.constructor.provides) || !node.constructor.provides.includes(info.type))) {
                  throw `expected tag ${info.type} for child element ${info.role}, found ${node.tagName.toLowerCase()}`;
                }
                this.parts[info.role] = node;
                pub(this, 'register', { role: info.role, el: node });
              }
            }
          }
        }
        for (const node of mut.removedNodes) {
          if (node instanceof HTMLElement && 'role' in (node.dataset ?? {})) {
            const targetRoles = node.dataset.role.split(' ');
            for (const targetRole of targetRoles) {
              const info = this.constructor.parts.find(({role}) => role === targetRole);
              // don't error if not the correct node; we assume it's for another element/legacy/future role.
              if (info && this.parts[info.role] === node) {
                this.parts[info.role] = node;
                pub(this, 'unregister', { role: info.role, el: node });
              }
            }
          }
        }
      }
    };
    // NOTE: this needs to run *after* child's constructor
    observe([{ addedNodes: allChildren(this), removedNodes: [] }])
    const observer = new MutationObserver(observe);
    observer.observe(this, { childList: true, subtree: true });
    
    // NOTE: we do not unregister; we trust that any subber will use a WeakRef.
    pub(global, 'register', { el: this });
  }
  
  static init() {
    if (document.readyState === 'complete') { window.customElements.define(this.name, this); }
    else {
      const register = ({}) => { window.removeEventListener('load', register); window.customElements.define(this.name, this); }
      window.addEventListener('load', register);
    }
  }
  
  static inputs = [];
  static outputs = [{ name: 'register', type: { role: String, element: HTMLElement } }, { name: 'unregister', type: { role: String, element: HTMLElement } }];
}

class Global {
  constructor() {}
  
  static inputs = [];
  static outputs = [{ name: 'register', type: { role: String, element: HTMLElement } }, { name: 'unregister', type: { role: String, element: HTMLElement } }];
}
export const global = new Global();

export function text(el, text) {
  if (!el) { return; }
  if (el.childNodes.length === 0) {
    el.appendChild(document.createTextNode(text));
  } else {
    // assume first child is text
    if (text !== el.childNodes[0].nodeValue) {
      el.childNodes[0].nodeValue = text;
    }
  }
}

// NOTE: mainly for testing
window.sub = sub; window.pub = pub; window.pipe = pipe;
