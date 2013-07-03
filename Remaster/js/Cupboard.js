function Cupboard(stage, data, restrainer) {
	PhysicalThing.call(this, stage, data, restrainer);
	this.open = false;
}

Cupboard.prototype = Object.create(PhysicalThing.prototype);
Cupboard.prototype.constructor = Cupboard;

Cupboard.prototype.selectAnimation = function(keepIndex) {
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

Cupboard.prototype.clickAction = function(kitchen) {
	this.open = !this.open;
	this.selectAnimation(false);
};

Cupboard.prototype.addLinkedObject = function(object) {
	console.log("Cupboard: Link " + this.name + " with: " + object.name);

	this.open = true;
	this.selectAnimation(false);
	this.linkedObjects.push(object);
};
