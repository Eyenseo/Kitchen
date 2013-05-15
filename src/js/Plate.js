/**
 * represents an object to be rendered on the stage that represents a knob for the stove
 * @param context - context object - the 2d context of the canvas
 * @param sx NUMBER - the start x position
 * @param sy NUMBER - the start y position
 * @param zOrder NUMBER - the order to be drawn on stage
 * @param name TEXT - name of the plate
 */
function Plate(context, sx, sy, zOrder, name) {
	VisualRenderObject.call(this, context, sx, sy, 198, 67, "images/platte0.png", zOrder);
	this.setDraggable(false);
	this.name = name;
	this.state = 0;
	this.pot = null;
}
Plate.prototype = Object.create(VisualRenderObject.prototype);
Plate.prototype.constructor = Plate;

/**
 * The function changes the state, image and temperature of the plate
 * @param state NUMBER - the value determines the stage the plate is set to.
 */
	//TODO Improve by using the VisualRenderAnimation
Plate.prototype.setState = function(state) {
	this.state = state;
	this.changeImage("images/platte" + state + ".png");
	this.updatePotTemperature();
};

/**
 * @param pot Pot object - the value determines the pot that is currently on the plate
 */
Plate.prototype.setPot = function(pot) {
	this.pot = pot;
};

/**
 * The function updates the temperature of the pot based on the stage of the plate
 */
Plate.prototype.updatePotTemperature = function() {
	if(this.pot != null) {
		if(this.state != 0) {
			this.pot.setGoalTemperature(60 * this.state);
		} else {
			this.pot.setGoalTemperature(this.pot.DEFAULTTEMPERATURE);
		}
	}
};
