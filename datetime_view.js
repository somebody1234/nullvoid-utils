import { pub, sub, NeoHTMLElement, text } from './_.js';
// import DateTime from './datetime.js';

export default class DateTimeView extends NeoHTMLElement {
  static name = 'nv-datetime';
  static metatype = 'view';
  
  time({ time }) {
    for (const part in this.parts) {
      const el = this.parts[part];
      switch (part) {
        case 'millisecond': text(el, time.getMilliseconds().toString().padStart(3, '0')); break;
        case 'second': text(el, time.getSeconds().toString().padStart(2, '0')); break;
        case 'minute': text(el, time.getMinutes().toString().padStart(2, '0')); break;
        case 'hour': case 'hour12': text(el, (time.getHours() + 11) % 12 + 1); break;
        case 'hour24': text(el, time.getHours().toString().padStart(2, '0')); break;
        case 'ampm': text(el, time.getHours() > 12 ? 'pm' : 'am'); break;
        case 'dayOfWeek': text(el, [
          'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ][time.getDay()]);break;
        case 'date': text(el, time.getDate()); break;
        case 'month': text(el, [
          'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ][time.getMonth()]); break;
        case 'monthNumber': text(el, time.getMonth() + 1); break;
        case 'year': text(el, time.getYear() + 1900); break;
      }
    }
  }
  
  static inputs = [{ name: 'time', type: { time: Date } }];
  static outputs = [];
  
  static parts = [
    { role: 'millisecond', type: 'span' }, { role: 'second', type: 'span' }, { role: 'minute', type: 'span' },
    { role: 'hour12', type: 'span' }, { role: 'hour24', type: 'span' }, { role: 'ampm', type: 'span' },
    { role: 'dayOfWeek', type: 'span' }, { role: 'date', type: 'span' },
    { role: 'month', type: 'span' }, { role: 'monthNumber', type: 'span' }, { role: 'year', type: 'span' }
  ];
}

DateTimeView.init();
