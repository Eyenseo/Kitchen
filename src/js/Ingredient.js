/**
 * represents an object to be rendered on the stage that represents a ingredient to be cooked
 * @param context context object - the 2d context of the canvas
 * @param data OBJECT - object obtained from the ingredient.json file that defines the ingredient
 */
function Ingredient(context, data) {
	VisualRenderAnimation.call(this, context, data.sx, data.sy, data.w, data.h, data.picture, data.zOrder, data.aniObject);
	this.setDraggable(true);
	this.name = data.name;

	this.HEATRISINGRATE = data.actionTime;
	this.DEFAULTTEMPERATURE = 24;
	this.temperature = this.DEFAULTTEMPERATURE;

	this.HEATED = 0;
	this.HEATING = 1;
	this.COOLING = 2;
	this.COOL = 3;
	this.temperatureState = this.COOL;

	//state to check if an Ingredient ist cooked or not. At the beginning false
	this.cookState = false;
	//The cutState is false at the beginning of the program because the ingredients are uncut
	this.cutState = false;
	//The hoverState is false at the beginning
	this.hoverState = false;

	this.cuttingBoard = null;

	this.logCounter = 0;
}
Ingredient.prototype = Object.create(VisualRenderAnimation.prototype);
Ingredient.prototype.constructor = Ingredient;

/**
 * The function updated the temperature of the ingredient towards the temperature parameter respect the HEATRISINGRATE attribute
 * @param temperature NUMBER - the value determines the temperature of the environment
 */
Ingredient.prototype.updateTemperature = function(temperature) {
	if(this.temperature != temperature) {
		if(this.temperature < temperature) {
			this.temperature = this.temperature + temperature * this.HEATRISINGRATE;
			this.temperatureState = this.HEATING;
			if(this.temperature > temperature) {
				this.temperature = temperature;
				this.temperatureState = this.HEATED;
				this.setCooked(true);
			}
		} else if(this.temperature > temperature) {
			this.temperature = this.temperature - temperature * this.HEATRISINGRATE;
			this.temperatureState = this.COOLING;
			if(this.temperature < temperature) {
				this.temperature = temperature;
				this.temperatureState = this.COOL;
			}
		}
	}
	if(this.temperature != this.DEFAULTTEMPERATURE) {
		this.logTemperature();
	}
};

/**
 * The function prints out the temperature of the ingredient every 120 frames
 */
Ingredient.prototype.logTemperature = function() {
	if(this.logCounter == 120) {
		this.logCounter = 0;
		console.log(this.name + ": " + this.temperature);
	} else {
		this.logCounter++;
	}
};

//TODO Doc
Ingredient.prototype.dragEndAction = function(kitchen) {
	var THIS = this;
	var ingredientCenterX = this.getCenter().cx;
	var ingredientCenterY = this.getCenter().cy;

	kitchen.allObjects.forEach(function(object) {
		if(object instanceof ContainerUtensil) {
			var zone = object.getHitZone();
			if(ingredientCenterX >= zone.hx && ingredientCenterY >= zone.hy && ingredientCenterX <= zone.hx + zone.hw && ingredientCenterY <= zone.hy + zone.hh) {
				object.addContent(THIS);
				if(!(object instanceof CuttingBoard)) {
					kitchen.stage.removeFromStage(THIS);
					kitchen.soundManager.play(kitchen.soundManager.DROP);
				}
			}
		}
	});
};

/**
 * Function to drag an ingredient.
 * When the ingredient lied on the cutting board it is removed from the array in the cutting board.
 */
Ingredient.prototype.dragStartAction = function() {
	if(!(this.cuttingBoard == null)) {
		this.cuttingBoard.removeContent(this);
	}
};

/**
 * Function to make the ingredients hover.
 * Checks if the ingredient is cut or not that it shows the right hovered image.
 */
Ingredient.prototype.mouseOverAction = function() {
	if(this.cutState) {
		this.changeAnimation("cutHover");
	} else {
		this.changeAnimation("defaultHover");
	}
};

/**
 * Function to change the image of an ingredient when it is cut.
 */
Ingredient.prototype.changeState = function() {
	this.changeAnimation("cut");
	this.cutState = true;
};

Ingredient.prototype.mouseOutAction = function() {
	if(this.cutState) {
		this.changeAnimation("cut");
	} else {
		this.changeAnimation("default");
	}
};

/** Getter function to get the cut state of an ingredient ...*/
Ingredient.prototype.isCut = function() {
	return this.cutState;
};

/** Set the cook state ...*/
Ingredient.prototype.setCooked = function(state) {
	this.cookState = state;
};

/** Getter function to get the cook state ...*/
Ingredient.prototype.isCooked = function() {
	return this.cookState;
};