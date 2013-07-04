/**
 * The SoundManager manages the sound files.
 */
function SoundManager() {
	//xyzLoop counts the amount of sound files that are currently looping
	this.dropLoop = 0;
	this.knobLoop = 0;
	this.potHeatingUpLoop = 0;
	this.potOntoStoveLoop = 0;
	this.negativeLoop = 0;
	this.positiveLoop = 0;
	this.waterLoop = 0;
	this.fryingLoop = 0;
	this.openDoorLoop = 0;
	this.closeDoorLoop = 0;
	this.cutLoop = 0;

	//creates array for sound files. The length of the array is the amount of songs that can be played simultaneously
	this.DROP = new Array(4);
	this.KNOB = new Array(3);
	this.POTHEATINGUP = new Array(4);
	this.POTONTOSTOVE = new Array(3);
	this.NEGATIVE = new Array(1);
	this.POSITIVE = new Array(1);
	this.WATER = new Array(3);
	this.FIRYING = new Array(3);
	this.OPENDOOR = new Array(3);
	this.CLOSEDOOR = new Array(3);
	this.CUT = new Array(2);

	this.initialiseSound(this.DROP, "sounds/drop.wav");
	this.initialiseSound(this.KNOB, "sounds/knob.wav");
	this.initialiseSound(this.POTHEATINGUP, "sounds/potHeatingUp.wav");
	this.initialiseSound(this.POTONTOSTOVE, "sounds/potOntoStove.wav");
	this.initialiseSound(this.NEGATIVE, "sounds/negativeBeep.wav");
	this.initialiseSound(this.POSITIVE, "sounds/positiveChime.wav");
	this.initialiseSound(this.WATER, "sounds/water.wav");
	this.initialiseSound(this.FIRYING, "sounds/frying.wav");
	this.initialiseSound(this.OPENDOOR, "sounds/openDoor.wav");
	this.initialiseSound(this.CLOSEDOOR, "sounds/closeDoor.wav");
	this.initialiseSound(this.CUT, "sounds/cut.wav");
}

SoundManager.prototype.constructor = SoundManager;

/**
 * the function will stop all sounds and set all loops to 0
 */
SoundManager.prototype.stopAll = function() {
	this.DROP.forEach(function(sound) {
		sound.pause();
	});
	this.KNOB.forEach(function(sound) {
		sound.pause();
	});
	this.POTHEATINGUP.forEach(function(sound) {
		sound.pause();
	});
	this.POTONTOSTOVE.forEach(function(sound) {
		sound.pause();
	});
	this.NEGATIVE.forEach(function(sound) {
		sound.pause();
	});
	this.POSITIVE.forEach(function(sound) {
		sound.pause();
	});
	this.WATER.forEach(function(sound) {
		sound.pause();
	});
	this.FIRYING.forEach(function(sound) {
		sound.pause();
	});
	this.OPENDOOR.forEach(function(sound) {
		sound.pause();
	});
	this.CLOSEDOOR.forEach(function(sound) {
		sound.pause();
	});
	this.CUT.forEach(function(sound) {
		sound.pause();
	});
	this.dropLoop = 0;
	this.knobLoop = 0;
	this.potHeatingUpLoop = 0;
	this.potOntoStoveLoop = 0;
	this.negativeLoop = 0;
	this.positiveLoop = 0;
	this.waterLoop = 0;
	this.fryingLoop = 0;
	this.openDoorLoop = 0;
	this.closeDoorLoop = 0;
	this.cutLoop = 0;
};

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
	if(sound === this.DROP) {
		this.dropLoop += this.controlSound(this.DROP, this.dropLoop, status);
	} else if(sound === this.POSITIVE) {
		this.positiveLoop += this.controlSound(this.POSITIVE, this.positiveLoop, status);
	} else if(sound === this.NEGATIVE) {
		this.negativeLoop += this.controlSound(this.NEGATIVE, this.negativeLoop, status);
	} else if(sound === this.KNOB) {
		this.knobLoop += this.controlSound(this.KNOB, this.knobLoop, status);
	} else if(sound === this.POTHEATINGUP) {
		this.potHeatingUpLoop += this.controlSound(this.POTHEATINGUP, this.potHeatingUpLoop, status);
	} else if(sound === this.POTONTOSTOVE) {
		this.potOntoStoveLoop += this.controlSound(this.POTONTOSTOVE, this.potOntoStoveLoop, status);
	} else if(sound === this.WATER) {
		this.waterLoop += this.controlSound(this.WATER, this.waterLoop, status);
	} else if(sound === this.FIRYING) {
		this.fryingLoop += this.controlSound(this.FIRYING, this.fryingLoop, status);
	} else if(sound === this.OPENDOOR) {
		this.openDoorLoop += this.controlSound(this.OPENDOOR, this.openDoorLoop, status);
	} else if(sound === this.CLOSEDOOR) {
		this.closeDoorLoop += this.controlSound(this.CLOSEDOOR, this.closeDoorLoop, status);
	} else if(sound === this.CUT) {
		this.cutLoop += this.controlSound(this.CUT, this.cutLoop, status);
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
SoundManager.prototype.controlSound = function(sound, loop, status) { //TODO split up, quite a long function ...
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
						if(!sound[i].ended && sound[i].loop === false) {
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
					if(sound[i].ended || sound[i].currentTime === 0) {
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
						if(sound[i].loop === true) {
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
				var done = false;
				for(var i = 0; i < sound.length; i++) {
					if(sound[i].ended || sound[i].currentTime === 0) {
						sound[i].currentTime = 0;
						sound[i].loop = true;
						sound[i].play();
						done = true;
						break;
					}

				}
				if(!done) {
					for(var i = 0; i < sound.length; i++) {
						if(sound[i].loop === false) {
							sound[i].loop = true;
							break;
						}
					}
				}
			}
			return 1;
	}
	return 0;
};