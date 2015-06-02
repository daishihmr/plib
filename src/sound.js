/**
 * @class
 */
var Sound = function(data) {
    this.buffer = null;
    this.source = null;
    this.gainNode = null;

    if (Sound.CONTEXT !== null) {
        if (data instanceof ArrayBuffer) {
            Sound.CONTEXT.decodeAudioData(data, function(buffer) {
                this.buffer = buffer;
                this.source = Sound.CONTEXT.createBufferSource();
                this.source.buffer = this.buffer;
                this.gainNode = Sound.CONTEXT.createGain();
                this.source.connect(this.gainNode);
                this.gainNode.connect(Sound.CONTEXT.destination);

                this.onload();
            }.bind(this), function(error) {
                this.onloadfailed();
            });
        } else if (data instanceof AudioBuffer) {
            this.buffer = data;
            this.source = Sound.CONTEXT.createBufferSource();
            this.source.buffer = this.buffer;
            this.gainNode = Sound.CONTEXT.createGain();
            this.source.connect(this.gainNode);
            this.gainNode.connect(Sound.CONTEXT.destination);

            this.onload();
        } else {
            console.error("invalid data.");
            throw new Error("invalid data.");
        }
    } else {
        console.error("webkitAudioContext is not defined.")
        throw new Error("webkitAudioContext is not defined.");
    }
};
Sound.prototype = Object.create(Object.prototype, {
    volume: {
        get: function() { return this.gainNode.gain.value },
        set: function(v) { this.gainNode.gain.value = v },
    },
    loop: {
        get: function() { return this.source.loop },
        set: function(v) { this.source.loop = v },
    },
    loopStart: {
        get: function() { return this.source.loopStart },
        set: function(v) { this.source.loopStart = v },
    },
    loopEnd: {
        get: function() { return this.source.loopEnd },
        set: function(v) { this.source.loopEnd = v },
    }
});

Sound.prototype.onload = function() {};
Sound.prototype.onloadfailed = function() {};
/**
 *
 */
Sound.prototype.start = function() {
    this.source.start(0);
};
/**
 *
 */
Sound.prototype.play = Sound.prototype.start;
/**
 *
 */
Sound.prototype.stop = function() {
    this.source.stop(0);
    this.source.disconnect();
    var volume = this.gainNode.gain.value;
    this.source = Sound.CONTEXT.createBufferSource();
    this.gainNode.gain.value = volume;
    this.source.buffer = this.buffer;
    this.source.connect(Sound.CONTEXT.destination);
};
/**
 *
 */
Sound.prototype.clone = function() {
    var clone = new Sound(this.buffer);
    clone.volume = this.volume;
    clone.loop = this.loop;
    clone.loopStart = this.loopStart;
    clone.loopEnd = this.loopEnd;
    return clone;
};

/**
 *
 */
Sound.CONTEXT = null;
if (window.AudioContext) {
    Sound.CONTEXT = new AudioContext();
} else if (window.mozAudioContext) {
    Sound.CONTEXT = new mozAudioContext();
} else if (window.webkitAudioContext) {
    Sound.CONTEXT = new webkitAudioContext();
}
