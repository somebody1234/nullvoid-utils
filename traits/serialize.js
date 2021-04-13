import { ArrayType, DictionaryType, TupleType, RecordType } from '../_t.js';
import { Trait } from '../_trait.js';

export default class Serialize extends Trait {
  static implementations = new Map();
  
  static implement(type, { serialize }) {
    this.implementations.set(type, { serialize });
  }
  
  static of(type) {
    if (this.implementations.has(type)) { return this.implementations.get(type); }
    switch (type.constructor) {
      case ArrayType:
        const { serialize: serializeItem } = this.of(type.itemType);
        return { serialize(value, serializer) {
          // *thoughts, apart from the obviously wrong serializeSize etc.
          // serde has a thing but it needs .end() which is meh. idk if any better option tho
          serializer.serializeSize(value.length);
          serializer.serializeArrayStart();
          for (const item of value) { serializeItem(item, serializer); }
          serializer.serializeArrayEnd();
        } };
      case DictionaryType:
        const { serialize: serializeKey } = this.of(type.keyType);
        const { serialize: serializeValue } = this.of(type.valueType);
        return { serialize(value, serializer) {
          if (value instanceof Map) {
            serializer.serializeSize(value.size);
            serializer.serializeDictionaryStart();
            for (const key in value) { serializeKey(key, serializer); serializeValue(value.get(key), serializer); }
            serializer.serializeDictionaryEnd();
          } else {
            serializer.serializeSize(Object.keys(value).length);
            serializer.serializeDictionaryStart();
            for (const key in value) { serializeKey(key, serializer); serializeValue(value[key], serializer); }
            serializer.serializeDictionaryEnd();
          }
        } };
        break;
      case TupleType:
        const serializers = type.itemTypes.map(type => this.of(type).serialize);
        return { serialize(value, serializer) {
          serializer.serializeArrayStart();
          for (let i = 0; i < type.itemTypes.length; i++) { serializers[i](value[i], serializer); }
          serializer.serializeArrayEnd();
        } };
        break;
      case RecordType:
        const serializers = type.itemTypes.map(([name, type]) => { name, serialize: this.of(type).serialize });
        return { serialize(value, serializer) {
          serializer.serializeDictionaryStart();
          if (value instanceof Map) {
            for (const { name, serialize } of serializers) { serialize(value.get(name), serializer); }
          } else {
            for (const { name, serialize } of serializers) { serialize(value[name], serializer); }
          }
          serializer.serializeDictionaryEnd();
        } };
        break;
      default:
        // TODO: maybe it's handled in serializer instead for certain types?
        // if it has an implementation, it's already returned in the first line
        throw `type ${type.name} does not have an implementation for ${this.name}`;
    }
  }
}
