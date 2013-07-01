function Knife(context, data, restrainer) {
	PhysicalThing.call(this, context, data, restrainer);
	this.cutting = false;
	this.cuttingTime = 0;
}

Knife.prototype = Object.create(PhysicalThing.prototype);
Knife.prototype.constructor = Knife;

Knife.prototype.dragEndAction = function(kitchen) {
	var THIS = this;
	var bottomObject = this.getBottomCenter();
	var bottom = bottomObject.cy - 10; //for the glow
	var left = bottomObject.cx - this.width / 4;
	var right = bottomObject.cx + this.width / 4;
	var cuttingBoard = null;

	kitchen.allObjects.forEach(function(object) {
		if(object instanceof PhysicalThing && object.name === "cuttingBoard") {
			var zone = object.getHitZone();
			if(right >= zone.hx && bottom >= zone.hy && left <= zone.hx + zone.hw && bottom <= zone.hy + zone.hh) {
				cuttingBoard = object;
			}
		}
	});

	this.linkObjects(cuttingBoard, kitchen);

	console.log(this.linkedObjects);

	this.linkedObjects.forEach(function(object) {
		if(object.name === "cuttingBoard" && object.content.length !== 0) {
			THIS.cutting = true;
			THIS.selectAnimation(false);
		}
	});
};

Knife.prototype.selectAnimation = function(keepIndex) {
	var anim = "";

	if(this.cutting) {
		anim = "cut";
	} else {
		anim = "default";
		keepIndex = false;
	}
	if(this.hover) {
		anim += "Hover";
	}

	this.changeAnimation(anim, keepIndex);
};

Knife.prototype.PHY_action = Knife.prototype.action;
Knife.prototype.action = function(kitchen) {
	this.PHY_action(kitchen);

	if(this.cutting) {
		if(this.cuttingTime > this.actionValue) {
			this.linkedObjects.forEach(function(object) {
				if(object.name === "cuttingBoard") {
					object.content.forEach(function(ingredient) {
						ingredient.setCut(true);
					});
				}
			});
			this.cuttingTime = 0;
			this.cutting = false;
			this.selectAnimation();
		} else {
			this.cuttingTime++;
		}
	}
};