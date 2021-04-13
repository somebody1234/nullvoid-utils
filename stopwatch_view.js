import { sub, NeoHTMLElement, text } from './_.js';
import Stopwatch from './stopwatch.js';

export default class StopwatchView extends NeoHTMLElement {
  static name = 'nv-stopwatch';
  static metatype = 'view';
  
  static events = {
    register({ role, el }) {
      let unsub;
      switch (role) {
        case 'display': unsub = sub(this.model, 'tick', ({ tick }) => el.time({ time: tick })); break;
        case 'start': unsub = sub(el, 'click', () => this.model.start()); break;
        case 'stop': unsub = sub(el, 'click', () => this.model.stop()); break;
        case 'toggle':
          unsub = sub(el, 'click', () => {
            if (this.model.started) {
              // TODO: control text through attributes
              text(el, 'Start');
              this.model.stop();
            } else {
              text(el, 'Stop');
              this.model.start();
            }
          });
          break;
        case 'reset': unsub = sub(el, 'click', () => { text(this.parts.toggle, 'Start'); this.model.reset(); }); break;
      }
      if (unsub) {
        this.unsubs[role] = { el, unsub };
      }
    },
    unregister({ role, el }) {
      if (!(role in unsubs)) { return; }
      const { el: el2, unsub } = this.unsubs[role];
      // wrong element; ignore
      if (el !== el2) { return; }
      unsub();
    }
  };
  
  static model = Stopwatch;
  static parts = [{ role: 'display', type: 'nv-timespan' }, { role: 'start', type: 'button' }, { role: 'stop', type: 'button' }, { role: 'toggle', type: 'button' }, { role: 'reset', type: 'button' }];
}

StopwatchView.init();
