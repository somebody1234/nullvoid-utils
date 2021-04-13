import { NeoHTMLElement } from './_.js';
import Notes from './notes.js';

// TODO: localstorage
export default class NotesView extends NeoHTMLElement {
  static name = 'nv-notes';
  static metatype = 'view';
  
  constructor() {
    super();
    
    sub(this, 'register', ({ role, element: el }) => {
      let unsub;
      switch (role) {
        case 'list':
          // TODO
          break;
        case 'content': break;
      }
      if (unsub) {
        this.unsubs[role] = { element: el, unsub };
      }
    });
    sub(this, 'unregister', ({ role, element: el }) => {
      if (!(role in unsubs)) { return; }
      const { element: el2, unsub } = this.unsubs[role];
      // wrong element; ignore
      if (el !== el2) { return; }
      unsub();
    });
  }
  
  static model = Notes;
  // TODO: a way to render arbitrary content to a div
  // ideally with the ability to diff too - just like text
  // however note that this is a lot less important
  // granted, it won't work with collaborative editing - on-get-note would place cursor
  static parts = [{ role: 'list', type: 'ul' }, { role: 'content', type: 'div' }];
}

NotesView.init();
