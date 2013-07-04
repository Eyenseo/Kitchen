/**
 * This object is a child of PhysicalThing and is intended for objects that will have a content.
 *
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @constructor
 */
function Container(stage, data, restrainer) {
	PhysicalThing.call(this, stage, data, restrainer);

	//container Attributes
	this.content = [];
}
Container.prototype = Object.create(PhysicalThing.prototype);
Container.prototype.constructor = Container;

/**
 * the function is the function of the parent object
 * @type {Function}
 */
Container.prototype.PHY_updateTemperature = Container.prototype.updateTemperature;
/**
 * the function is the overridden function of the parent
 * the function will update the temperature according to the temperature parameter and the objects in the content array
 * @param temperature NUMBER - temperature of the object that calls the function
 */
Container.prototype.updateTemperature = function(temperature) {
	var THIS = this;
	this.PHY_updateTemperature(temperature);
	this.content.forEach(function(object) {
		object.updateTemperature(THIS.temperature);
	});
};

/**
 * the function is called by the kitchen upon a drag end event
 * the function checks for which objects the linkObjects function shall be called
 * @param kitchen - the kitchen
 */
Container.prototype.dragEndAction = function(kitchen) {
	var THIS = this;
	var bottomObject = this.getBottomCenter();
	var bottom = bottomObject.cy - this.height / 8 - 10;            // -10 for the glow   /8 for height adjustment
	var left = bottomObject.cx - this.width / 8 - 10;               // -10 for the glow   /8 for 'smaller' hitzone
	var right = bottomObject.cx + this.width / 8 - 10;              // -10 for the glow   /8 for 'smaller' hitzone
	var objectsUnder = [];

	kitchen.allObjects.forEach(function(object) {                   //for all available objects
		if((object instanceof Plate || object instanceof Sink || object instanceof Container ||
		    object instanceof Cupboard) && object !== THIS) {       //only thous and not this
			var zone = object.getHitZone();
			if(right >= zone.hx && bottom >= zone.hy && left <= zone.hx + zone.hw && bottom <= zone.hy + zone.hh) {
				objectsUnder.push(object);
			}
		}
	});

	objectsUnder.forEach(function(object) {                         // for all objects under this
		if(object instanceof Oven || object instanceof Cupboard) {  // special case for Oven and Cupboard to prevent putting this in them when they're closed
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

/**
 * the function is the function of the parent object
 * @type {Function}
 */
Container.prototype.PHY_linkObjects = Container.prototype.linkObjects;
/**
 * the function is the overridden function of the parent
 * the function will check if this and the object will do more than just connect
 * if the object is a Container and the restrainer allows it, this content will be put into the objects
 * the function will update the image/animation
 *  @param object PhysicalThing - object to connect with
 */
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

/**
 * the function will add the object to the linkedObjects array and if the object is appropriated it will be added to the content
 * @param object object to be added
 */
Container.prototype.addLinkedObject = function(object) {
	//console.log("Container: Link " + this.name + " with: " + object.name);//DEBUG

	if(object instanceof Ingredient && this.restrainer.checkPutRequest(this, object)) {
		this.addContent(object);
		//console.log("Container: Add: " + object.name);//DEBUG
	}
	this.linkedObjects.push(object)
};

/**
 * the function is the function of the parent object
 * @type {Function}
 */
Container.prototype.PHY_removeLinkedObject = Container.prototype.removeLinkedObject;
/**
 * the function is the overridden function of the parent
 * the function will remove the object from linkedObjects array and from the content array
 * @param object - object to be removed
 */
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

/**
 * function to add a object to the content array - if the object is appropriated
 * the function will update the image/animation
 * @param object - object to be added
 */
Container.prototype.addContent = function(object) {
	if((object instanceof Ingredient || object instanceof  Container) &&
	   this.restrainer.checkPutRequest(this, object)) {
		this.content.push(object);
		//		this.selectAnimation(false);
	}
	this.selectAnimation(true);
};

/**
 * function to remove a object from the content array
 * the function will update the image/animation
 * @param object - object to be removed
 */
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

/**
 * the function is called to update the image/animation to be displayed
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
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