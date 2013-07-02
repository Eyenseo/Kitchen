function Ingredient(context, data, restrainer) {
	PhysicalThing.call(this, context, data, restrainer);
	this.name = data.name;
	this.tiny = data.tiny;

	this.COOKEDTEMP = 100;
	this.cooked = false;
	this.cut = false;
}

Ingredient.prototype = Object.create(PhysicalThing.prototype);
Ingredient.prototype.constructor = Ingredient;

Ingredient.prototype.Phy_updateTemperatures = Ingredient.prototype.updateTemperature;

Ingredient.prototype.updateTemperature = function(temperature) {
	this.Phy_updateTemperatures(temperature);

	if(!this.cooked && this.temperature >= this.COOKEDTEMP) {
		console.log(this.name + " is cooked");
		this.setCooked(true);
	}
};

Ingredient.prototype.dragEndAction = function(kitchen) {
	var THIS = this;
	var bottomObject = this.getBottomCenter();
	var bottom = bottomObject.cy - 10; //for the glow
	var left = bottomObject.cx - this.width / 4;
	var right = bottomObject.cx + this.width / 4;
	var objectsUnder = [];

	kitchen.allObjects.forEach(function(object) {
		if(object instanceof PhysicalThing && !(object instanceof Knife) && !(object instanceof Ingredient) &&
		   object !== THIS) {
			var zone = object.getHitZone();
			if(right >= zone.hx && bottom >= zone.hy && left <= zone.hx + zone.hw && bottom <= zone.hy + zone.hh) {
				objectsUnder.push(object);
			}
		}
	});

	var highestZOrder = {"zOrder": 0};
	objectsUnder.forEach(function(object) {
		if(highestZOrder.zOrder < object.zOrder) {
			highestZOrder = object;
		}
	});

	this.linkObjects(highestZOrder, kitchen);
};

Ingredient.prototype.linkObjects = function(object, kitchen) {
	if(object instanceof CuttingBoard && this.cut ||
	   object instanceof Container && this.restrainer.checkPutRequest(object, this)) {
		this.addLinkedObject(object);
		object.addLinkedObject(this);

		if(object instanceof Container && !(object instanceof CuttingBoard)) {
			kitchen.stage.removeFromStage(this);
			kitchen.soundManager.play(kitchen.soundManager.DROP);
		}
	}
};

Ingredient.prototype.addLinkedObject = function(object) {
	console.log("Ingredient: Put " + this.name + " on: " + object.name);

	this.linkedObjects.push(object);
};

Ingredient.prototype.selectAnimation = function(keepIndex) {
	var anim = "";

	if(this.cut) {
		anim = "cut";
	} else {
		anim = "default";
	}

	if(this.hover) {
		anim += "Hover";
	}

	this.changeAnimation(anim, keepIndex);
};

Ingredient.prototype.setCut = function(cut) {
	this.cut = cut;
	this.selectAnimation(false);
};

Ingredient.prototype.setCooked = function(cooked) {
	this.cooked = cooked;
	this.selectAnimation(false);
};
