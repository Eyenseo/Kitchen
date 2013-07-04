function Container(stage, data, restrainer) {
	PhysicalThing.call(this, stage, data, restrainer);

	//container Attributes
	this.content = [];
}
Container.prototype = Object.create(PhysicalThing.prototype);
Container.prototype.constructor = Container;

Container.prototype.PHY_updateTemperature = Container.prototype.updateTemperature;
Container.prototype.updateTemperature = function(temperature) {
	var THIS = this;
	this.PHY_updateTemperature(temperature);
	this.content.forEach(function(object) {
		object.updateTemperature(THIS.temperature);
	});
};

Container.prototype.dragEndAction = function(kitchen) {
	var THIS = this;
	var bottomObject = this.getBottomCenter();
	var bottom = bottomObject.cy - this.height / 8 - 10; // -10 for the glow
	var left = bottomObject.cx - this.width / 8 - 10;
	var right = bottomObject.cx + this.width / 8 - 10;
	var objectsUnder = [];

	kitchen.allObjects.forEach(function(object) {
		if((object instanceof Plate || object instanceof Sink || object instanceof Container ||
		    object instanceof Cupboard) && object !== THIS) {
			var zone = object.getHitZone();
			if(right >= zone.hx && bottom >= zone.hy && left <= zone.hx + zone.hw && bottom <= zone.hy + zone.hh) {
				objectsUnder.push(object);
			}
		}
	});

	objectsUnder.forEach(function(object) {
		if(object instanceof Oven || object instanceof Cupboard) {
			//			console.log("Container: check Oven and Cupboard");//DEBUG
			if(object.open ||
			   (!object.open && !THIS.stage._checkTransparency({ x: bottomObject.cx, y: bottomObject.cy }, object))) {
				THIS.linkObjects(object);
			}
		} else {
			THIS.linkObjects(object);
		}
	});
};

Container.prototype.PHY_linkObjects = Container.prototype.linkObjects;
Container.prototype.linkObjects = function(object) {
	var THIS = this;
	//	console.log("Container");//DEBUG
	this.PHY_linkObjects(object);

	if(object instanceof Container) {

		this.content.forEach(function(content) {
			if(THIS.restrainer.checkPutRequest(object, content, true)) {
				//console.log("Container: Put " + content.name + " in: " + object.name);//DEBUG
				object.addContent(content);
				THIS.removeContent(content);
				THIS.temperature = THIS.DEFAULTTEMP;
			}
		});
	}
	this.selectAnimation(true);
};

Container.prototype.addLinkedObject = function(object) {
	//console.log("Container: Link " + this.name + " with: " + object.name);//DEBUG

	if(object instanceof Ingredient && this.restrainer.checkPutRequest(this, object)) {
		this.addContent(object);
		//console.log("Container: Add: " + object.name);//DEBUG
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
		//		this.selectAnimation(false);
	}
	this.selectAnimation(true);
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