/**
 * represents an object to be rendered on the stage that represents a knob for the stove
 * @param context - context object - the 2d context of the canvas
 * @param sx NUMBER - the start x position
 * @param sy NUMBER - the start y position
 * @param zOrder NUMBER - the order to be drawn on stage
 * @param name TEXT - name of the plate
 */
	//TODO Doc
function Plate(context, data) {
	ContainerStuff.call(this, context, data);
	this.setDraggable(false);
	this.name = "plate";
	this.state = 0;
}
Plate.prototype = Object.create(ContainerStuff.prototype);
Plate.prototype.constructor = Plate;

/**
 * The function changes the state, image and temperature of the plate
 * @param state NUMBER - the value determines the stage the plate is set to.
 */
	//TODO Improve by using the VisualRenderAnimation
Plate.prototype.setState = function(state) {
	this.state = state;
	this.selectAnimation(true);

	this.updatePotTemperature();
};

//TODO Doc
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
 * The function updates the temperature of the pot based on the stage of the plate
 */
Plate.prototype.updatePotTemperature = function() {
	var THIS = this;
	if(!this.empty) {
		this.content.forEach(function(object) {
			if(THIS.state !== 0) {
				object.setGoalTemperature(60 * THIS.state);
			} else {
				object.setGoalTemperature(object.DEFAULTTEMPERATURE);
			}
		});
	}
};
//TODO DOC
Plate.prototype.addContent = function(object) {
	if(object instanceof Pot) {
		this.content.push(object);
		this.empty = false;
	}
};
