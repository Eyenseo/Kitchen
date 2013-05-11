function Pot(context, sx, sy, w, h, imgPath, zOrder, draggable, name) {
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);
	this.setDraggable(draggable);
	this.name = name;
	
	this.potContent = [];
	this.setHitZone(35,8,205,42);

	this.DEFAULTTEMPERATURE = 24;
	this.temperature = this.DEFAULTTEMPERATURE;
	this.plate = null;
}

Pot.prototype = new VisualRenderObject();
Pot.prototype.constructor = Pot;

Pot.prototype.addPotContent = function(ingredient){
	if(ingredient instanceof Ingredient) {
		this.potContent.push(ingredient);
	}
};

Pot.prototype.getPotContent = function(){
	return this.potContent;
};

Pot.prototype.setTemperature = function(temperature) {
    this.temperature = temperature;
};

Pot.prototype.updateTemperatures = function() {
 	for(var i = 0; i < this.potContent.length; i++){
        this.potContent[i].updateTemperature(this.temperature);
 	}
};

Pot.prototype.setPlate = function (plate) {
	this.plate = plate
}
