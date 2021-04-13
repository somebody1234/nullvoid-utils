import { GenericType, ArrayType, FunctionType } from './_t.js';

// TODO: output detection
// numbers within a certain range become dates apparently? (+/-5 years)
// json becomes, well, json
// yaml ini etc.
// base64 base32 binary hex octal. especially if delimited
// 

const tools = [
  {
    name: 'Split String',
    type: FunctionType.of([String, String], ArrayType.of(String)),
    inputNames: ['string', 'delimiter'],
    fn: (string, delimiter) => string.split(delimiter),
    code: ([string, delimiter]) => `${string}.split(${delimiter})`
  },
  // TODO: might want restrictions for generics. e.g. ListRestriction.of(a, b, c)
  {
    name: 'Convert to Number',
    // String, BigInt, Boolean.
    type: GenericType.of(([a]) => FunctionType.of([a], Number)),
    inputNames: ['value'],
    fn: (value) => Number(value)
  },
  {
    name: 'Convert to BigInt',
    // String, Number, Boolean. can error.
    type: GenericType.of(([a]) => FunctionType.of([a], BigInt)),
    inputNames: ['value'],
    fn: (value) => BigInt(value)
  },
  {
    name: 'Convert to String',
    // String, Number, Boolean, BigInt, Date, Symbol (? - idk how useful symbol is).
    type: GenericType.of(([a]) => FunctionType.of([a], Number)),
    inputNames: ['value'],
    fn: (value) => String(value)
  },
  // NOTE: no convert to date; dates should be parsed. no convert to symbol since usefulness questionable
  {
    name: 'Convert to Boolean',
    // String, Number, Boolean, BigInt. I guess? Date probs doesn't make sense
    type: GenericType.of(([a]) => FunctionType.of([a], Boolean)),
    inputNames: ['value'],
    fn: (value) => Boolean(value)
  },
  // NOTE: lowercase by default. idk if it should be configurable
  // maximum base 36 ofc.
  // TODO: same, but for bigint
  {
    name: 'Number to Base String',
    type: FunctionType.of([Number, Number], String),
    inputNames: ['number', 'base'],
    fn: (number, base) => number.toString(base)
  },
  // TODO: this should use bigint
  {
    name: 'Base String to Base String',
    type: FunctionType.of([String, Number, Number], String),
    inputNames: ['number', 'source base', 'target base'],
    fn: (number, sourceBase, targetBase) => parseInt(number, sourceBase).toString(targetBase)
  },
  {
    name: 'Base String to Number',
    type: FunctionType.of([String, Number], Number),
    inputNames: ['number', 'base'],
    fn: (number, base) => parseInt(number, base)
  },
  {
    name: 'Sort Alphabetically',
    type: FunctionType.of([ArrayType.of(String)], ArrayType.of(String)),
    inputNames: ['list'],
    fn: (list) => list.sort()
  },
  {
    name: 'Sort Numbers',
    type: FunctionType.of([ArrayType.of(Number)], ArrayType.of(Number)),
    inputNames: ['list'],
    fn: (list) => list.sort((a, b) => a - b)
  },
  {
    name: 'Sort BigInts',
    type: FunctionType.of([ArrayType.of(BigInt)], ArrayType.of(BigInt)),
    inputNames: ['list'],
    fn: (list) => list.sort((a, b) => a > b ? 1 : a < b : -1 : 0)
  },
  {
    name: 'Sort Array Lexicographically',
    type: GenericType.of(([a]) => FunctionType.of([ArrayType.of(a)], ArrayType.of(a))),
    inputNames: ['list'],
    fn: (list) => list.sort((a, b) => {
      const len = Math.min(a.length, b.length);
      for (let i = 0; i < len; i++) {
        // TODO: allow custom comparison function
        // especially since this won't work for objects
        if (a[i] > b[i]) { return 1; }
        else if (a[i] < b[i]) { return -1; }
      }
      return a.length - b.length;
    })
  },
  {
    name: 'Clamp',
    type: FunctionType.of([Number, Number, Number], Number),
    inputNames: ['value', 'minimum', 'maximum'],
    fn: (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value))
  },
  {
    name: 'Parse JSON',
    type: GenericType.of(([a]) => FunctionType.of([String], a)),
    inputNames: ['json'],
    // TODO: serde style parse to arbitrary type
    fn: (json) => JSON.parse(json),
  },
  {
    name: 'Deparse JSON',
    type: GenericType.of(([a]) => FunctionType.of([a], String)),
    inputNames: ['value'],
    // TODO: serde style deparse to arbitrary type
    fn: (value) => JSON.stringify(value),
  },
  // TODO: json.parse, json.stringify, ini.parse, ini.stringify
  // various crypto things like hashes and shit
  // number add/subtract/multiply/to the power of (n^2)/used as power (2^n)
  // also and, or, xor etc.
  // zip and shit and rearrange and sort
];
