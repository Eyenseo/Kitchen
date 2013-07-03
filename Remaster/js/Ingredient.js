function Ingredient(stage, data, restrainer, soundManager) {
	PhysicalThing.call(this, stage, data, restrainer);
	this.name = data.name;
	this.tiny = data.tiny;
	this.soundManager = soundManager;

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

	objectsUnder.forEach(function(object) {
		THIS.linkObjects(object);
	});
};

Ingredient.prototype.linkObjects = function(object) {
	if(object instanceof CuttingBoard && this.cut ||
	   object instanceof Container && this.restrainer.checkPutRequest(object, this) || object instanceof Cupboard) {
		this.addLinkedObject(object);
		object.addLinkedObject(this);

		if(object instanceof Container && !(object instanceof CuttingBoard)) {
			this.safeRemoveFromStage();
			this.soundManager.play(this.soundManager.DROP);
		}
	}
};

Ingredient.prototype.addLinkedObject = function(object) {
	console.log("Ingredient: Link " + this.name + " with: " + object.name);

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
