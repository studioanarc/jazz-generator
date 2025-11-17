export class Instrument {
    constructor(audioEngine, effectsProcessor) {
        this.audioEngine = audioEngine;
        this.effectsProcessor = effectsProcessor;
        this.ctx = audioEngine.getContext();
        this.output = this.ctx.createGain();
        this.output.gain.value = 1;

        if (effectsProcessor) {
            this.effectsProcessor.connectInstrument(this.output);
        } else {
            this.output.connect(audioEngine.getMasterGain());
        }
    }

    noteToFrequency(note, octave = 4) {
        const notes = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
            'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
            'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
        };

        const semitone = notes[note];
        return 440 * Math.pow(2, (octave - 4) + (semitone - 9) / 12);
    }
}

export class Piano extends Instrument {
    constructor(audioEngine, effectsProcessor) {
        super(audioEngine, effectsProcessor);
        this.activeNotes = new Map();
    }

    playNote(note, octave, duration, time = 0) {
        const freq = this.noteToFrequency(note, octave);
        const startTime = this.ctx.currentTime + time;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const osc3 = this.ctx.createOscillator();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc3.type = 'triangle';

        osc1.frequency.value = freq;
        osc2.frequency.value = freq * 2;
        osc3.frequency.value = freq * 3;

        const gain1 = this.ctx.createGain();
        const gain2 = this.ctx.createGain();
        const gain3 = this.ctx.createGain();

        gain1.gain.value = 0.5;
        gain2.gain.value = 0.2;
        gain3.gain.value = 0.1;

        const envelope = this.ctx.createGain();
        envelope.gain.value = 0;

        envelope.gain.setValueAtTime(0, startTime);
        envelope.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
        envelope.gain.exponentialRampToValueAtTime(0.2, startTime + 0.1);
        envelope.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc1.connect(gain1);
        osc2.connect(gain2);
        osc3.connect(gain3);

        gain1.connect(envelope);
        gain2.connect(envelope);
        gain3.connect(envelope);

        envelope.connect(this.output);

        osc1.start(startTime);
        osc2.start(startTime);
        osc3.start(startTime);

        osc1.stop(startTime + duration + 0.1);
        osc2.stop(startTime + duration + 0.1);
        osc3.stop(startTime + duration + 0.1);
    }
}

export class Bass extends Instrument {
    constructor(audioEngine, effectsProcessor) {
        super(audioEngine, effectsProcessor);
    }

    playNote(note, octave, duration, time = 0) {
        const freq = this.noteToFrequency(note, octave);
        const startTime = this.ctx.currentTime + time;

        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();

        osc.type = 'sawtooth';
        subOsc.type = 'sine';

        osc.frequency.value = freq;
        subOsc.frequency.value = freq / 2;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = freq * 4;
        filter.Q.value = 5;

        const gain = this.ctx.createGain();
        const subGain = this.ctx.createGain();

        gain.gain.value = 0.4;
        subGain.gain.value = 0.3;

        const envelope = this.ctx.createGain();
        envelope.gain.value = 0;

        envelope.gain.setValueAtTime(0, startTime);
        envelope.gain.linearRampToValueAtTime(0.8, startTime + 0.05);
        envelope.gain.exponentialRampToValueAtTime(0.4, startTime + 0.2);
        envelope.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        subOsc.connect(subGain);

        gain.connect(filter);
        subGain.connect(filter);

        filter.connect(envelope);
        envelope.connect(this.output);

        osc.start(startTime);
        subOsc.start(startTime);

        osc.stop(startTime + duration + 0.1);
        subOsc.stop(startTime + duration + 0.1);
    }
}

export class Organ extends Instrument {
    constructor(audioEngine, effectsProcessor) {
        super(audioEngine, effectsProcessor);
    }

    playNote(note, octave, duration, time = 0) {
        const freq = this.noteToFrequency(note, octave);
        const startTime = this.ctx.currentTime + time;

        const harmonics = [1, 2, 3, 4, 5, 6, 8];
        const gains = [0.4, 0.3, 0.2, 0.15, 0.1, 0.08, 0.05];

        const envelope = this.ctx.createGain();
        envelope.gain.value = 0;

        envelope.gain.setValueAtTime(0, startTime);
        envelope.gain.linearRampToValueAtTime(0.6, startTime + 0.05);
        envelope.gain.linearRampToValueAtTime(0.5, startTime + duration - 0.1);
        envelope.gain.linearRampToValueAtTime(0, startTime + duration);

        harmonics.forEach((harmonic, index) => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq * harmonic;

            const gain = this.ctx.createGain();
            gain.gain.value = gains[index];

            osc.connect(gain);
            gain.connect(envelope);

            osc.start(startTime);
            osc.stop(startTime + duration + 0.1);
        });

        const vibrato = this.ctx.createOscillator();
        vibrato.frequency.value = 5;
        const vibratoGain = this.ctx.createGain();
        vibratoGain.gain.value = 3;

        vibrato.connect(vibratoGain);
        vibrato.start(startTime);
        vibrato.stop(startTime + duration + 0.1);

        envelope.connect(this.output);
    }
}

export class Drums extends Instrument {
    constructor(audioEngine, effectsProcessor) {
        super(audioEngine, effectsProcessor);
    }

    playKick(time = 0) {
        const startTime = this.ctx.currentTime + time;

        const osc = this.ctx.createOscillator();
        osc.frequency.value = 150;

        const gain = this.ctx.createGain();
        gain.gain.value = 0;

        osc.frequency.setValueAtTime(150, startTime);
        osc.frequency.exponentialRampToValueAtTime(50, startTime + 0.05);

        gain.gain.setValueAtTime(1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(this.output);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
    }

    playSnare(time = 0) {
        const startTime = this.ctx.currentTime + time;

        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.2, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < buffer.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        noise.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;

        const osc = this.ctx.createOscillator();
        osc.frequency.value = 180;

        const gain = this.ctx.createGain();
        gain.gain.value = 0;

        gain.gain.setValueAtTime(0.7, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        noise.connect(noiseFilter);
        noiseFilter.connect(gain);
        osc.connect(gain);
        gain.connect(this.output);

        noise.start(startTime);
        osc.start(startTime);

        noise.stop(startTime + 0.15);
        osc.stop(startTime + 0.15);
    }

    playHiHat(time = 0, closed = true) {
        const startTime = this.ctx.currentTime + time;

        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < buffer.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;

        const gain = this.ctx.createGain();
        const duration = closed ? 0.05 : 0.15;

        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.output);

        noise.start(startTime);
        noise.stop(startTime + duration);
    }

    playRide(time = 0) {
        const startTime = this.ctx.currentTime + time;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();

        osc1.frequency.value = 800;
        osc2.frequency.value = 540;

        osc1.type = 'square';
        osc2.type = 'square';

        const gain = this.ctx.createGain();
        gain.gain.value = 0;

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.output);

        osc1.start(startTime);
        osc2.start(startTime);

        osc1.stop(startTime + 0.3);
        osc2.stop(startTime + 0.3);
    }
}
