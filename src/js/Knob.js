/**
 * represents an object to be rendered on the stage that represents a knob for the stove
 * @param context - context object - the 2d context of the canvas
 * @param sx NUMBER - the start x position
 * @param sy NUMBER - the start y position
 * @param zOrder NUMBER - the order to be drawn on stage
 * @param name TEXT - name of the knob
 * @param plate Plate object -  the value determines the plate the knob is linked to
 */
	//TODO Doc
function Knob(context, data, plate) {
	KitchenStuff.call(this, context, data);
	this.name = "knob";
	this.draggable = false;
	this.plate = plate;
	this.state = 0;
}
Knob.prototype = Object.create(KitchenStuff.prototype);
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
	this.selectAnimation();
	this.plate.setState(this.state);
};

//TODO Doc
Knob.prototype.selectAnimation = function() {
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
	this.changeAnimation(ani);
};

//TODO Doc
Knob.prototype.clickAction = function(kitchen) {
	this.changeState();
	kitchen.soundManager.play(kitchen.soundManager.KNOB);
};
