/**
 * represents an object to be rendered on the stage that represents a ingredient to be cooked
 * @param context - context object - the 2d context of the canvas
 * @param sx NUMBER - the start x position
 * @param sy NUMBER - the start y position
 * @param w NUMBER - the width of the object
 * @param h NUMBER - the height of the object
 * @param imgPath TEXT- the path of the image
 * @param zOrder NUMBER - the order to be drawn on stage
 * @param draggable BOOLEAN - if the object can be dragged
 * @param name TEXT - name of the ingredient
 * @param heatRisingRate NUMBER - the value determines how fast the ingredient adapts to a different temperature than it has
 */
function Ingredient(context, sx, sy, w, h, imgPath, zOrder, draggable, name, heatRisingRate) {
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);
	this.setDraggable(draggable);
	this.name = name;

	this.HEATRISINGRATE = heatRisingRate;
	this.DEFAULTTEMPERATURE = 24;
	this.temperature = this.DEFAULTTEMPERATURE;

	this.HEATED = 0;
	this.HEATING = 1;
	this.COOLING = 2;
	this.COOL = 3;
	this.temperatureState = this.COOL;

	this.logCounter = 0;
}
Ingredient.prototype = Object.create(VisualRenderObject.prototype);
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