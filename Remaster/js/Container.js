function Container(context, data, restrainer) {
	PhysicalThing.call(this, context, data, restrainer);

	//container Attributes
	this.content = [];
}
Container.prototype = Object.create(PhysicalThing.prototype);
Container.prototype.constructor = Container;

Container.prototype.dragEndAction = function(kitchen) {
	var THIS = this;
	var bottomObject = this.getBottomCenter();
	var bottom = bottomObject.cy - this.height / 8 - 10; // -10 for the glow
	var left = bottomObject.cx - this.width / 4;
	var right = bottomObject.cx + this.width / 4;
	var objectsUnder = [];

	kitchen.allObjects.forEach(function(object) {
		if((object instanceof Plate || object instanceof Sink || object instanceof Container) && object !== THIS) {
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

Container.prototype.PHY_linkObjects = Container.prototype.linkObjects;
Container.prototype.linkObjects = function(object, kitchen) {
	var THIS = this;
	console.log("Container");
	this.PHY_linkObjects(object, kitchen);

	if(object instanceof Container) {

		this.content.forEach(function(content) {
			if(THIS.restrainer.checkPutRequest(object, content, true)) {
				console.log("Container: Put " + content.name + " in: " + object.name);
				object.addContent(content);
				THIS.removeContent(content);
			}
		});
	}
};

Container.prototype.addLinkedObject = function(object) {
	console.log("Container: Put " + this.name + " on: " + object.name);

	if(object instanceof Ingredient && this.restrainer.checkPutRequest(this, object)) {
		this.addContent(object);
		console.log("Container: Add: " + object.name);
	}
	this.linkedObjects.push(object)
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

Container.prototype.addContent = function(object) {
	if((object instanceof Ingredient || object instanceof  Container) &&
	   this.restrainer.checkPutRequest(this, object)) {
		this.content.push(object);
		this.selectAnimation(false);
	}
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