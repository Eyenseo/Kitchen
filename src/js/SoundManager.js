/**
 * The SoundManager manages the sound files.
 */
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
//TODO is this needed?
SoundManager.prototype.constructor = SoundManager;

/**
 * The function initialise the sound arrays by filling them with Audio objects
 * @param array - the value determines the array th ned Audio objects will be saved in (it has to have a length)
 * @param path TEXT - the value determines the path to the audio file.
 */
SoundManager.prototype.initialiseSound = function(array, path) {
	for(var i = 0; i < array.length; i++) {
		array[i] = new Audio(path);
	}
};

/**
 * @param sound AUDIO Array - the value determines from which Audio array a playing not looping sound shall be stopped.
 */
SoundManager.prototype.stop = function(sound) {
	this.manageSound(sound, 0);
};

/**
 * @param sound AUDIO Array - the value determines from which Audio array a stopped / ended sound shall be played not looping.
 */
SoundManager.prototype.play = function(sound) {
	this.manageSound(sound, 1);
};

/**
 * @param sound AUDIO Array - the value determines from which Audio array a playing looping sound shall be stopped.
 */
SoundManager.prototype.stopLoop = function(sound) {

	this.manageSound(sound, 2);
};

/**
 * @param sound AUDIO Array - the value determines from which Audio array a stopped / ended sound shall be played looping.
 */
SoundManager.prototype.playLoop = function(sound) {
	this.manageSound(sound, 3);
};

/**
 * the function sets the value of the loop variable of the selected sound.
 * @param sound AUDIO Array - the value determines from which Audio array a sound shall be stopped/played looping/not looping
 * @param status NUMBER - the value determines what shall be done with the sound Audio array.
 *                        0: Stop not looping sound
 *                        1: Play not looping sound
 *                        2: Stop looping sound
 *                        3: Play looping sound
 */
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

/**
 * The function stops/plays a looping/not looping sound of the sound Array and returns the amount of looping sounds of the sound Array
 * @param sound AUDIO Array - the value determines from which Audio array a sound shall be stopped/played looping/not looping
 * @param loop NUMBER - the value determines how many sounds of the sound array are looping.
 * @param status NUMBER - the value determines what shall be done with the sound Audio array.
 *                        0: Stop not looping sound
 *                        1: Play not looping sound
 *                        2: Stop looping sound
 *                        3: Play looping sound
 * @returns {number} NUMBER - the return value is the amount of looping sounds from the sound array
 */
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

