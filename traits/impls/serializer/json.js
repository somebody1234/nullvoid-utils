import Serializer, { ArraySerializer, DictionarySerializer } from '../serializer.js';

export default class JSONSerializer extends Serializer {
  serializeArrayStart() { this.output('['); }
  serializeArrayEnd() { this.output(']'); }
  serializeDictionaryStart() { this.output('{'); }
  serializeDictionaryEnd() { this.output('}'); }
  
  serializeSize(size) { this.output(size.toString()); }
  
  static Array = class JSONArraySerializer extends ArraySerializer {
    output = null;
    first = true;
    finished = false;
    
    constructor(output) { this.output = output; this.output('['); }
    // TODO: this kinda doesn't work since we don't know the serializer for each item.
    serializeEntry(item) {
      if (this.finished) { throw `attempting to add entry to finalized ${this.name}`; }
      this.output(item);
      if (this.first) { this.first = false; } else { this.output(','); }
    }
    end() { this.output(']'); this.finished = true; }
  };
  static Dictionary = class JSONDictionarySerializer extends DictionarySerializer {
    output = null;
    first = true;
    finished = false;
    
    constructor(output) { this.output = output; this.output('{'); }
    serializeEntry(key, value) {
      if (this.finished) { throw `attempting to add entry to finalized ${this.name}`; }
      this.output(key); this.output(':'); this.output(value);
      if (this.first) { this.first = false; } else { this.output(','); }
    }
    end() { this.output('}'); this.finished = true; }
  };
  // TODO: handler for primitives
}

// export default const JSON$Serializer = new Serializer({
//   serializeArrayStart() { this.output('['); },
//   serializeArrayEnd() { this.output(']'); },
//   serializeDictionaryStart() { this.output('{'); },
//   serializeDictionaryEnd() { this.output('}'); },
  
//   serializeSize(size) { this.output(size.toString()); },
  
//   // TODO: how to implement serialize for string
// });
