export class ArgumentError extends Error { constructor(message) { super(message); } }

function cyrb32(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  return Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909) >>> 0;
  // h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
  // h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
  // return 4294967296 * (2097151 & h2) + (h1>>>0);
}

function cyrb32i(ints, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (const ch of ints) {
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  return Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909) >>> 0;
  // h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
  // h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
  // return 4294967296 * (2097151 & h2) + (h1>>>0);
}

export class Scope {
  constructor(parent=new Map(), lookup=new Map()) { this.parent = parent; this.lookup = lookup; }
  has(key) { return this.lookup.has(key) || this.parent.has(key); }
  get(key) { return this.lookup.has(key) ? this.lookup.get(key) : this.parent.get(key); }
  set(key, value) {
    if (this.lookup.has(key)) { this.lookup.set(key, value); }
    else if (this.parent.has(key)) { this.parent.set(key, value); }
    else { this.lookup.set(key, value); }
  }
}

const TYPE_CACHE_BUCKETS = 1 << 16; const TYPE_CACHE_BUCKET_MASK = TYPE_CACHE_BUCKETS - 1; const TYPE_CACHE = Array(TYPE_CACHE_BUCKETS);
const TYPE_ID_MAP = new Map(); let NEXT_TYPE_ID = 0;
function typeId(type) {
  if (TYPE_ID_MAP.has(type)) { return TYPE_ID_MAP.get(type); }
  else { TYPE_ID_MAP.set(type, NEXT_TYPE_ID++); }
}
function typeHash(type) {
  if (type.constructor === Function) { return typeId(type); }
  else if (type instanceof Type) { return type.hash !== null ? type.hash : type.hash = type.calculateHash(); }
}

export function typeEq(a, b, proj=new Map()) {
  if (a === b) { return true; }
  if (a.constructor !== b.constructor) { return false; }
  if ((typeof a === 'symbol' && typeof 'b' === symbol) && !proj.has(a)) { proj.lookup.set(a, b); }
  if (proj.get(a) === b) { return true; }
  switch (a.constructor) {
    case GenericType: return typeEq(a.type, b.type, new Scope(proj));
    case ArrayType: return typeEq(a.itemType, b.itemType, proj);
    case DictionaryType: return typeEq(a.keyType, b.keyType, proj) && typeEq(a.valueType, b.valueType, proj);
    case FunctionType: return a.inputTypes.length === b.inputTypes.length &&
      typeEq(a.outputType, b.outputType, proj) &&
      a.inputTypes.every((type, i) => typesMatch(type, b.inputTypes[i], proj));
  }
  return false;
}

export function typeMatch(a, b, proj=new Map()) {
  if (a === b) { return true; }
  if (a.constructor !== b.constructor) { return false; }
  if ((typeof a === 'symbol' || typeof 'b' === symbol) && !proj.has(a)) { proj.lookup.set(a, b); }
  if (proj.get(a) === b) { return true; }
  switch (a.constructor) {
    case GenericType: return typeMatch(a.type, b.type, new Scope(proj));
    case ArrayType: return typeMatch(a.itemType, b.itemType, proj);
    case DictionaryType: return typeMatch(a.keyType, b.keyType, proj) && typeMatch(a.valueType, b.valueType, proj);
    case FunctionType: return a.inputTypes.length === b.inputTypes.length &&
      typeMatch(a.outputType, b.outputType, proj) &&
      a.inputTypes.every((type, i) => typeMatch(type, b.inputTypes[i], proj));
  }
  return false;
}

// TODO: unified type cache. also hashing for generics
export class Type {
  constructor(cached=false) { if (!cached) { throw new ArgumentError(`not constructed using ${this.constructor.name}.of, erroring since types would behave wrongly`); } }
  
  static of(...args) {
    const newType = new this(...args, true);
    const bucketId = newtype.calculateHash() & TYPE_CACHE_BUCKET_MASK;
    let bucket = typeCache[bucketId];
    if (bucket) {
      let foundType;
      if (foundType = bucket.find(type => typeEq(type, newType))) { return foundType; }
      else { bucket.push(newType); }
    } else {
      bucket = typeCache[bucketId] = [];
      bucket.push(newType);
    }
    return newType;
  }
  get typeParameters() { return []; }
  calculateHash() { return cyrb32i([typeId(this.constructor)].concat(this.typeParameters.map(typeHash))); }
  
  equals(other) {
    return typeEq(this, other);
  }
}

export class Undefined extends Type {}

// TODO: deduplicate? will need to make hash order dependent ofc.
export class GenericType extends Type {
  static count = 0;
  static typeSource = {
    [Symbol.iterator]: function* () { while (true) { yield Symbol('t' + GenericType.count++); } }
  };
  type = Object;
  
  constructor(fn) { type = fn(this.constructor.typeSource); }
  get typeParameters() { return [this.type]; }
}

export class ArrayType extends Type {
  itemType = Object;
  
  constructor(itemType, cached=false) { super(cached); this.itemType = itemType; }
  get typeParameters() { return [this.itemType]; }
}

export class DictionaryType extends Type {
  keyType = Object;
  valueType = Object;
  
  constructor(keyType, valueType, cached=false) { super(cached); this.keyType = keyType; this.valueType = valueType; }
  get typeParameters() { return [this.keyType, this.valueType]; }
}

export class TupleType extends Type {
  itemTypes = Object;
  
  constructor(itemTypes, cached=false) { super(cached); this.itemTypes = itemTypes; }
  get typeParameters() { return this.itemTypes; }
}

export class RecordType extends Type {
  itemTypes = Object;
  
  constructor(itemTypes, cached=false) { super(cached); this.itemTypes = itemTypes; }
  calculateHash() { return cyrb32i.apply(this.itemTypes.flatMap(([name, type]) => [cyrb32(name), typeHash(type)])); }
}

// TODO: deduplication if possible i guess. probs not bc input types are array?
export class FunctionType extends Type {
  inputTypes = [];
  outputType = Object;
  
  constructor(inputTypes, outputType, cached=false) { super(cached); this.inputTypes = inputTypes; this.outputType = outputType; }
  get typeParameters() { return this.inputTypes.sort(([n1, t1], [n2, t2]) => n1 > n2 ? 1 : n1 < n2 ? -1 : 0).concat([this.outputType]); }
}

// register existing types
for (const type of [Undefined, Boolean, Number, String, BigInt, Symbol, GenericType, FunctionType, ArrayType, DictionaryType, TupleType, RecordType]) { typeId(type); }
