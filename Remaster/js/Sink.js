function Sink(context, data, restrainer, kitchen, waterData) {
	PhysicalThing.call(this, context, data, restrainer);

	this.puring = false;
	this.changeAnimation("closed");
	this.currentAniIndex = this.currentAnimation.length - 1;
	this.waterData = waterData;
	this.kitchen = kitchen;
}

Sink.prototype = Object.create(PhysicalThing.prototype);
Sink.prototype.constructor = Sink;

Sink.prototype.selectAnimation = function(keepIndex) {
	var anim = "";

	if(this.puring) {
		anim = "puring";
		if(this.currentAnimationName != "puring" && this.currentAnimationName != "puringHover") {
			keepIndex = false;
		}
	} else {
		if(this.currentAnimationName != "closed" && this.currentAnimationName != "closedHover") {
			keepIndex = false;
		}
		anim = "closed";
	}

	if(this.hover) {
		anim += "Hover";
	}

	this.changeAnimation(anim, keepIndex);
};
Sink.prototype.PHY_addLinkedObject = Sink.prototype.addLinkedObject;

Sink.prototype.addLinkedObject = function(object) {
	if(object instanceof Container && this.PHY_addLinkedObject(object)) {
		if(this.puring) {
			object.addContent(this.kitchen.makeObject(this.waterData, false));
		}
		return true;
	}
};

Sink.prototype.clickAction = function(kitchen) {
	var THIS = this;
	this.puring = !this.puring;

	this.selectAnimation(false);
	if(this.puring) {
		this.linkedObjects.forEach(function(object) {
			object.addContent(kitchen.makeObject(THIS.waterData, false));
		});
	}
};
