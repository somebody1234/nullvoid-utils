import { pub, sub } from './_.js';

export default class Now {
  static metatype = 'model';
  interval = 1;
  tickHandle = 0;
  
  constructor() {
    setTimeout(this.resume.bind(this), 0);
  }
  
  _doTick() {
    pub(this, 'tick', { tick: new Date() });
  }
  
  resume() {
    // TODO: change to trigger on the second if needed
    // NOTE: setTimeout(dotick, 0) is specific to here since it's the only one that pubs resume in constructor
    setTimeout(this._doTick.bind(this), 0);
    this.tickHandle = setInterval(this._doTick.bind(this), this.interval * 1000);
  }
  
  pause() {
    clearInterval(this.tickHandle);
    this.tickHandle = 0;
  }

  static inputs = [ { name: 'resume', type: {} }, { name: 'pause', type: {} } ];
  static outputs = [ { name: 'tick', type: { tick: Date } } ];
}
