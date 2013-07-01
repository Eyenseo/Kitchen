function Container(context, data, restrainer) {
	PhysicalThing.call(this, context, data, restrainer);

	//container Attributes
	this.content = [];
}
Container.prototype = Object.create(PhysicalThing.prototype);
Container.prototype.constructor = Container;

Container.prototype.addContent = function(object) {
	//TODO  this.restrainer.checkPutRequest(this, object)) {
	if(object instanceof Ingredient) {
		this.content.push(object);
		this.selectAnimation(false);
	}
};

Container.prototype.PHY_addLinkedObject = Container.prototype.addLinkedObject;
Container.prototype.addLinkedObject = function(object) {
	if(object instanceof  Ingredient && this.PHY_addLinkedObject(object)) {
		this.addContent(object);
		console.log("Add: " + object.name);
		return true;
	} else {
		return this.PHY_addLinkedObject(object);
	}
};

Container.prototype.dragEndAction = function(kitchen) {
	var bottomObject = this.getBottomCenter();
	var bottom = bottomObject.cy - 10; //for the glow
	var left = bottomObject.cx - this.width / 4;
	var right = bottomObject.cx + this.width / 4;
	var objectsUnder = [];

	kitchen.allObjects.forEach(function(object) {
		if(object instanceof Plate || object instanceof Sink) {
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

Container.prototype.PHY_removeLinkedObject = Container.prototype.removeLinkedObject;
Container.prototype.removeLinkedObject = function(object) {
	this.PHY_removeLinkedObject(object);

	var array = [];

	this.content.forEach(function(linkedObject) {
		if(object !== linkedObject) {
			array.push(linkedObject);
		}
	});

	this.content = array;
};

Container.prototype.removeContent = function(object) {
	var array = [];

	for(var i = 0; i < this.content.length; i++) {
		if(this.content[i] !== object) {
			array.push(this.content[i]);
		}
	}
	this.selectAnimation(true);

	this.content = array;
};

Container.prototype.emptyContent = function() {
	var content = this.content;
	this.content = [];
	this.selectAnimation(true);

	return content;
};

Container.prototype.selectAnimation = function(keepIndex) {
	var anim = "";

	if(this.content.length == 0) {
		anim = "default";
		if(this.currentAnimationName !== "default" && this.currentAnimationName !== "defaultHover") {
			keepIndex = false;
		}
	} else {
		anim = "full";
	}

	if(this.hover) {
		anim += "Hover";
	}

	this.changeAnimation(anim, keepIndex);
};