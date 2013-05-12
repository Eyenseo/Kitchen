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

Ingredient.prototype = new VisualRenderObject();
Ingredient.prototype.constructor = Ingredient;

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
	this.logTemperature();
};

Ingredient.prototype.logTemperature = function() {
	if(this.logCounter == 120) {
		this.logCounter = 0;
		console.log(this.temperature);
	} else {
		this.logCounter++;
	}
};