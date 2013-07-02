function Plate(context, data, restrainer) {
	PhysicalThing.call(this, context, data, restrainer);
	this.state = 0;
}

Plate.prototype = Object.create(PhysicalThing.prototype);
Plate.prototype.constructor = Plate;

Plate.prototype.setState = function(state) {
	this.state = state;
	this.selectAnimation(true);
};

//TODO Doc
Plate.prototype.selectAnimation = function(keepIndex) {
	var anim = "";

	switch(this.state) {
		case 0:
			anim = "default";
			if(this.currentAnimationName !== "default" && this.currentAnimationName !== "defaultHover") {
				keepIndex = false;
			}
			break;
		case 1:
			anim = "low";
			break;
		case 2:
			anim = "medium";
			break;
		case 3:
			anim = "high";
	}
	if(this.hover) {
		anim += "Hover";
	}

	this.changeAnimation(anim, keepIndex);
};

//Override is ok
Plate.prototype.action = function() {
	var THIS = this;
	if(this.linkedObjects.length > 0) {
		this.linkedObjects.forEach(function(object) {
			if(object instanceof CookContainer) {
				if(THIS.state !== 0) {
					object.updateTemperature(60 * THIS.state);
				} else {
					object.updateTemperature(this.DEFAULTTEMP);
				}
			}
		});
	}
};