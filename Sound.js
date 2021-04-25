class MusicPlayer {
  constructor() {
    this.explosionSounds = new Tone.Player(
      "sounds/Explosions/explosion04.wav"
    ).toDestination();

    this.hihat = new Tone.Player("sounds/Drums/hihat.wav").toDestination();

    this.scream = new Tone.Player("sounds/Voice/aargh7.ogg").toDestination();
    this.freeverb = new Tone.Freeverb().toDestination();
    this.freeverb.dampening = 400;
    this.chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
    this.bassLine;
    this.bassLinePart;
    this.scream.connect(this.freeverb);
    this.hihat.connect(this.freeverb);
    this.scream.set({
      volume: -35,
    });
    this.explosionSounds.set({
      volume: -15,
    });
    this.chordPart;
    this.introMelody;
    this.kickPart;
    this.clapPart;
    this.hatPart;
    this.synthChord;
    this.bassSynth;
    Tone.Transport.bpm.value = 100;
    this.start();
    this.warningStarted = false;
  }

  start() {
    if (
      Tone.Transport.state !== "started" ||
      Tone.Transport.state === "suspended"
    ) {
      Tone.start();
      Tone.Transport.start();
    }
  }

  playMelody(chords, melody, kicks, claps, hats, pattern) {
    let duration = pattern === "intro" ? "8n" : "4n";
    let kicksPattern = pattern === "intro" ? kicks : hats;
    this.synthChord = new Tone.PolySynth().toDestination().connect(this.chorus);
    let kickDrum = new Tone.MembraneSynth({
      volume: -5,
    }).toDestination();

    this.bassSynth = new Tone.DuoSynth({
      oscillator: {
        type: "triangle",
      },
      volume: -25,
    })
      .toDestination()
      .connect(this.freeverb);

    this.synthChord.set({
      detune: -1200,
      volume: -20,
      count: 6,
      spread: 80,
      oscillator: {
        type: "sine",
      },
    });

    this.chordPart = new Tone.Part((time, note) => {
      this.synthChord.triggerAttackRelease(note.note, note.duration, time, 0.5);
    }, chords);
    this.chordPart.loopStart = "0:0";
    this.chordPart.loop = 8;
    this.chordPart.loopEnd = "8:0";

    this.introMelody = new Tone.Sequence(
      (time, note) => {
        this.bassSynth.triggerAttackRelease(note, "40hz", time);
      },
      melody,
      duration
    );

    const lowPass = new Tone.Filter({
      frequency: 8000,
    }).toDestination();

    this.clapDrum = new Tone.NoiseSynth({
      volume: -20,
      noise: {
        type: "white",
        playbackRate: 3,
      },
      envelope: {
        attack: 0.1,
        decay: 0.001,
        sustain: 0.02,
        release: 0.5,
      },
    }).connect(lowPass);

    this.kickPart = new Tone.Part(function (time) {
      kickDrum.triggerAttackRelease("C1", "8n", time);
    }, kicksPattern);
    this.kickPart.loopStart = "0:0";
    this.kickPart.loop = 8;
    this.kickPart.loopEnd = "8:0";

    this.clapPart = new Tone.Part((time) => {
      this.clapDrum.triggerAttackRelease("2n", time);
    }, claps);
    this.clapPart.loopStart = "0:0";
    this.clapPart.loop = 8;
    this.clapPart.loopEnd = "8:0";

    this.hatPart = new Tone.Part((time) => {
      this.hihat.start(time);
    }, hats);
    this.hatPart.loopStart = "0:0";
    this.hatPart.loop = 8;
    this.hatPart.loopEnd = "8:0";
    this.bass();
  }

  bass() {
    this.bassLine = new Tone.MonoSynth({
      oscillator: {
        type: "square",
      },

      envelope: {
        attack: 0.1,
      },
      volume: -20,
    }).toDestination();

    this.bassLinePart = new Tone.Part(
      (time, value) => {
        this.bassLine.triggerAttackRelease(value.note, 5, time, value.velocity);
      },

      [
        { time: "0:0", note: "A1", velocity: 0.9 },
        { time: "2:0", note: "D1", velocity: 0.5 },
        { time: "4:0", note: "G1", velocity: 0.9 },
        { time: "6:0", note: "C#1", velocity: 0.8 },
      ]
    );
    this.bassLinePart.loopStart = "0:0";
    this.bassLinePart.loop = 8;
    this.bassLinePart.loopEnd = "8:0";
    return this.bassLinePart;
  }
  explosion() {
    if (this.explosionSounds.state === "started") this.explosionSounds.stop();
    this.explosionSounds.start();
  }

  pain() {
    if (this.scream.state === "started") this.scream.stop();
    this.scream.start();
  }

  lowHealthWarning() {
    const synth = new Tone.PolySynth({
      volume: -25,
    }).toDestination();
    synth.triggerAttackRelease(pickUp, 0.5);
  }

  pickUpHeart() {
    const synth = new Tone.PolySynth({
      volume: -25,
    })
      .toDestination()
      .connect(this.freeverb);
    synth.triggerAttackRelease(pickUp, 0.5);
  }

  startIntro() {
    //To simulate wind
    const filter = new Tone.Filter(20, "lowpass").toDestination();

    this.playMelody(
      timedIntroChords,
      introMelodyNotes,
      introKicks,
      claps,
      introHats,
      "intro"
    );

    this.bassLine.connect(filter);
    this.bassSynth.connect(filter);
    this.synthChord.connect(filter);
    filter.frequency.rampTo(1200, 5);
    this.startSounds();
  }

  startOutro() {
    const filter = new Tone.Filter(20, "lowpass").toDestination();
    this.playMelody(
      timedOutroChords,
      outroMelodyNotes,
      outroKicks,
      claps,
      introHats,
      "outro"
    );
    this.bassLine.connect(filter);
    this.bassSynth.connect(filter);
    this.synthChord.connect(filter);
    filter.frequency.rampTo(500, 5);

    this.startSounds();
    this.hatPart.stop();
    this.clapPart.stop();
  }

  startSounds() {
    this.bassLinePart.start();
    this.chordPart.start();
    this.introMelody.start();
    this.kickPart.start();
    this.hatPart.start();
    this.clapPart.start();
  }

  stopSounds() {
    this.kickPart.stop();
    this.hatPart.stop();
    this.clapPart.stop();
    this.introMelody.stop();
    this.chordPart.stop();
    this.bassLinePart.stop();
  }
}

