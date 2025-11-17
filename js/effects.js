export class EffectsProcessor {
    constructor(audioEngine) {
        this.audioEngine = audioEngine;
        this.ctx = audioEngine.getContext();

        this.setupEffects();
    }

    setupEffects() {
        this.reverbNode = this.ctx.createConvolver();
        this.reverbGain = this.ctx.createGain();
        this.reverbGain.gain.value = 0.4;

        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.value = 0.3;
        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.value = 0.3;
        this.delayGain = this.ctx.createGain();
        this.delayGain.gain.value = 0.2;

        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.value = 8000;
        this.filterNode.Q.value = 1;

        this.distortionNode = this.ctx.createWaveShaper();
        this.distortionGain = this.ctx.createGain();
        this.distortionGain.gain.value = 0;

        this.dryGain = this.ctx.createGain();
        this.dryGain.gain.value = 0.7;
        this.wetGain = this.ctx.createGain();
        this.wetGain.gain.value = 0.3;

        this.delayNode.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayNode);
        this.delayNode.connect(this.delayGain);

        this.createReverbImpulse();
    }

    createReverbImpulse() {
        const sampleRate = this.ctx.sampleRate;
        const length = sampleRate * 2;
        const impulse = this.ctx.createBuffer(2, length, sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }

        this.reverbNode.buffer = impulse;
    }

    makeDistortionCurve(amount = 50) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;
        const k = amount;

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }

        return curve;
    }

    connectInstrument(sourceNode) {
        const effectChain = this.ctx.createGain();
        effectChain.gain.value = 1;

        sourceNode.connect(effectChain);

        effectChain.connect(this.dryGain);

        effectChain.connect(this.distortionNode);
        this.distortionNode.connect(this.distortionGain);
        this.distortionGain.connect(this.filterNode);

        this.filterNode.connect(this.reverbNode);
        this.reverbNode.connect(this.reverbGain);
        this.reverbGain.connect(this.wetGain);

        effectChain.connect(this.delayNode);
        this.delayGain.connect(this.wetGain);

        this.dryGain.connect(this.audioEngine.getMasterGain());
        this.wetGain.connect(this.audioEngine.getMasterGain());

        return effectChain;
    }

    setReverb(value) {
        this.reverbGain.gain.setTargetAtTime(value / 100, this.ctx.currentTime, 0.1);
    }

    setDelay(value) {
        this.delayGain.gain.setTargetAtTime(value / 100, this.ctx.currentTime, 0.1);
        this.delayFeedback.gain.setTargetAtTime((value / 100) * 0.5, this.ctx.currentTime, 0.1);
    }

    setTone(value) {
        // Tone control: 0 = dark, 100 = bright
        const freq = 500 + (value / 100) * 9500;
        this.filterNode.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
    }
}
