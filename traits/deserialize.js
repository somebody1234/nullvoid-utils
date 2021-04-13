import { ArrayType, DictionaryType, TupleType, RecordType } from '../_t.js';
import { Trait } from '../_trait.js';

export default class Deserialize extends Trait {
  static implementations = new Map();
  
  static implement(type, { deserialize }) {
    this.implementations.set(type, { deserialize });
  }
  
  static of(type) {
    if (this.implementations.has(type)) { return this.implementations.get(type); }
    switch (type.constructor) {
      case ArrayType:
        const { deserialize: deserializeItem } = this.of(type.itemType);
        return { deserialize(value, deserializer) {
          deserializer.deserializeSize(value.length);
          deserializer.deserializeArrayStart();
          for (const item of value) { deserializeItem(item, deserializer); }
          deserializer.deserializeArrayEnd();
        } };
      case DictionaryType:
        const { deserialize: deserializeKey } = this.of(type.keyType);
        const { deserialize: deserializeValue } = this.of(type.valueType);
        return { deserialize(value, deserializer) {
          if (value instanceof Map) {
            serializer.deserializeSize(value.size);
            serializer.deserializeDictionaryStart();
            for (const key in value) { deserializeKey(key, deserializer); deserializeValue(value.get(key), deserializer); }
            serializer.deserializeDictionaryEnd();
          } else {
            serializer.deserializeSize(Object.keys(value).length);
            serializer.deserializeDictionaryStart();
            for (const key in value) { deserializeKey(key, deserializer); deserializeValue(value[key], deserializer); }
            serializer.deserializeDictionaryEnd();
          }
        } };
        break;
      case TupleType:
        const serializers = type.itemTypes.map(type => Serialize.of(type).serialize);
        return { deserialize(value, deserializer) {
          deserializer.serializeArrayStart();
          for (let i = 0; i < type.itemTypes.length; i++) { deserializers[i](value[i], deserializer); }
          deserializer.serializeArrayEnd();
        } };
        break;
      case RecordType:
        const serializers = type.itemTypes.map(([name, type]) => { name, deserialize: this.of(type).serialize });
        return { deserialize(value, deserializer) {
          deserializer.serializeDictionaryStart();
          if (value instanceof Map) {
            for (const { name, deserialize } of deserializers) { deserialize(value.get(name), deserializer); }
          } else {
            for (const { name, deserialize } of deserializers) { deserialize(value[name], deserializer); }
          }
          deserializer.serializeDictionaryEnd();
        } };
        break;
      default:
        // if it has an implementation, it's already returned in the first line
        throw `type ${type.name} does not have an implementation for ${this.name}`;
    }
  }
}