let introChords = [
  ["A5", "E5", "C5", "E4", "A3"],
  ["F#5", "D5", "A5", "D4", "E3"],
  ["G5", "E5", "C5", "G4", "G3"],
  ["E5", "C5", "A5", "A3"],
];

let outroChords = [
  ["A4", "E5", "C6", "E6", "A6"],
  ["E4", "D5", "A5", "D6", "F#6"],
  ["G4", "G5", "C6", "E6", "G6"],
  ["A4", "A5", "C6", "E6"],
];
let introMelodyNotes = [
  "C6",
  "E6",
  "A6",
  "E6",
  "C6",
  "E6",
  "A6",
  "E6",
  "C6",
  "E6",
  "A6",
  "E6",
  "C6",
  "E6",
  "A6",
  "E6",
  "D6",
  "E6",
  "G6",
  "E6",
  "D6",
  "E6",
  "G6",
  "E6",
  "D6",
  "E6",
  "G6",
  "F#6",
  "D6",
  "E6",
  "F#6",
  "G6",
  "C6",
  "E6",
  "G6",
  "E6",
  "C6",
  "E6",
  "G6",
  "E6",
  "C6",
  "E6",
  "G6",
  "E6",
  "C6",
  "E6",
  "G6",
  "E6",
  "A5",
  "C6",
  "E6",
  "C6",
  "A5",
  "C6",
  "E6",
  "C6",
  "A5",
  "C6",
  "E6",
  "C6",
  "A5",
  "C6",
  "D6",
  "E6",
];

let timedIntroChords = [
  { time: "0:0", note: introChords[0], duration: 5 },
  { time: "2:0", note: introChords[1], duration: 5 },
  { time: "4:0", note: introChords[2], duration: 5 },
  { time: "6:0", note: introChords[3], duration: 5 },
];
let timedOutroChords = [
  { time: "0:0", note: outroChords[0], duration: 5 },
  { time: "2:0", note: outroChords[1], duration: 5 },
  { time: "4:0", note: outroChords[2], duration: 5 },
  { time: "6:0", note: outroChords[3], duration: 5 },
];
const claps = [];
const introHats = [
  "0:1:0",
  "0:1:2",
  "0:1:4",
  "0:1:6",
  "0:1:8",

  "1:0:0",
  "1:0:2",
  "1:0:4",
  "1:0:6",
  "1:0:8",

  "2:1:0",
  "2:1:2",
  "2:1:4",
  "2:1:6",
  "2:1:8",

  "3:0:0",
  "3:0:2",
  "3:0:4",
  "3:0:6",
  "3:0:8",

  "4:1:0",
  "4:1:2",
  "4:1:4",
  "4:1:6",
  "4:1:8",

  "5:0:0",
  "5:0:2",
  "5:0:4",
  "5:0:6",
  "5:0:8",

  "6:1:0",
  "6:1:2",
  "6:1:4",
  "6:1:6",
  "6:1:8",

  "7:0:0",
  "7:0:2",
  "7:0:4",
  "7:0:6",
  "7:0:8",
];
const introKicks = [];
let outroMelodyNotes = [
  "A6",
  "E6",
  "A6",
  "E6",
  "A6",
  "E6",
  "A6",
  "E6",
  "G6",
  "D6",
  "G6",
  "D6",
  "G6",
  "D6",
  "G6",
  "D6",
  "F6",
  "C6",
  "F6",
  "C6",
  "F6",
  "C6",
  "F6",
  "C6",
  "E6",
  "C#6",
  "E6",
  "C#6",
  "E6",
  "C#6",
  "E6",
  "C#6",
];
let outroKicks = [];

for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 9; j++) {
    introKicks.push({ time: `${i}:${j}` });
  }
}

for (let i = 0; i < 8; i++) {
  for (let j = 1; j < 9; j += 2) {
    claps.push({ time: `${i}:${j}` });
  }
}

let pickUp = ["A4", "C5", "E5", "A5"];

let bassNotes = ["A5", "D6", "G5", "C#6"];
let timedBass = [
  { time: "0:0", note: bassNotes[0], duration: 5 },
  { time: "2:0", note: bassNotes[1], duration: 5 },
  { time: "4:0", note: bassNotes[2], duration: 5 },
  { time: "6:0", note: bassNotes[3], duration: 5 },
];
