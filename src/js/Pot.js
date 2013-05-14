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

Pot.prototype.addPotContent = function(ingredient) {
	if(ingredient instanceof Ingredient) {
		this.potContent.push(ingredient);
	}
};

Pot.prototype.getPotContent = function() {
	return this.potContent;
};

Pot.prototype.setTemperature = function(temperature) {
	this.temperature = temperature;
};

Pot.prototype.setGoalTemperature = function(temperature) {
	this.goalTemperature = temperature;
};

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

Pot.prototype.getStatus = function() {
	if(this.temperature == this.DEFAULTTEMPERATURE) {
		return "";
	} else if(this.temperature == this.goalTemperature) {
		return "Static";
	} else {
		return "Changing";
	}
};
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

Pot.prototype.updateTemperatures = function() {
	this.updateTemperature();
	for(var i = 0; i < this.potContent.length; i++) {
		this.potContent[i].updateTemperature(this.temperature);
	}
	if(this.temperature != this.DEFAULTTEMPERATURE) {
		this.logTemperature();
	}
};

Pot.prototype.logTemperature = function() {
	if(this.logCounter == 90) {
		this.logCounter = 0;
		console.log(this.name + ": " + this.temperature);
	} else {
		this.logCounter++;
	}
};

Pot.prototype.setPlate = function(plate) {
	this.plate = plate
};
