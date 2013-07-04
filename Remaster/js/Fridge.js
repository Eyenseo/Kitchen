function Fridge(stage, data, restrainer, soundManager) {
	Oven.call(this, stage, data, restrainer, soundManager);
	this.temperature = 8;
}

Fridge.prototype = Object.create(Oven.prototype);
Fridge.prototype.constructor = Fridge;

Fridge.prototype.selectAnimation = function(keepIndex) {
	var anim = "";

	if(this.open) {
		anim += "open";
	} else {
		anim += "closed";
	}

	if(this.hover) {
		anim += "Hover";
	}

	this.changeAnimation(anim, keepIndex);
};

Fridge.prototype.clickAction = function(kitchen) {
	this.open = !this.open;

	if(this.open) {
		this.soundManager.play(this.soundManager.OPENDOOR);
	} else {
		this.soundManager.play(this.soundManager.CLOSEDOOR);
	}

	this.selectAnimation(false);
};

Fridge.prototype.action = function() {
	var THIS = this;
	if(this.linkedObjects.length > 0) {
		this.linkedObjects.forEach(function(object) {
			if(object instanceof Ingredient) {
				object.updateTemperature(THIS.temperature);
			}
		});
	}
};

Fridge.prototype.addLinkedObject = function(object) {
	//	console.log("Fridge: Link " + this.name + " with: " + object.name);//DEBUG

	this.open = true;
	this.selectAnimation(false);
	this.linkedObjects.push(object);
};
