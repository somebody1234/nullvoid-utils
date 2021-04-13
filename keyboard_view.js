// TODO: on screen keyboard
export default class KeyboardView extends NeoHTMLElement {
  static metatype = 'view';
  unshiftMap = {
    '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0'
  };
  
  constructor() {
    super();
    
    // TODO: switch this based on keyboard layout.
    const 
    // TODO: figure out the layout
/*
<div>
  <div data-role="`">`</div>
  <div data=role="1">1</div>
  <div data=role="2">2</div>
  <div data=role="3">3</div>
  <div data=role="4">4</div>
  <div data=role="5">5</div>
  <div data=role="6">6</div>
  <div data=role="7">7</div>
  <div data=role="8">8</div>
  <div data=role="9">9</div>
  <div data=role="0">0</div>
  <div data=role="-">-</div>
  <div data=role="=">=</div>
  <div data=role="\b">Backspace</div>
</div>
<div>
  <div data-role="\t">Tab</div>
  <div data-role="q">Q</div>
  <div data-role="w">W</div>
  <div data-role="e">E</div>
  <div data-role="r">R</div>
  <div data-role="t">T</div>
  <div data-role="y">Y</div>
  <div data-role="u">U</div>
  <div data-role="i">I</div>
  <div data-role="o">O</div>
  <div data-role="p">P</div>
  <div data-role="[">[</div>
  <div data-role="]">]</div>
  <div data-role="]">]</div>
  <div data-role="\\">\</div>
</div>
<div>
  <div data-role="\CapsLock">Caps Lock</div>
  <div data-role="a">A</div>
  <div data-role="s">S</div>
  <div data-role="d">D</div>
  <div data-role="f">F</div>
  <div data-role="g">G</div>
  <div data-role="h">H</div>
  <div data-role="j">J</div>
  <div data-role="k">K</div>
  <div data-role="l">L</div>
  <div data-role=";">;</div>
  <div data-role="'">'</div>
  <div data-role="\n">Enter</div>
</div>
<div>
  <div data-role="\ShiftL">Shift</div>
  <div data-role="z">Z</div>
  <div data-role="x">X</div>
  <div data-role="c">C</div>
  <div data-role="v">V</div>
  <div data-role="b">B</div>
  <div data-role="n">N</div>
  <div data-role="m">M</div>
  <div data-role=",">,</div>
  <div data-role=".">/</div>
  <div data-role="/">/</div>
  <div data-role="\ShiftR">Shift</div>
</div>
<div>
  <div data-role="\CtrlL">Ctrl</div>
  <div data-role="\Fn">Fn</div>
  <div data-role="\Super">{}</div>
  <div data-role="\AltL">Alt</div>
  <div data-role=" ">Space</div>
  <div data-role="\AltR">Alt Gr</div>
  <div data-role="\CtrlR">Ctrl</div>
  <div data-role="m">M</div>
  <div data-role=",">,</div>
  <div data-role=".">/</div>
  <div data-role="/">/</div>
  <div data-role="\ShiftR">Shift</div>
</div>
*/
  }
  
  static model = Keyboard;
  // TODO: display type div??? (for arbitrary display)
  static parts = [{ role: display, type: 'span' }, { role: 'content', type: 'div' }];
}

window.customElements.define('nv-keyboard', KeyboardView);

