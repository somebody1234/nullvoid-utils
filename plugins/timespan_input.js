import { pub, sub, global } from '../_.js';
import TimespanView from '../timespan_view.js';

// TODO: extract into static method?
TimespanView.provides = TimespanView.provides.concat('nv-timespan-input');

sub(global, 'register', ({ el }) => {
  if (!(el instanceof TimespanView)) { return; }
  // TODO: mutationobserver, it's slow so not adding atm
  if ('editable' in el.dataset) {
    for (const name in el.parts) {
      el.parts[name].contentEditable = 'true';
    }
    sub(el, 'register', ({ el }) => {
      el.contentEditable = 'true';
    });
  }
  function update() {
    let time = 0;
    for (const name in el.parts) {
      const value = Number(el.parts[name].innerText) ?? 0;
      switch (name) {
        case 'millisecond': case 'millisecond-total': time += value; break;
        case 'second': case 'second-total': time += value * 1_000; break;
        case 'minute': case 'minute-total': time += value * 60_000; break;
        case 'hour': case 'hour-total': time += value * 3_600_000; break;
        case 'day': case 'day-total': time += value * 86_400_000; break;
      }
    }
    pub(el, 'time', { time });
  }
  sub(el, 'focusin', ({ target }) => {
    const selection = window.getSelection();
    if (target.childNodes[0] === selection.anchorNode && selection.anchorNode === selection.focusNode && selection.anchorOffset !== selection.focusOffset) { return; }
    const range = document.createRange();
    range.setStart(target.childNodes[0], 0);
    range.setEnd(target.childNodes[0], target.textContent.length);
    selection.removeAllRanges();
    selection.addRange(range);
  });
  sub(el, 'keydown', (e) => {
    if (!/[0-9]|Backspace|Delete|Tab/.test(e.key) && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) { e.preventDefault(); e.stopPropagation(); }
    else if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); e.stopPropagation(); }
  });
  sub(el, 'input', ({ target, inputType }) => {
    if (!target.contentEditable) { return; }
    // TODO: move to method?
    update();
  });
  // TODO: race condition
  setTimeout(update, 0);
});
