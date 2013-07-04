function Oven(stage, data, restrainer, soundManager) {
	Plate.call(this, stage, data, restrainer);
	this.soundManager = soundManager;
	this.open = false;
}

Oven.prototype = Object.create(Plate.prototype);
Oven.prototype.constructor = Oven;

/**
 * the function is called to update the image/animation to be displayed
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
Oven.prototype.selectAnimation = function(keepIndex) {
	var anim = "";

	switch(this.state) {
		case 0:
			anim = "default";
			break;
		case 1:
			anim += "low";
			break;
		case 2:
			anim += "medium";
			break;
		case 3:
			anim += "high";
	}

	if(this.open) {
		anim += "Open";
	} else {
		anim += "Closed";
	}

	if(this.hover) {
		anim += "Hover";
	}

	this.changeAnimation(anim, keepIndex);
};
/**
 * the function is called by the kitchen upon a click event
 * the function will play a sound for opening and closing
 * the function will update the image/animation
 * @param kitchen - the kitchen
 */
Oven.prototype.clickAction = function(kitchen) {
	this.open = !this.open;

	if(this.open) {
		this.soundManager.play(this.soundManager.OPENDOOR);
	} else {
		this.soundManager.play(this.soundManager.CLOSEDOOR);
	}

	this.selectAnimation(true);
};
/**
 * the function is called by the kitchen at evey frame draw
 * the function will update the temperature of all linked Objects
 */
Oven.prototype.action = function(kitchen) {
	var THIS = this;
	if(this.linkedObjects.length > 0) {
		this.linkedObjects.forEach(function(object) {
			if(object instanceof Container && object.name === "bakingTin") {
				if(THIS.state !== 0) {
					object.updateTemperature(80 * THIS.state);
				} else {
					object.updateTemperature(this.DEFAULTTEMP);
				}
			}
		});
	}
};

/**
 * the function will add the object to the linkedObjects array
 * the function will set the open state to true
 * the function will update the image/animation
 * @param object
 */
Oven.prototype.addLinkedObject = function(object) {
	//	console.log("Oven: Link " + this.name + " with: " + object.name);//DEBUG

	this.open = true;
	this.selectAnimation(false);
	this.linkedObjects.push(object);
};
