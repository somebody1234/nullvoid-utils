import { pub, sub, global } from '../_.js';

function templateOf(html) {
  if (Array.isArray(html)) { html = html[0]; }
  const el = document.createElement('template');
  el.innerHTML = html;
  return el;
}

const templates = {
  DateTimeView: templateOf`\
<span data-role="hour12">12</span>:<span data-role="minute">00</span>:<span data-role="second">00</span> <span data-role="ampm">am</span>`,
  TimeSpanView: templateOf`\
<span data-role="hour-total">0</span>:<span data-role="minute">00</span>:<span data-role="second">00</span>`,
  StopwatchView: templateOf`\
<div>
  <nv-timespan data-role="display"><span data-role="hour-total">0</span>:<span data-role="minute">00</span>:<span data-role="second">00</span>.<span data-role="millisecond">000</span></nv-timespan>
</div>
<div>
  <button data-role="toggle">Start</button>
  <button data-role="reset">Reset</button>
</div>`,
  TimerView: null,
  NotesView: null,
  // TODO: all they keys and shit. this will be a big one
  CalculatorView: null,
};

sub(global, 'register', ({ element: el }) => {
  setTimeout(() => {
    // TODO: 0 might not me enough timeout
    if (el.childNodes.length === 1 && el.childNodes[0] instanceof Text && /^\s+$/.test(el.childNodes[0].nodeValue)) {
      el.removeChild(el.firstChild);
    }
    if (el.childNodes.length === 0) {
      if (el.constructor.name in templates) {
        for (const child of templates[el.constructor.name].content.childNodes) {
          el.appendChild(child.cloneNode(true));
        }
      }
    }
  }, 0);
});
