/**
 * represents an object to be rendered on the stage that represents a knob for the stove
 * @param context - context object - the 2d context of the canvas
 * @param sx NUMBER - the start x position
 * @param sy NUMBER - the start y position
 * @param zOrder NUMBER - the order to be drawn on stage
 * @param name TEXT - name of the knob
 * @param plate Plate object -  the value determines the plate the knob is linked to
 */
function Knob(context, sx, sy, zOrder, name, plate) {
	VisualRenderObject.call(this, context, sx, sy, 58, 58, "images/knob.png", zOrder);
	this.setDraggable(false);
	this.name = name;
	this.plate = plate;
	this.state = 0;
}
Knob.prototype = Object.create(VisualRenderObject.prototype);
Knob.prototype.constructor = Knob;

/**
 * The function changes the state and and the image rotation of the knob and its plate
 */
Knob.prototype.changeState = function() {
	switch(this.state) {
		case 0:
			this.state = 1;
			this.setRotation(90);
			break;
		case 1:
			this.state = 2;
			this.setRotation(180);
			break;
		case 2:
			this.state = 3;
			this.setRotation(270);
			break;
		case 3:
			this.state = 0;
			this.setRotation(0);
	}
	this.plate.setState(this.state);
};
