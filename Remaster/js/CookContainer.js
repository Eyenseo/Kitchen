function CookContainer(stage, data, restrainer, soundManager) {
	Container.call(this, stage, data, restrainer);
	this.soundManager = soundManager;
	this.temperatureState = "defaultEmpty";
	this.temperatureLevel = "default";
}
CookContainer.prototype = Object.create(Container.prototype);
CookContainer.prototype.constructor = CookContainer;

CookContainer.prototype.CON_updateTemperature = CookContainer.prototype.updateTemperature;
CookContainer.prototype.updateTemperature = function(temperature) {
	this.CON_updateTemperature(temperature);
	this.selectAnimation();
};

CookContainer.prototype.selectAnimation = function() {
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

CookContainer.prototype.CON_addLinkedObject = CookContainer.prototype.addLinkedObject;
CookContainer.prototype.addLinkedObject = function(object) {
	if(object instanceof Plate) {
		this.soundManager.play(this.soundManager.POTONTOSTOVE);
		this.linkedObjects.push(object);
	} else {
		return this.CON_addLinkedObject(object);
	}
};

CookContainer.prototype.CON_action = CookContainer.prototype.action;
CookContainer.prototype.action = function(kitchen) {
	this.CON_action(kitchen);
};