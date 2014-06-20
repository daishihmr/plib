/**
 * @class
 */
var SoundEngine = {};

/**
 *
 */
SoundEngine.bgm = null;
/**
 *
 */
SoundEngine.bgmName = null;
/**
 *
 */
SoundEngine.playing = {};
/**
 *
 */
SoundEngine.playSE = function(name) {
    if (Assets[name]) {
        if (SoundEngine.playing[name] === Application.INSTANCE.frame) return;

        SoundEngine.playing[name] = Application.INSTANCE.frame;
        var se = Assets[name].clone();
        se.volume = OptionSettings.seVolume;
        se.start();
    }
};
/**
 *
 */
SoundEngine.startBgm = function(name) {
    if (SoundEngine.bgmName === name) return;

    SoundEngine.stopBgm();

    if (Assets[name]) {
        SoundEngine.bgmName = name;
        SoundEngine.bgm = Assets[name].clone();
        SoundEngine.bgm.loop = true;
        SoundEngine.bgm.volume = OptionSettings.bgmVolume;
        SoundEngine.bgm.start();
    }
};
/**
 *
 */
SoundEngine.stopBgm = function() {
    if (SoundEngine.bgm) {
        SoundEngine.bgm.stop();
        SoundEngine.bgm = null;
        SoundEngine.bgmName = null;
    }
};
