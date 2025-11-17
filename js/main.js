import { AudioEngine } from './audio-engine.js';
import { EffectsProcessor } from './effects.js';
import { Piano, Bass, Organ, Drums } from './instruments.js';
import { MusicGenerator } from './generator.js';
import { presets } from './presets.js';

class JazzGeneratorApp {
    constructor() {
        this.audioEngine = new AudioEngine();
        this.effectsProcessor = null;
        this.instruments = {};
        this.generator = new MusicGenerator();

        this.isPlaying = false;
        this.loopInterval = null;
        this.currentChordIndex = 0;
        this.chordProgression = [];

        this.parameters = {
            rootNote: 'C',
            scaleType: 'major',
            tempo: 120,
            complexity: 50,
            density: 50,
            swing: 65,
            instruments: {
                piano: true,
                bass: true,
                organ: true,
                drums: true
            },
            effects: {
                reverb: 40,
                delay: 20,
                filterFreq: 80,
                distortion: 0
            }
        };

        this.setupUI();
        this.setupVisualization();
    }

    async init() {
        await this.audioEngine.init();

        this.effectsProcessor = new EffectsProcessor(this.audioEngine);

        this.instruments.piano = new Piano(this.audioEngine, this.effectsProcessor);
        this.instruments.bass = new Bass(this.audioEngine, this.effectsProcessor);
        this.instruments.organ = new Organ(this.audioEngine, this.effectsProcessor);
        this.instruments.drums = new Drums(this.audioEngine, this.effectsProcessor);

        console.log('Jazz Generator initialized');
    }

