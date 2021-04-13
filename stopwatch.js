import { pub, sub } from './_.js';

// TODO: obviously timer shares more than a bit with stopwatch, can this be a bit more dry?
// i guess extracting to a common superclass.
export default class Stopwatch {
  static metatype = 'model';
  started = null;
  duration = 0;
  tickHandle = 0;
  // TODO: lower tick rate if we don't use milliseconds. somehow
  // using an attribute i guess
  
  // constructor() {
    // TODO: do we need isTicking to balance resumes and pauses
    // TODO: do we want to somehow pair start/stop and resume/pause?
    // returning a callback would work but is it a good idea...
  // }
  
  _doTick() {
    // NOTE: same as nv.Timer, should return unit
    pub(this, 'tick', { tick: this.duration + (Number(new Date()) - this.started) });
    this.tickHandle = requestAnimationFrame(this._doTick.bind(this));
  }
  
  start() {
    // TODO: if stopped is not null, set started appropriately, then clear
    this.started = Number(new Date());
    this.resume();
  }
  
  stop() {
    this.duration += Number(new Date()) - this.started;
    this.started = null;
    this.pause();
  }
  
  reset() {
    this.started = null;
    this.duration = 0;
    this.pause();
    pub(this, 'tick', { tick: 0 });
  }
  
  resume() {
    if (!this.started) { return; }
    this._doTick();
  }
  
  pause() {
    // NOTE: i don't think we need a started check here
    // but mostly we can't. if we do need it we'll need to find a workaround
    cancelAnimationFrame(this.tickHandle);
    this.tickHandle = 0;
  }

  static inputs = [ { name: 'start', type: {} }, { name: 'stop', type: {} }, { name: 'resume', type: {} }, { name: 'pause', type: {} }, { name: 'reset', type: {} } ];
  static outputs = [ { name: 'tick', type: { tick: Number } } ];
}
