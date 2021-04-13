import { NeoHTMLElement } from './_.js';
import Calculator from './calculator.js';

// TODO: localstorage
export default class CalculatorView extends NeoHTMLElement {
  static name = 'nv-calculator';
  static metatype = 'view';
  
  static events = {
    register({ role, el }) {
      let unsub;
      switch (role) {
        //
      }
      if (unsub) {
        this.unsubs[role] = { element: el, unsub };
      }
    },
    unregister({ role,  el }) {
      if (!(role in unsubs)) { return; }
      const { element: el2, unsub } = this.unsubs[role];
      // wrong element; ignore
      if (el !== el2) { return; }
      unsub();
    }
  };
  
  static model = Calculator;
  // TODO: display type div??? (for arbitrary display)
  static parts = [{ role: display, type: 'span' }, { role: 'content', type: 'div' }];
}

CalculatorView.init();
