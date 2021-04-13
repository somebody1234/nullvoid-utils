import { pub, sub } from './_.js';

// TODO: extend with power
export default class Calculator {
  static metatype = 'model';
  // TODO: make prec list configurable directly maybe
  // but this make updating prec table hard.
  static precedences = (() => {
    const list = [
      ['p+', 'p-'],
      ['*', '/'],
      ['+', '-']
    ];
    const precs = {};
    for (let i = 0; i < list.length; i++) {
      const prec = precs.length - i - 1;
      for (const op of list[i]) {
        precs[op] = prec;
      }
    }
    return precs;
  })();
  static evalPrefix = { '+': n => n, '-': n => -n };
  static evalInfix = { '*': (l, r) => l * r, '/': (l, r) => l / r, '+': (l, r) => l + r, '-': (l, r) => l - r };
  static rightIdentity = { '*': 1, '/': 1, '+': 0, '-': 0 };
  stack = [];
  opStack = [];
  tokens = [];
  
  // TODO: need to retain parens to autoString )
  constructor() {
  }
  
  character({ character: char }) {
    switch (char) {
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        if (!this.tokens.length || this.tokens[this.tokens.length - 1].type !== 'number') {
          this.tokens.push({ type: 'number', value: char });
        } else {
          this.tokens[this.tokens.length - 1].value += char;
        }
        break;
      case '.':
        if (!this.tokens.length || this.tokens[this.tokens.length - 1].type !== 'number') {
          // NOTE: this is currently the sole case where this adds more than one character
          this.tokens.push({ type: 'number', value: '0.' });
        } else if (this.tokens[this.tokens.length - 1].type === 'number') {
          if (this.tokens[this.tokens.length - 1].value.includes('.')) { /* invalid */ return; }
          this.tokens[this.tokens.length - 1].value += char;
        }
        break;
      case '*': case '/': case '+': case '-':
        this.tokens.push({ type: 'operator', value: char });
        break;
      case '(': this.tokens.push({ type: 'left_paren', value: char }); break;
      case ')': this.tokens.push({ type: 'right_paren', value: char }); break;
      default: return; // no effect
    }
    // NOTE: ok so technically this adds another character too; however it does not add any information so needs no special handling.
    if (this.tokens.length > 1 && this.tokens[this.tokens.length - 2].type === 'number' && this.tokens[this.tokens.length - 2].value.endsWith('.')) {
      this.tokens[this.tokens.length - 2].value += '0';
    }
    this.continueParse();
  }

  backspace() {
    if (!this.tokens.length) { return; }
    const last = this.tokens[this.tokens.length - 1];
    if (last.value.length === 1) { this.tokens.pop(); this.parse(); return; }
    last.value = last.value.slice(0, -1);
    this.recalculate();
  }

  clear() {
    this.stack = [];
    this.opStack = [];
    this.tokens = [];
    pub(this, 'value', { value: 0 });
    pub(this, 'string', { string: '' });
    pub(this, 'autoString', { autoString: '' });
  }
  
  parse() {
    // TODO
    this.continueParse();
  }
  
  continueParse() {
    // TODO
    this.recalculate();
  }
  
  recalculate() {
    const stack = this.stack.slice();
    const opStack = this.opStack.slice();
    let op;
    let autoString = '';
    while ((op = opStack.pop())) {
      if (op.string === '()') {
        if (stack.length === 0) { autoString += ')'; }
      } else if (op.isPrefix) {
        stack.push(evalPrefix[op.string](stack.pop() ?? rightIdentity[op.string]));
        if (stack.length === 0) { autoString += ' ' + op.string + rightIdentity[op.string]; }
      } else {
        const right = stack.length > 0 ? stack.pop() : rightIdentity[op.string];
        // it's impossible to have an infix operator without already having left side ofc.
        const left = stack.pop();
        // TODO: right order?
        stack.push(evalInfix[op.string](left, right));
        if (stack.length === 0) { autoString += ' ' + op.string + ' ' + rightIdentity[op.string]; }
      }
    }
    // TODO: collapse stack and opStack using rightIdentity
    pub(this, 'value', { value: stack[0] });
    let string = '';
    // TODO: is this needed?
    let prevType = null;
    for (const token of tokens) {
      switch (token.type) {
        case 'number':
          if (prevType === 'operator') { string += ' '; }
          string += token.value;
          break;
        case 'left_paren':
          if (prevType === 'operator') { string += ' '; }
          string += token.value;
          break;
        case 'operator':
          // TODO: should also be space if after infix operator
          if (prevType === 'right_paren' || prevType === 'number') { string += ' '; }
          string += token.value;
          break;
        default: string += token.value; break;
      }
      prevType = token.type;
    }
    pub(this, 'string', { string });
    pub(this, 'autoString', { autoString });
  }

  // TODO: add parse, continueParse, and recalculate i guess?
  static inputs = [{ name: 'character', type: { character: String } }, { name: 'backspace', type: {} }, { name: 'clear', type: {} }];
  static outputs = [{ name: 'value', type: { value: Number } }, { name: 'string', type: { string: String } }, { name: 'autoString', type: { autoString: String } }];
}
