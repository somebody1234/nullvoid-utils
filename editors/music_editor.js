import Editor from './editor.js';

export default class MusicEditor extends Editor {
  // array of { sound: AudioNode, notes: [{ frequency: Number, duration: [Number, Number] }] }
  // note that sound can be OscillatorNode or like normal audio (since normal audio can be detuned too)
  // duration would be [numerator, denominator]
  // note that this is kinda bad. doesn't account for changes in bpm, gliss etc.
  // so the idea is i'd use command-based like svg instead.
  // detuning in cents ofc.
  // quavers e4 e4 f4 g4; bpm 120; detune -10;
  // now the question is how would you get them to sync up? no need to, i guess
  media = [];
  
  constructor() { super(); }
}

// ok so actions:
/*
edit:
delete bar
move by 1 octave
move by 1 semitone
move by 1 semitone while changing key?
change key without changing notes
change time signature
change bpm
change detune (??? idk tbh)
tune to nearest note? - the main problem is this requires offtune input in the first place
  also pitch/loudness smoothing?
tools:
  nodes:
  equalizers
  spatializers
detune curves
loudness curves
playback speed (+ curves)
meta:
<x> across all staves

notes:
should this be a score editor or an offbrand daw
  (i probs wanted the latter)
*/
