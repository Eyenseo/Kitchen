function Pot(context, sx, sy, w, h, imgPath, zOrder, draggable, name, heatRisingRate, soundManager) {
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);
	this.setDraggable(draggable);
	this.name = name;
	this.soundManager = soundManager;

	this.potContent = [];
	this.setHitZone(35, 8, 205, 42);

	this.HEATRISINGRATE = heatRisingRate;
	this.DEFAULTTEMPERATURE = 24;
	this.goalTemperature = this.DEFAULTTEMPERATURE;
	this.temperature = this.DEFAULTTEMPERATURE;

	this.HEATED = 0;
	this.HEATING = 1;
	this.COOLING = 2;
	this.COOL = 3;
	this.temperatureState = this.COOL;

	this.plate = null;

	this.logCounter = 0;
}

Pot.prototype = new VisualRenderObject();
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

//TODO think of better names for the functions updateTemerature/s
Pot.prototype.updateTemperature = function() {
	if(this.temperature != this.goalTemperature) {
		if(this.temperature < this.goalTemperature) {
			if(this.temperatureState == this.COOL) {
				this.soundManager.playLoop(this.soundManager.POTHEATINGUP);
			}
			this.temperature = this.temperature + this.goalTemperature * this.HEATRISINGRATE;
			this.temperatureState = this.HEATING;
			if(this.temperature >= this.goalTemperature) {
				this.temperature = this.goalTemperature;
				this.temperatureState = this.HEATED;
			}
		} else if(this.temperature > this.goalTemperature) {
			this.temperature = this.temperature - this.goalTemperature * this.HEATRISINGRATE;
			this.temperatureState = this.COOLING;
			if(this.temperature <= this.goalTemperature) {
				this.temperature = this.goalTemperature;
				this.temperatureState = this.COOL;
				this.soundManager.stopLoop(this.soundManager.POTHEATINGUP);
			}
		}
	}
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
	if(this.logCounter == 120) {
		this.logCounter = 0;
		console.log(this.name + ": " + this.temperature);
	} else {
		this.logCounter++;
	}
};

Pot.prototype.setPlate = function(plate) {
	this.plate = plate
};
