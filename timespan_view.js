// NOTE: no timespan.js; this needs external state
// TODO: but since it doesn't create its own model wtf do i do
import { pub, sub, NeoHTMLElement, text } from './_.js';
// import DateTime from './datetime.js';

export default class TimespanView extends NeoHTMLElement {
  static name = 'nv-timespan';
  static metatype = 'view';
  
  // TODO: specify time interval somehow? would depend on seconds/ms being present
  
  time({ time }) {
    for (const part in this.parts) {
      const el = this.parts[part];
      switch (part) {
        case 'millisecond-total': text(el, time.toString()); break;
        case 'second-total': text(el, Math.floor(time / 1_000).toString()); break;
        case 'minute-total': text(el, Math.floor(time / 60_000).toString()); break;
        case 'hour-total': text(el, Math.floor(time / 3_600_000).toString()); break;
        case 'day-total': text(el, Math.floor(time / 86_400_000).toString()); break;
        case 'millisecond': text(el, (time % 1000).toString().padStart(3, '0')); break;
        case 'second': text(el, Math.floor(time / 1_000 % 60).toString().padStart(2, '0')); break;
        case 'minute': text(el, Math.floor(time / 60_000 % 60).toString().padStart(2, '0')); break;
        case 'hour': text(el, Math.floor(time / 3_600_000 % 24).toString().padStart(2, '0')); break;
        case 'day': text(el, Math.floor(time / 86_400_000).toString()); break;
      }
    }
  }
  
  static parts = [
    { role: 'millisecond-total', type: 'span' }, { role: 'second-total', type: 'span' }, { role: 'minute-total', type: 'span' },
    { role: 'hour-total', type: 'span' }, { role: 'day-total', type: 'span' },
    { role: 'millisecond', type: 'span' }, { role: 'second', type: 'span' }, { role: 'minute', type: 'span' },
    { role: 'hour', type: 'span' }, { role: 'day', type: 'span' },
  ];
  
  // static model = DateTime;
  static inputs = [{ name: 'time', type: { time: Number } }];
  static output = [];
}

TimespanView.init();
