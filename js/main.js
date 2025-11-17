import { AudioEngine } from './audio-engine.js';
import { EffectsProcessor } from './effects.js';
import { Piano, Bass, Drums } from './instruments.js';
import { MusicGenerator } from './generator.js';
import { presets } from './presets.js';

class JazzApp {
    constructor() {
        this.audioEngine = new AudioEngine();
        this.effectsProcessor = null;
        this.instruments = {};
        this.generator = new MusicGenerator();

        this.isPlaying = false;
        this.loopTimeout = null;
        this.currentMeasure = 0;

        this.params = {
            rootNote: 'C',
            style: 'bebop',
            tempo: 120,
            complexity: 50,
            density: 50,
            swing: 67,
            volumes: {
                piano: 70,
                bass: 75,
                drums: 60
            },
            effects: {
                reverb: 40,
                delay: 15,
                tone: 65
            }
        };

        this.progression = [];
        this.setupUI();
        this.setupVisualization();
    }

    async init() {
        await this.audioEngine.init();

        this.effectsProcessor = new EffectsProcessor(this.audioEngine);

        this.instruments.piano = new Piano(this.audioEngine, this.effectsProcessor);
        this.instruments.bass = new Bass(this.audioEngine, this.effectsProcessor);
        this.instruments.drums = new Drums(this.audioEngine, this.effectsProcessor);

        // Set initial volumes
        this.updateVolumes();

        // Set initial effects
        this.effectsProcessor.setReverb(this.params.effects.reverb);
        this.effectsProcessor.setDelay(this.params.effects.delay);
        this.effectsProcessor.setTone(this.params.effects.tone);

        console.log('Jazz App initialized');
    }

