/**
 * This object is a child of PhysicalThing and is intended to set the state of one plate
 *
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @param plate - plate
 * @constructor
 */
function Knob(stage, data, restrainer, plate) {
	PhysicalThing.call(this, stage, data, restrainer);
	this.plate = plate;
	this.state = 0;
}
Knob.prototype = Object.create(PhysicalThing.prototype);
Knob.prototype.constructor = Knob;

/**
 * The function changes the state of the knob and its assigned plate
 * the function will update the image/animation
 */
Knob.prototype.changeState = function() {
	switch(this.state) {
		case 0:
			this.state = 1;
			break;
		case 1:
			this.state = 2;
			break;
		case 2:
			this.state = 3;
			break;
		case 3:
			this.state = 0;
	}
	this.selectAnimation(false);
	this.plate.setState(this.state);
};

/**
 * the function is called to update the image/animation to be displayed
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
Knob.prototype.selectAnimation = function(keepIndex) {
	var ani = "";

	switch(this.state) {
		case 0:
			ani = "default";
			break;
		case 1:
			ani = "one";
			break;
		case 2:
			ani = "two";
			break;
		case 3:
			ani = "three";
	}

	if(this.hover) {
		ani += "Hover";
	}

	this.changeAnimation(ani, keepIndex);
};

/**
 * the function will play a sound and change the state
 * @param kitchen - the kitchen
 */
Knob.prototype.clickAction = function(kitchen) {
	this.changeState();
	kitchen.soundManager.play(kitchen.soundManager.KNOB);
};