    setupUI() {
        document.getElementById('root-note').addEventListener('change', (e) => {
            this.parameters.rootNote = e.target.value;
        });

        document.getElementById('scale-type').addEventListener('change', (e) => {
            this.parameters.scaleType = e.target.value;
        });

        document.getElementById('tempo').addEventListener('input', (e) => {
            this.parameters.tempo = parseInt(e.target.value);
            document.getElementById('tempo-value').textContent = e.target.value;
        });

        document.getElementById('complexity').addEventListener('input', (e) => {
            this.parameters.complexity = parseInt(e.target.value);
        });

        document.getElementById('density').addEventListener('input', (e) => {
            this.parameters.density = parseInt(e.target.value);
        });

        document.getElementById('swing').addEventListener('input', (e) => {
            this.parameters.swing = parseInt(e.target.value);
        });

        ['piano', 'bass', 'organ', 'drums'].forEach(inst => {
            document.getElementById(`inst-${inst}`).addEventListener('change', (e) => {
                this.parameters.instruments[inst] = e.target.checked;
            });
        });

        document.getElementById('reverb').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.parameters.effects.reverb = value;
            if (this.effectsProcessor) {
                this.effectsProcessor.setReverb(value);
            }
        });

        document.getElementById('delay').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.parameters.effects.delay = value;
            if (this.effectsProcessor) {
                this.effectsProcessor.setDelay(value);
            }
        });

        document.getElementById('filter-freq').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.parameters.effects.filterFreq = value;
            if (this.effectsProcessor) {
                this.effectsProcessor.setFilterFrequency(value);
            }
        });

        document.getElementById('distortion').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.parameters.effects.distortion = value;
            if (this.effectsProcessor) {
                this.effectsProcessor.setDistortion(value);
            }
        });

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const presetName = e.target.dataset.preset;
                this.loadPreset(presetName);
            });
        });

        document.getElementById('start-btn').addEventListener('click', () => {
            this.start();
        });

        document.getElementById('stop-btn').addEventListener('click', () => {
            this.stop();
        });
    }

    loadPreset(presetName) {
        const preset = presets[presetName];
        if (!preset) return;

        document.getElementById('root-note').value = preset.rootNote;
        document.getElementById('scale-type').value = preset.scaleType;
        document.getElementById('tempo').value = preset.tempo;
        document.getElementById('complexity').value = preset.complexity;
        document.getElementById('density').value = preset.density;
        document.getElementById('swing').value = preset.swing;

        document.getElementById('tempo-value').textContent = preset.tempo;

        ['piano', 'bass', 'organ', 'drums'].forEach(inst => {
            document.getElementById(`inst-${inst}`).checked = preset.instruments[inst];
        });

        document.getElementById('reverb').value = preset.effects.reverb;
        document.getElementById('delay').value = preset.effects.delay;
        document.getElementById('filter-freq').value = preset.effects.filterFreq;
        document.getElementById('distortion').value = preset.effects.distortion;

        this.parameters = JSON.parse(JSON.stringify(preset));

        if (this.effectsProcessor) {
            this.effectsProcessor.setReverb(preset.effects.reverb);
            this.effectsProcessor.setDelay(preset.effects.delay);
            this.effectsProcessor.setFilterFrequency(preset.effects.filterFreq);
            this.effectsProcessor.setDistortion(preset.effects.distortion);
        }

        console.log(`Loaded preset: ${presetName}`);
    }

    async start() {
        if (this.isPlaying) return;

        if (!this.effectsProcessor) {
            await this.init();
        }

        await this.audioEngine.resume();

        this.isPlaying = true;
        document.getElementById('start-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;

        this.chordProgression = this.generator.generateChordProgression(
            this.parameters.rootNote,
            this.parameters.complexity
        );

        this.currentChordIndex = 0;
        this.playLoop();

        console.log('Playback started');
    }

    stop() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;

        if (this.loopInterval) {
            clearTimeout(this.loopInterval);
            this.loopInterval = null;
        }

        document.getElementById('current-chord').textContent = '-';
        document.getElementById('current-notes').textContent = '-';

        console.log('Playback stopped');
    }

    playLoop() {
        if (!this.isPlaying) return;

        const currentChord = this.chordProgression[this.currentChordIndex];
        this.displayCurrentChord(currentChord);

        const melody = this.generator.generateMelody(
            this.parameters.rootNote,
            this.parameters.scaleType,
            this.parameters.complexity,
            this.parameters.density,
            8
        );

        const harmony = this.generator.generateHarmony(
            [currentChord],
            this.parameters.density
        );

        const bassline = this.generator.generateBassline(
            [currentChord],
            this.parameters.density,
            this.parameters.swing
        );

        const drumPattern = this.generator.generateDrumPattern(
            this.parameters.density,
            this.parameters.swing,
            8
        );

        if (this.parameters.instruments.piano && melody.length > 0) {
            melody.forEach(note => {
                this.instruments.piano.playNote(note.note, note.octave, note.duration, note.time);
            });
        }

        if (this.parameters.instruments.organ && harmony.length > 0) {
            harmony.forEach(note => {
                this.instruments.organ.playNote(note.note, note.octave, note.duration, note.time);
            });
        }

        if (this.parameters.instruments.bass && bassline.length > 0) {
            bassline.forEach(note => {
                this.instruments.bass.playNote(note.note, note.octave, note.duration, note.time);
            });
        }

        if (this.parameters.instruments.drums) {
            drumPattern.forEach(hit => {
                switch (hit.type) {
                    case 'kick':
                        this.instruments.drums.playKick(hit.time);
                        break;
                    case 'snare':
                        this.instruments.drums.playSnare(hit.time);
                        break;
                    case 'hihat':
                        this.instruments.drums.playHiHat(hit.time, hit.closed);
                        break;
                    case 'ride':
                        this.instruments.drums.playRide(hit.time);
                        break;
                }
            });
        }

        this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgression.length;

        const measureDuration = (60 / this.parameters.tempo) * 4 * 1000;
        this.loopInterval = setTimeout(() => this.playLoop(), measureDuration);
    }

    displayCurrentChord(chord) {
        if (!chord) return;

        const chordName = `${chord.root}${chord.type}`;
        document.getElementById('current-chord').textContent = chordName;

        const chordNotes = this.generator.getChordNotes(chord.root, chord.type);
        document.getElementById('current-notes').textContent = chordNotes.join(', ');
    }

    setupVisualization() {
        const canvas = document.getElementById('visualizer');
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 26, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (this.audioEngine.initialized && this.isPlaying) {
                const analyser = this.audioEngine.getAnalyser();
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                analyser.getByteFrequencyData(dataArray);

                const barWidth = (canvas.width / bufferLength) * 2.5;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

                    const hue = (i / bufferLength) * 180 + 180;
                    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                    const gradient = ctx.createLinearGradient(x, canvas.height - barHeight, x, canvas.height);
                    gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 0.8)`);
                    gradient.addColorStop(1, `hsla(${hue}, 100%, 40%, 0.4)`);

                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                    x += barWidth + 1;
                }
            } else {
                ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
                ctx.font = '24px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Press START to begin', canvas.width / 2, canvas.height / 2);
            }

            requestAnimationFrame(draw);
        };

        draw();
    }
}

const app = new JazzGeneratorApp();
console.log('Quantum Jazz Generator loaded');
