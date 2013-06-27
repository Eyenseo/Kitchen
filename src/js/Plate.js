/**
 * represents an object to be rendered on the stage that represents a knob for the stove
 * @param context - context object - the 2d context of the canvas
 * @param sx NUMBER - the start x position
 * @param sy NUMBER - the start y position
 * @param zOrder NUMBER - the order to be drawn on stage
 * @param name TEXT - name of the plate
 */
function Plate(context, sx, sy, zOrder, name) {
	var aniObject = {
		"image"     : {
			"tileWidth" : 198,
			"tileHeight": 67,
			"imgWidth"  : 792,
			"imgHeight" : 67
		},
		"animations": {
			"default"     : {
				"seq" : [0],
				"loop": false
			},
			"lowStatic"   : {
				"seq" : [1],
				"loop": false
			},
			"mediumStatic": {
				"seq" : [2],
				"loop": false
			},
			"highStatic"  : {
				"seq" : [3],
				"loop": false
			}
		}
	};

	VisualRenderAnimation.call(this, context, sx, sy, 198, 67, "images/platte.png", zOrder, aniObject);
	this.setDraggable(false);
	this.name = name;
	this.state = 0;
	this.pot = null;
}
Plate.prototype = Object.create(VisualRenderAnimation.prototype);
Plate.prototype.constructor = Plate;

/**
 * The function changes the state, image and temperature of the plate
 * @param state NUMBER - the value determines the stage the plate is set to.
 */
	//TODO Improve by using the VisualRenderAnimation
Plate.prototype.setState = function(state) {
	this.state = state;

	switch(state) {
		case 0:
			this.changeAnimation("default");
			break;
		case 1:
			this.changeAnimation("lowStatic");
			break;
		case 2:
			this.changeAnimation("mediumStatic");
			break;
		case 3:
			this.changeAnimation("highStatic");
	}
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
	if(this.pot !== null) {
		if(this.state !== 0) {
			this.pot.setGoalTemperature(60 * this.state);
		} else {
			this.pot.setGoalTemperature(this.pot.DEFAULTTEMPERATURE);
		}
	}
};
