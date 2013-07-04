/**
 * This object is a child of PhysicalThing and is intended to heat up CookContainer objects
 *
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @constructor
 */
function Plate(stage, data, restrainer) {
	PhysicalThing.call(this, stage, data, restrainer);
	this.state = 0;
}

Plate.prototype = Object.create(PhysicalThing.prototype);
Plate.prototype.constructor = Plate;

/**
 * the function will set the current stage of the plate
 * @param state NUMBER - value of the stage [0-3]
 */
Plate.prototype.setState = function(state) {
	this.state = state;
	this.selectAnimation(true);
};

/**
 * the function is called to update the image/animation to be displayed
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
Plate.prototype.selectAnimation = function(keepIndex) {
	var anim = "";

	switch(this.state) {
		case 0:
			anim = "default";
			if(this.currentAnimationName !== "default" && this.currentAnimationName !== "defaultHover") {
				keepIndex = false;
			}
			break;
		case 1:
			anim = "low";
			break;
		case 2:
			anim = "medium";
			break;
		case 3:
			anim = "high";
	}
	if(this.hover) {
		anim += "Hover";
	}

	this.changeAnimation(anim, keepIndex);
};

/**
 * the function is called by the kitchen at evey frame draw
 * the function will update the temperature of all linked Objects
 */
Plate.prototype.action = function() {
	var THIS = this;
	if(this.linkedObjects.length > 0) {
		this.linkedObjects.forEach(function(object) {
			if(object instanceof CookContainer) {
				if(THIS.state !== 0) {
					object.updateTemperature(60 * THIS.state);
				} else {
					object.updateTemperature(this.DEFAULTTEMP);
				}
			}
		});
	}
};