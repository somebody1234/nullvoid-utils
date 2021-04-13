import { sub, NeoHTMLElement } from './_.js';
import Now from './now.js';

export default class NowView extends NeoHTMLElement {
  static name = 'nv-now';
  static metatype = 'view';
  unsubs = {};
  
  // TODO: specify time interval somehow? would depend on seconds/ms being present
  // TODO: parameter to use a different timezone? (or even utc)
  
  static events = {
    register({ role, el }) {
      switch (role) {
        case 'datetime': this.unsubs.datetime = sub(this.model, 'tick', ({ tick }) => el.time({ time: tick })); break;
      }
    },
    unregister({ role, el }) {
      if (!(role in unsubs)) { return; }
      const { element: el2, unsub } = this.unsubs[role];
      // wrong element; ignore
      if (el !== el2) { return; }
      unsub();
    }
  };
  
  static parts = [{ role: 'datetime', type: 'nv-datetime' }];
  static model = Now;
}

NowView.init();
