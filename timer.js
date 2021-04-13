import { pub, sub } from './_.js';

export default class Timer {
  static metatype = 'model';
  started = null;
  duration = 0;
  durationLeft = 0;
  interval = 1000;
  tickHandle = 0;
  
  _doTick() {
    // NOTE: ideally this would return a unit but that's bloat.
    // returning unit can be achieved with a plugin
    // NOTE: +0 to turn -0 into +0
    const ticks = Math.round(this.durationLeft - (Number(new Date()) - this.started)) + 0;
    if (ticks >= 0) { pub(this, 'tick', { tick: ticks }); }
    if (ticks <= 0) { pub(this, 'tick', { tick: 0 }); this.pause(); pub(this, 'end'); }
  }
  
  set({ duration }) {
    this.stop();
    this.durationLeft = this.duration = duration;
  }
  
  start() {
    if (this.durationLeft === 0) { pub(this, 'end'); return; }
    this.started = Number(new Date());
    this.resume();
  }
  
  stop() {
    this.durationLeft -= (Number(new Date()) - this.started);
    this.started = null;
    this.pause();
  }
  
  reset() {
    this.started = null;
    this.durationLeft = this.duration;
    this.pause();
    pub(this, 'tick', { tick: this.durationLeft });
  }
  
  resume() {
    if (!this.started) { return; }
    if (this.durationLeft % 1) {
      pub(this, 'tick', { tick: Math.ceil(this.durationLeft) });
    }
    this.tickHandle = setTimeout(() => {
      this._doTick();
      this.tickHandle = setInterval(this._doTick.bind(this), this.interval);
    }, Math.round(this.durationLeft % 1000));
  }
  
  pause() {
    clearInterval(this.tickHandle);
    this.tickHandle = 0;
  }

  static inputs = [ { name: 'set', type: { duration: Number } }, { name: 'start', type: {} }, { name: 'resume', type: {} }, { name: 'pause', type: {} }, { name: 'stop', type: {} }, { name: 'reset', type: {} } ];
  static outputs = [ { name: 'time', type: { tick: Number } }, { name: 'end', type: {} } ];
}
