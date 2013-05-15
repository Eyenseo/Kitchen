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
 * @param soundManager SoundManager object - the value determines the SoundManager to be used
 * @param aniObject object - The value determines the animation information for the VisualRenderAnimation
 */
function Pot(context, sx, sy, w, h, imgPath, zOrder, draggable, name, heatRisingRate, soundManager, aniObject) {
	VisualRenderAnimation.call(this, context, sx, sy, w, h, imgPath, zOrder, aniObject);
	this.setDraggable(draggable);
	this.name = name;
	this.soundManager = soundManager;

	this.potContent = [];
	this.setHitZone(35, 8, 205, 42);

	this.HEATRISINGRATE = heatRisingRate;
	this.DEFAULTTEMPERATURE = 24;
	this.goalTemperature = this.DEFAULTTEMPERATURE;
	this.temperature = this.DEFAULTTEMPERATURE;

	this.temperatureState = "default";

	this.plate = null;

	this.logCounter = 0;
}
Pot.prototype = Object.create(VisualRenderAnimation.prototype);
Pot.prototype.constructor = Pot;

/**
 * @param ingredient Ingredient object to be added to the potContent array
 */
Pot.prototype.addPotContent = function(ingredient) {
	if(ingredient instanceof Ingredient) {
		this.potContent.push(ingredient);
	}
};

/**
 * @returns {Array} Ingredient - the return value is an array filled with all ingredients that are in the pot
 */
Pot.prototype.getPotContent = function() {
	return this.potContent;
};

/**
 * @param temperature NUMBER -  the value determines the temperature to be set to be the goal temperature
 */
Pot.prototype.setGoalTemperature = function(temperature) {
	this.goalTemperature = temperature;
};

/**
 * The function starts the sound for heating and sets the right animation based on the current temperature
 */
	//TODO Better function name
Pot.prototype.updatePot = function() {
	var temperatureLevel = this.getTemperatureLevel();
	var state = this.getStatus();

	if(temperatureLevel + state != this.temperatureState) {
		if(this.temperatureState == "default") {
			this.soundManager.playLoop(this.soundManager.POTHEATINGUP);
		}
		if(temperatureLevel == "default") {
			this.soundManager.stopLoop(this.soundManager.POTHEATINGUP);
		}
		this.temperatureState = temperatureLevel + state;
		this.changeAnimation(this.temperatureState);
	}
};

/**
 * @returns {string} TEXT - the return value is the current temperature level: default, low, medium, high
 */
Pot.prototype.getTemperatureLevel = function() {
	if(this.temperature <= this.DEFAULTTEMPERATURE) {
		return "default";
	} else if(this.temperature < 90 && this.temperature >= this.DEFAULTTEMPERATURE) {
		return "low";
	} else if(this.temperature < 140 && this.temperature >= 90) {
		return "medium";
	} else {
		return "high";
	}
};

/**
 *
 * @returns {string} TEXT - the return value is the current state of the Pot if it's default temperature "", if it's changing the temperature "Changing" and if it reached the goal temperature "Static"
 */
Pot.prototype.getStatus = function() {
	if(this.temperature == this.DEFAULTTEMPERATURE) {
		return "";
	} else if(this.temperature == this.goalTemperature) {
		return "Static";
	} else {
		return "Changing";
	}
};

/**
 * The function updated the temperature of the pot towards the temperature parameter respect the HEATRISINGRATE attribute
 */
	//TODO think of better names for the functions updateTemerature/s
Pot.prototype.updateTemperature = function() {
	if(this.temperature != this.goalTemperature) {
		if(this.temperature < this.goalTemperature) {
			this.temperature = this.temperature + this.goalTemperature * this.HEATRISINGRATE;
			if(this.temperature >= this.goalTemperature) {
				this.temperature = this.goalTemperature;
			}
		} else if(this.temperature > this.goalTemperature) {
			this.temperature = this.temperature - this.goalTemperature * this.HEATRISINGRATE;
			if(this.temperature <= this.goalTemperature) {
				this.temperature = this.goalTemperature;
			}
		}
	}
	this.updatePot();
};

/**
 * The function updates the temperature of the pot and temperatures of all ingredients of the potContent array
 * DEBUG: runs logTemperature function
 */
Pot.prototype.updateTemperatures = function() {
	this.updateTemperature();
	for(var i = 0; i < this.potContent.length; i++) {
		this.potContent[i].updateTemperature(this.temperature);
	}
	if(this.temperature != this.DEFAULTTEMPERATURE) {
		this.logTemperature();
	}
};

/**
 * The function prints out the temperature of the pot every 90 frames
 */
Pot.prototype.logTemperature = function() {
	if(this.logCounter == 90) {
		this.logCounter = 0;
		console.log(this.name + ": " + this.temperature);
	} else {
		this.logCounter++;
	}
};

/**
 * @param plate The value determines the plate the Pot is standing on
 */
Pot.prototype.setPlate = function(plate) {
	this.plate = plate
};
