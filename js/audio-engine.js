export class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.analyser = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.7;

            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;

            this.masterGain.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            this.initialized = true;
            console.log('Audio Engine initialized');
        } catch (error) {
            console.error('Failed to initialize audio engine:', error);
            throw error;
        }
    }

    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            return this.audioContext.resume();
        }
    }

    getContext() {
        return this.audioContext;
    }

    getMasterGain() {
        return this.masterGain;
    }

    getAnalyser() {
        return this.analyser;
    }

    getCurrentTime() {
        return this.audioContext ? this.audioContext.currentTime : 0;
    }
}
