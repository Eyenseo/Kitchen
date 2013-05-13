function SoundManager() {
	this.dropLoop = 0;
	this.knobLoop = 0;
	this.potHeatingUpLoop = 0;
	this.potOntoStoveLoop = 0;

	this.DROP = new Array(4);
	this.KNOB = new Array(3);
	this.POTHEATINGUP = new Array(4);
	this.POTONTOSTOVE = new Array(3);

	this.initialiseSound(this.DROP, "sounds/drop.wav");
	this.initialiseSound(this.KNOB, "sounds/knob.wav");
	this.initialiseSound(this.POTHEATINGUP, "sounds/potHeatingUp.wav");
	this.initialiseSound(this.POTONTOSTOVE, "sounds/potOntoStove.wav");
}

SoundManager.prototype.constructor = SoundManager;

SoundManager.prototype.initialiseSound = function(array, path) {
	for(var i = 0; i < array.length; i++) {
		array[i] = new Audio(path);
	}
};

SoundManager.prototype.stop = function(sound) {
	this.manageSound(sound, 0);
};

SoundManager.prototype.play = function(sound) {
	this.manageSound(sound, 1);
};

SoundManager.prototype.stopLoop = function(sound) {

	this.manageSound(sound, 2);
};

SoundManager.prototype.playLoop = function(sound) {
	this.manageSound(sound, 3);
};

SoundManager.prototype.manageSound = function(sound, status) {
	if(sound == this.DROP) {
		this.dropLoop += this.controlSound(this.DROP, this.dropLoop, status);
	} else if(sound == this.KNOB) {
		this.knobLoop += this.controlSound(this.KNOB, this.knobLoop, status);
	} else if(sound == this.POTHEATINGUP) {
		this.potHeatingUpLoop += this.controlSound(this.POTHEATINGUP, this.potHeatingUpLoop, status);
	} else if(sound == this.POTONTOSTOVE) {
		this.potOntoStoveLoop += this.controlSound(this.POTONTOSTOVE, this.potOntoStoveLoop, status);
	}
};

SoundManager.prototype.controlSound = function(sound, loop, status) {
	switch(status) {
		case 0:
			if(loop < sound.length) {
				var playing = 0;
				sound.forEach(function(audio) {
					if(!audio.ended) {
						playing++;
					}
				});
				if(loop < playing) {
					for(var i = 0; i < sound.length; i++) {
						if(!sound[i].ended) {
							sound[i].pause();
							sound[i].currentTime = 0;
							break;
						}
					}
				}
			}
			break;
		case 1:
			if(loop < sound.length) {
				for(var i = 0; i < sound.length; i++) {
					if(sound[i].ended || sound[i].currentTime == 0) {
						sound[i].currentTime = 0;
						sound[i].play();
						break;
					}
				}
			}
			break;
		case 2:
			if(loop > 0) {
				if(loop <= sound.length) {
					for(var i = 0; i < sound.length; i++) {
						if(sound[i].loop == true) {
							sound[i].pause();
							sound[i].loop = false;
							sound[i].currentTime = 0;
							break;
						}
					}
				}
				return -1;
			}
			break;
		case 3:
			if(loop < sound.length) {
				for(var i = 0; i < sound.length; i++) {
					if(sound[i].ended || sound[i].currentTime == 0) {
						sound[i].currentTime = 0;
						sound[i].loop = true;
						sound[i].play();
						break;
					} else if(sound[i].loop == false) {
						sound[i].loop = true;
						break;
					}
				}
			}
			return 1;
	}
	return 0;
};

