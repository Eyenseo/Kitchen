function SoundManager() {
	this.DROP = "sounds/drop.wav";
	this.KNOB = "sounds/knob.wav";
	this.POTHEATINGUP = "sounds/potHeatingUp.wav";
	this.POTONTOSTOVE = "sounds/potOntoStove.wav";

	this.dropFirst = null;
	this.knobFirst = null;
	this.potHeatingUpFirst = null;
	this.potOntoStoveFirst = null;

	this.dropEle = new Array(4);
	this.knobEle = new Array(3);
	this.potHeatingUpEle = new Array(4);
	this.potOntoStoveEle = new Array(3);
}

SoundManager.prototype.constructor = SoundManager;

SoundManager.prototype.playSound = function(sound) {
	this.manageSound(sound, 1);
};

SoundManager.prototype.stopSound = function(sound) {
	this.manageSound(sound, 0);
};

SoundManager.prototype.loopSound = function(sound) {
	this.manageSound(sound, 2);
};

SoundManager.prototype.manageSound = function(sound, status) {
	if(sound == this.DROP) {
		this.dropFirst = this.controlSound(this.dropEle, this.dropFirst, this.DROP, status);
	} else if(sound == this.KNOB) {
		this.knobFirst = this.controlSound(this.knobEle, this.knobFirst, this.KNOB, status);
	} else if(sound == this.POTHEATINGUP) {
		this.potHeatingUpFirst = this.controlSound(this.potHeatingUpEle, this.potHeatingUpFirst, this.POTHEATINGUP, status);
	} else if(sound == this.POTONTOSTOVE) {
		this.potOntoStoveFirst = this.controlSound(this.potOntoStoveEle, this.potOntoStoveFirst, this.POTONTOSTOVE, status);
	}
};

SoundManager.prototype.controlSound = function(soundEle, soundFirst, sound, status) {
	if(status > 0) {
		for(var i = 0; i < soundEle.length; i++) {
			if(soundEle[i] == undefined || soundEle[i] == null) {
				//noinspection JSUnresolvedFunction
				soundEle[i] = new Audio(sound);
				if(status == 2) {
					soundEle[i].loop = true;
				}
				soundEle[i].play();
				if(soundFirst == null) {
					return i;
				}
				return soundFirst;
			}
		}
		soundEle[soundFirst].pause();
		soundEle[soundFirst].currentTime = 0;
		soundEle[soundFirst].play();
		if(soundFirst < soundEle.length - 1) {
			return ++soundFirst;
		}
		return 0;
	} else {
		if(soundEle[soundFirst] != undefined && soundEle[soundFirst] != null) {
			soundEle[soundFirst].pause();
			soundEle[soundFirst] = null;
			if(soundFirst < soundEle.length - 1) {
				if(soundEle[soundFirst + 1] != undefined && soundEle[soundFirst + 1] != null) {
					return ++soundFirst;
				}
				return null;
			} else {
				if(soundEle[0] != undefined && soundEle[0] != null) {
					return 0;
				}
				return null;
			}
		}
		return null;
	}
};

SoundManager.prototype.cleanUp = function() {
	this.dropFirst = this.removeEndedSounds(this.dropEle, this.dropFirst);
	this.knobFirst = this.removeEndedSounds(this.knobEle, this.knobFirst);
	this.potHeatingUpFirst = this.removeEndedSounds(this.potHeatingUpEle, this.potHeatingUpFirst);
	this.potOntoStoveFirst = this.removeEndedSounds(this.potOntoStoveEle, this.potOntoStoveFirst);
};

SoundManager.prototype.removeEndedSounds = function(soundEle, soundFirst) {
	if(soundFirst != null) {
		//noinspection JSDuplicatedDeclaration
		for(var i = 0; i < soundEle.length; i++) {
			if(soundEle[i] != null && soundEle[i] != undefined) {
				if(soundEle[i].ended) {
					soundEle[i] = null;
				}
			}
		}
		//noinspection JSDuplicatedDeclaration
		for(var i = 0, j = soundFirst; i < soundEle.length; i++, j = (j + 1 >= soundEle.length) ? 0 : j++) {
			if(soundEle[j] != null) {
				return j;
			}
		}
	}
	return null;
};
