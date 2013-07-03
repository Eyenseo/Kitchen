function Oven(stage, data, restrainer, soundManager) {
	Plate.call(this, stage, data, restrainer);
	this.soundManager = soundManager;
	this.open = false;
}

Oven.prototype = Object.create(Plate.prototype);
Oven.prototype.constructor = Oven;

Oven.prototype.selectAnimation = function(keepIndex) {
	var anim = "";

	switch(this.state) {
		case 0:
			anim = "default";
			break;
		case 1:
			anim += "low";
			break;
		case 2:
			anim += "medium";
			break;
		case 3:
			anim += "high";
	}

	if(this.open) {
		anim += "Open";
	} else {
		anim += "Closed";
	}

	if(this.hover) {
		anim += "Hover";
	}

	this.changeAnimation(anim, keepIndex);
};

Oven.prototype.clickAction = function(kitchen) {
	this.open = !this.open;
	this.selectAnimation(false);
};

Oven.prototype.action = function(kitchen) {
	var THIS = this;
	if(this.linkedObjects.length > 0) {
		this.linkedObjects.forEach(function(object) {
			if(object instanceof Container && object.name === "bakingTin") {
				if(THIS.state !== 0) {
					object.updateTemperature(80 * THIS.state);
				} else {
					object.updateTemperature(this.DEFAULTTEMP);
				}
			}
		});
	}
};

Oven.prototype.addLinkedObject = function(object) {
	console.log("Oven: Link " + this.name + " with: " + object.name);

	this.open = true;
	this.selectAnimation(false);
	this.linkedObjects.push(object);
};
