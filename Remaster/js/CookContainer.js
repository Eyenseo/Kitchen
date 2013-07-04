/**
 * This object is used for objects that will heat up and have a content
 * It's a child of Container
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @param soundManager - soundManager
 * @constructor
 */
function CookContainer(stage, data, restrainer, soundManager) {
	Container.call(this, stage, data, restrainer);
	this.soundManager = soundManager;
	this.temperatureState = "defaultEmpty";
	this.temperatureLevel = "default";
}
CookContainer.prototype = Object.create(Container.prototype);
CookContainer.prototype.constructor = CookContainer;

/**
 * the function is the function of the parent object
 * @type {Function}
 */
CookContainer.prototype.CON_updateTemperature = CookContainer.prototype.updateTemperature;
/**
 * the function is the overridden function of the parent
 * the function will update the temperature according to the temperature parameter and the objects in the content array
 * the function will update the image/animation
 * @param temperature NUMBER - temperature of the object that calls the function
 */
CookContainer.prototype.updateTemperature = function(temperature) {
	this.CON_updateTemperature(temperature);
	this.selectAnimation(true);
};

/**
 * the function is called to update the image/animation to be displayed
 * the function will start and stop the heating sound accordingly to the temperature level
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
CookContainer.prototype.selectAnimation = function(keepIndex) {
	var temperatureLevel = this.getTemperatureLevel();
	var state = this.getStatus();

	if(temperatureLevel + state !== this.temperatureState) {
		if(this.temperatureLevel === "default") {
			this.soundManager.playLoop(this.soundManager.POTHEATINGUP);
		}
		if(temperatureLevel === "default") {
			this.soundManager.stopLoop(this.soundManager.POTHEATINGUP);
		}
		this.temperatureLevel = temperatureLevel;
		this.temperatureState = temperatureLevel + state;
		this.changeAnimation(this.temperatureState, true);
	}
};

/**
 * the function will calculate the current temperature level
 * @returns {string} the return value is the state of the CookContainer
 */
CookContainer.prototype.getTemperatureLevel = function() {
	if(this.temperature <= this.DEFAULTTEMP) {
		return "default";
	} else if(this.temperature < 90 && this.temperature >= this.DEFAULTTEMP) {
		return "low";
	} else if(this.temperature < 140 && this.temperature >= 90) {
		return "medium";
	} else {
		return "high";
	}
};

/**
 * the function will calculate the current status of the CookContainer
 * @returns {string}
 */
CookContainer.prototype.getStatus = function() {
	var state;

	if(this.content.length === 0) {
		state = "Empty";
	} else {
		state = "Full";
	}

	if(this.temperature !== this.DEFAULTTEMP) {
		state += "Cooking"
	}

	if(this.hover) {
		state += "Hover";
	}

	return state;
};

/**
 * the function is the function of the parent object
 * @type {Function}
 */
CookContainer.prototype.CON_addLinkedObject = CookContainer.prototype.addLinkedObject;
/**
 * the function is the overridden function of the parent
 * the function will play a sound if the object to be added is a plate
 * @param object - object to be added
 */
CookContainer.prototype.addLinkedObject = function(object) {
	if(object instanceof Plate) {
		this.soundManager.play(this.soundManager.POTONTOSTOVE);
		this.linkedObjects.push(object);
	} else {
		return this.CON_addLinkedObject(object);
	}
};