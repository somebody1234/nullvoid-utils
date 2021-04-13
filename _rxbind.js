import { pub, sub } from './_.js';
import { rx } from './_rx.js';

function inputValueFn(input) {
  return input instanceof HTMLTextAreaElement ? () => input.value :
    input.type === 'number' ? () => +input.value :
    input.type === 'date' || input.type === 'datetime-local' ? () => new Date(input.value) :
    () => input.value;
}

const vars = {};
for (const el of document.querySelectorAll('[data-bind]')) {
  const name = el.dataset.bind;
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    const getValue = inputValueFn(el);
    vars[name] = getValue();
    sub(el, 'input', (e) => { window[name] = getValue(); });
  } else {
    vars[name] = '';
    sub(window, name, (e) => { el.innerText = window[name]; });
  }
}

rx(vars, window);
