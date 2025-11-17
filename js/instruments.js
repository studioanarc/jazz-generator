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

    setVolume(value) {
        this.output.gain.setTargetAtTime(value / 100, this.ctx.currentTime, 0.01);
    }
}

export class Piano extends Instrument {
    constructor(audioEngine, effectsProcessor) {
        super(audioEngine, effectsProcessor);
    }

    playNote(note, octave, duration, time = 0, velocity = 0.7) {
        const freq = this.noteToFrequency(note, octave);
        const startTime = this.ctx.currentTime + time;

        // More realistic piano with multiple partials
        const partials = [
            {mult: 1, amp: 1.0},
            {mult: 2, amp: 0.4},
            {mult: 3, amp: 0.2},
            {mult: 4.2, amp: 0.12},
            {mult: 5.4, amp: 0.08}
        ];

        const noteGain = this.ctx.createGain();
        noteGain.gain.value = 0;

        // Piano envelope: quick attack, medium sustain, slow release
        const attack = 0.002;
        const decay = 0.1;
        const sustain = velocity * 0.3;
        const release = duration * 0.3;

        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(velocity * 0.8, startTime + attack);
        noteGain.gain.exponentialRampToValueAtTime(sustain, startTime + attack + decay);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        partials.forEach(partial => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq * partial.mult;

            const gain = this.ctx.createGain();
            gain.gain.value = partial.amp;

            osc.connect(gain);
            gain.connect(noteGain);

            osc.start(startTime);
            osc.stop(startTime + duration + release);
        });

        noteGain.connect(this.output);
    }
}

export class Bass extends Instrument {
    constructor(audioEngine, effectsProcessor) {
        super(audioEngine, effectsProcessor);
    }

    playNote(note, octave, duration, time = 0, velocity = 0.7) {
        const freq = this.noteToFrequency(note, octave);
        const startTime = this.ctx.currentTime + time;

        // Upright bass sound
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();

        osc.type = 'triangle';
        osc2.type = 'sine';

        osc.frequency.value = freq;
        osc2.frequency.value = freq * 2;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = freq * 3;
        filter.Q.value = 2;

        const gain = this.ctx.createGain();
        const gain2 = this.ctx.createGain();

        gain.gain.value = velocity * 0.6;
        gain2.gain.value = velocity * 0.2;

        const envelope = this.ctx.createGain();
        envelope.gain.value = 0;

        // Plucked bass envelope
        envelope.gain.setValueAtTime(0, startTime);
        envelope.gain.linearRampToValueAtTime(1, startTime + 0.01);
        envelope.gain.exponentialRampToValueAtTime(0.3, startTime + 0.08);
        envelope.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        osc2.connect(gain2);
        gain.connect(filter);
        gain2.connect(filter);
        filter.connect(envelope);
        envelope.connect(this.output);

        osc.start(startTime);
        osc2.start(startTime);

        osc.stop(startTime + duration + 0.1);
        osc2.stop(startTime + duration + 0.1);
    }
}

export class Drums extends Instrument {
    constructor(audioEngine, effectsProcessor) {
        super(audioEngine, effectsProcessor);
    }

    playKick(time = 0, velocity = 0.7) {
        const startTime = this.ctx.currentTime + time;

        const osc = this.ctx.createOscillator();
        osc.frequency.value = 120;

        const gain = this.ctx.createGain();
        gain.gain.value = 0;

        osc.frequency.setValueAtTime(120, startTime);
        osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.05);

        gain.gain.setValueAtTime(velocity, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(this.output);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
    }

    playSnare(time = 0, velocity = 0.5) {
        const startTime = this.ctx.currentTime + time;

        // Noise for snare
        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.2, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < buffer.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        noise.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 2000;

        const gain = this.ctx.createGain();
        gain.gain.value = 0;

        gain.gain.setValueAtTime(velocity * 0.6, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        noise.connect(noiseFilter);
        noiseFilter.connect(gain);
        gain.connect(this.output);

        noise.start(startTime);
        noise.stop(startTime + 0.15);
    }

    playHiHat(time = 0, closed = true, velocity = 0.4) {
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
        filter.frequency.value = 8000;

        const gain = this.ctx.createGain();
        const duration = closed ? 0.05 : 0.15;

        gain.gain.setValueAtTime(velocity, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.output);

        noise.start(startTime);
        noise.stop(startTime + duration);
    }

    playRide(time = 0, velocity = 0.5) {
        const startTime = this.ctx.currentTime + time;

        // Ride cymbal using filtered noise and metallic partials
        const noise = this.ctx.createBufferSource();
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.3, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < buffer.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
        }

        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 4000;
        filter.Q.value = 1;

        const gain = this.ctx.createGain();
        gain.gain.value = 0;

        gain.gain.setValueAtTime(velocity * 0.5, startTime);
        gain.gain.exponentialRampToValueAtTime(velocity * 0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.output);

        noise.start(startTime);
        noise.stop(startTime + 0.4);
    }

    playRideBell(time = 0, velocity = 0.6) {
        const startTime = this.ctx.currentTime + time;

        // Bell sound with metallic partials
        const partials = [800, 1071, 1431, 1920];

        const bellGain = this.ctx.createGain();
        bellGain.gain.value = 0;

        bellGain.gain.setValueAtTime(velocity * 0.4, startTime);
        bellGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        partials.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const gain = this.ctx.createGain();
            gain.gain.value = 1 / (i + 1);

            osc.connect(gain);
            gain.connect(bellGain);

            osc.start(startTime);
            osc.stop(startTime + 0.5);
        });

        bellGain.connect(this.output);
    }
}
