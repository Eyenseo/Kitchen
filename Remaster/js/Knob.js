function Knob(context, data, restrainer, plate) {
	PhysicalThing.call(this, context, data, restrainer);
	this.plate = plate;
	this.state = 0;
}
Knob.prototype = Object.create(PhysicalThing.prototype);
Knob.prototype.constructor = Knob;

/**
 * The function changes the state and and the image rotation of the knob and its plate
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

//TODO Doc
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

//TODO Doc
Knob.prototype.clickAction = function(kitchen) {
	this.changeState();
	kitchen.soundManager.play(kitchen.soundManager.KNOB);
};