    setupUI() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Presets
        document.querySelectorAll('.preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const presetName = e.target.dataset.preset;
                this.loadPreset(presetName);
            });
        });

        // Style controls
        this.addControl('root-note', (val) => {
            this.params.rootNote = val;
        });

        this.addControl('tempo', (val) => {
            this.params.tempo = parseInt(val);
            document.getElementById('tempo-value').textContent = val;
        });

        this.addControl('complexity', (val) => {
            this.params.complexity = parseInt(val);
            document.getElementById('complexity-value').textContent = val;
        });

        this.addControl('swing', (val) => {
            this.params.swing = parseInt(val);
            document.getElementById('swing-value').textContent = val;
        });

        // Mix controls
        this.addControl('piano-vol', (val) => {
            this.params.volumes.piano = parseInt(val);
            document.getElementById('piano-vol-value').textContent = val;
            if (this.instruments.piano) {
                this.instruments.piano.setVolume(parseInt(val));
            }
        });

        this.addControl('bass-vol', (val) => {
            this.params.volumes.bass = parseInt(val);
            document.getElementById('bass-vol-value').textContent = val;
            if (this.instruments.bass) {
                this.instruments.bass.setVolume(parseInt(val));
            }
        });

        this.addControl('drums-vol', (val) => {
            this.params.volumes.drums = parseInt(val);
            document.getElementById('drums-vol-value').textContent = val;
            if (this.instruments.drums) {
                this.instruments.drums.setVolume(parseInt(val));
            }
        });

        this.addControl('density', (val) => {
            this.params.density = parseInt(val);
            document.getElementById('density-value').textContent = val;
        });

        // Effects controls
        this.addControl('reverb', (val) => {
            this.params.effects.reverb = parseInt(val);
            document.getElementById('reverb-value').textContent = val;
            if (this.effectsProcessor) {
                this.effectsProcessor.setReverb(parseInt(val));
            }
        });

        this.addControl('delay', (val) => {
            this.params.effects.delay = parseInt(val);
            document.getElementById('delay-value').textContent = val;
            if (this.effectsProcessor) {
                this.effectsProcessor.setDelay(parseInt(val));
            }
        });

        this.addControl('tone', (val) => {
            this.params.effects.tone = parseInt(val);
            document.getElementById('tone-value').textContent = val;
            if (this.effectsProcessor) {
                this.effectsProcessor.setTone(parseInt(val));
            }
        });

        // Transport controls
        document.getElementById('play-btn').addEventListener('click', () => {
            this.start();
        });

        document.getElementById('stop-btn').addEventListener('click', () => {
            this.stop();
        });
    }

    addControl(id, callback) {
        const el = document.getElementById(id);
        if (!el) return;

        const event = el.tagName === 'SELECT' ? 'change' : 'input';
        el.addEventListener(event, (e) => callback(e.target.value));
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        const tab = document.querySelector(`[data-tab="${tabName}"]`);
        const panel = document.getElementById(`${tabName}-panel`);

        if (tab) tab.classList.add('active');
        if (panel) panel.classList.add('active');
    }

    loadPreset(presetName) {
        const preset = presets[presetName];
        if (!preset) return;

        this.params = JSON.parse(JSON.stringify(preset));

        // Update UI
        document.getElementById('root-note').value = preset.rootNote;
        document.getElementById('tempo').value = preset.tempo;
        document.getElementById('complexity').value = preset.complexity;
        document.getElementById('swing').value = preset.swing;
        document.getElementById('density').value = preset.density;

        document.getElementById('piano-vol').value = preset.volumes.piano;
        document.getElementById('bass-vol').value = preset.volumes.bass;
        document.getElementById('drums-vol').value = preset.volumes.drums;

        document.getElementById('reverb').value = preset.effects.reverb;
        document.getElementById('delay').value = preset.effects.delay;
        document.getElementById('tone').value = preset.effects.tone;

        // Update value displays
        document.getElementById('tempo-value').textContent = preset.tempo;
        document.getElementById('complexity-value').textContent = preset.complexity;
        document.getElementById('swing-value').textContent = preset.swing;
        document.getElementById('density-value').textContent = preset.density;

        document.getElementById('piano-vol-value').textContent = preset.volumes.piano;
        document.getElementById('bass-vol-value').textContent = preset.volumes.bass;
        document.getElementById('drums-vol-value').textContent = preset.volumes.drums;

        document.getElementById('reverb-value').textContent = preset.effects.reverb;
        document.getElementById('delay-value').textContent = preset.effects.delay;
        document.getElementById('tone-value').textContent = preset.effects.tone;

        // Apply to engine
        if (this.effectsProcessor) {
            this.effectsProcessor.setReverb(preset.effects.reverb);
            this.effectsProcessor.setDelay(preset.effects.delay);
            this.effectsProcessor.setTone(preset.effects.tone);
        }

        this.updateVolumes();

        console.log(`Loaded preset: ${presetName}`);
    }

    updateVolumes() {
        if (this.instruments.piano) {
            this.instruments.piano.setVolume(this.params.volumes.piano);
        }
        if (this.instruments.bass) {
            this.instruments.bass.setVolume(this.params.volumes.bass);
        }
        if (this.instruments.drums) {
            this.instruments.drums.setVolume(this.params.volumes.drums);
        }
    }

    async start() {
        if (this.isPlaying) return;

        if (!this.effectsProcessor) {
            await this.init();
        }

        await this.audioEngine.resume();

        this.isPlaying = true;
        document.getElementById('play-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;

        // Generate chord progression
        this.progression = this.generator.generateProgression(
            this.params.rootNote,
            this.params.style
        );

        this.currentMeasure = 0;
        this.playMeasure();

        console.log('Playback started');
    }

    stop() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        document.getElementById('play-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;

        if (this.loopTimeout) {
            clearTimeout(this.loopTimeout);
            this.loopTimeout = null;
        }

        document.getElementById('current-chord').textContent = '—';

        console.log('Playback stopped');
    }

    // Apply swing timing to a beat position
    applySwing(beat) {
        // Swing ratio: 50 = straight (1:1), 67 = standard swing (2:1), 75 = heavy swing
        const swingRatio = this.params.swing / 100;

        // Check if this is an offbeat (swing applies to 8th notes on offbeats)
        const wholeBeat = Math.floor(beat);
        const fraction = beat - wholeBeat;

        if (fraction > 0 && fraction < 0.5) {
            // This is an offbeat - apply swing
            // In swing, the second 8th note is delayed
            const swingDelay = (swingRatio - 0.5) * 0.5;
            return wholeBeat + 0.5 + swingDelay;
        }

        return beat;
    }

    playMeasure() {
        if (!this.isPlaying) return;

        const currentChord = this.progression[this.currentMeasure % this.progression.length];

        // Display current chord
        const chordName = `${currentChord.root}${currentChord.type}`;
        document.getElementById('current-chord').textContent = chordName;

        // Generate parts for this measure
        const measureProgression = [currentChord];
        const melody = this.generator.generateMelody(
            measureProgression,
            this.params.complexity,
            this.params.density,
            this.params.swing
        );

        const comping = this.generator.generateComping(
            measureProgression,
            this.params.density
        );

        const bassline = this.generator.generateWalkingBass(
            this.progression,
            this.params.density,
            this.params.swing
        );

        const drums = this.generator.generateDrumPattern(
            this.params.style,
            this.params.density,
            this.params.swing,
            16
        );

        // Filter parts for current measure
        const measureStart = this.currentMeasure * 4;
        const measureEnd = measureStart + 4;

        // Play piano comping with swing
        comping.forEach(note => {
            if (note.time >= measureStart && note.time < measureEnd) {
                const time = this.applySwing(note.time - measureStart) + (note.stagger || 0);
                this.instruments.piano.playNote(
                    note.note,
                    note.octave,
                    note.duration,
                    time,
                    note.velocity
                );
            }
        });

        // Play bass with swing
        bassline.forEach(note => {
            if (note.time >= measureStart && note.time < measureEnd) {
                const time = this.applySwing(note.time - measureStart);
                this.instruments.bass.playNote(
                    note.note,
                    note.octave,
                    note.duration,
                    time,
                    note.velocity
                );
            }
        });

        // Play drums with swing
        drums.forEach(hit => {
            const time = this.applySwing(hit.time);
            switch (hit.type) {
                case 'kick':
                    this.instruments.drums.playKick(time, hit.velocity);
                    break;
                case 'snare':
                    this.instruments.drums.playSnare(time, hit.velocity);
                    break;
                case 'hihat-closed':
                    this.instruments.drums.playHiHat(time, true, hit.velocity);
                    break;
                case 'ride':
                    this.instruments.drums.playRide(time, hit.velocity);
                    break;
                case 'ride-bell':
                    this.instruments.drums.playRideBell(time, hit.velocity);
                    break;
            }
        });

        // Schedule next measure
        this.currentMeasure++;
        const measureDuration = (60 / this.params.tempo) * 4 * 1000;
        this.loopTimeout = setTimeout(() => this.playMeasure(), measureDuration);
    }

    setupVisualization() {
        const canvas = document.getElementById('visualizer');
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            // Clear with fade effect
            ctx.fillStyle = 'rgba(20, 20, 20, 0.1)';
            ctx.fillRect(0, 0, width, height);

            if (this.audioEngine.initialized && this.isPlaying) {
                const analyser = this.audioEngine.getAnalyser();
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                analyser.getByteFrequencyData(dataArray);

                const barWidth = (width / bufferLength) * 2.5;
                let x = 0;

                ctx.fillStyle = '#4a9eff';

                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = (dataArray[i] / 255) * height * 0.7;

                    ctx.globalAlpha = 0.8;
                    ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

                    x += barWidth;
                }

                ctx.globalAlpha = 1;
            }

            requestAnimationFrame(draw);
        };

        draw();
    }
}

const app = new JazzApp();
console.log('Jazz Generator loaded');
