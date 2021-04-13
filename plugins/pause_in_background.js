// TODO: should probs also expose list of elements
import { sub, global } from '../_.js';

let elements = [];

// TODO: weakref support not great. will be better soon but might need to find other solns in the meantime.
sub(global, 'register', ({ el }) => {
  if (el.constructor.model && el.constructor.model.inputs && el.constructor.model.inputs.some(i => i.name === 'resume') && el.constructor.model.inputs.some(i => i.name === 'pause')) {
    elements.push(new WeakRef(el));
  }
});

sub(window, 'focus', () => {
  outer: for (const el of (elements = elements.filter(el => el.deref())).map(el => el.deref())) {
    let parent = el;
    while (parent) {
      if (parent.constructor.meta && parent.constructor.meta.alwaysActive) { continue outer; }
      parent = parent.parentElement;
    }
    el.model.resume();
  }
});

sub(window, 'blur', () => {
  outer: for (const el of (elements = elements.filter(el => el.deref())).map(el => el.deref())) {
    let parent = el;
    while (parent) {
      if (parent.constructor.meta && parent.constructor.meta.alwaysActive) { continue outer; }
      parent = parent.parentElement;
    }
    el.model.pause();
  }
});
