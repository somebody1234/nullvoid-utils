import { sub, chain, NeoHTMLElement, text } from './_.js';
import Timer from './timer.js';

export default class TimerView extends NeoHTMLElement {
  static name = 'nv-timer';
  static metatype = 'view';
  
  static events = {
    register({ role, el }) {
      let unsub;
      switch (role) {
        case 'display': unsub = sub(this.model, 'tick', ({ tick }) => el.time({ time: tick })); break;
        case 'input': unsub = sub(el, 'time', ({ time }) => this.model.set({ duration: time })); break;
        case 'start': unsub = sub(el, 'click', ({}) => this.model.start()); break;
        case 'stop': unsub = sub(el, 'click', ({}) => this.model.stop()); break;
        case 'toggle':
          unsub = chain(sub(el, 'click', () => {
            if (this.model.started) {
              // TODO: control text through attributes
              text(el, 'Start');
              this.model.stop();
            } else {
              text(el, 'Stop');
              this.model.start();
            }
          }), sub(this.model, 'end', () => {
            text(el, 'Start');
          }));
          break;
        case 'reset': unsub = sub(el, 'click', ({}) => { text(this.parts.toggle, 'Start'); this.model.reset(); }); break;
        case 'alarm': unsub = sub(this.model, 'end', ({}) => el.play()); break;
      }
      if (unsub) {
        this.unsubs[role] = { element: el, unsub };
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
  
  static model = Timer;
  static parts = [ { role: 'display', type: 'nv-timespan' }, { role: 'input', type: 'nv-timespan-input' }, { role: 'start', type: 'button' }, { role: 'stop', type: 'button' }, { role: 'toggle', type: 'button' }, { role: 'reset', type: 'button' }, { role: 'alarm', type: 'audio' } ];
}

TimerView.init();
