/**
 * This object is the parent of most other used objects, it implements the basic needed methods and attributes,
 * it also implements the hover effect, the change of the temperature, the gravity and the zOrder changing
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @constructor
 */
function PhysicalThing(stage, data, restrainer) {
	VisualRenderAnimation.call(this, stage.getContext(), data);

	//Various attributes
	this.name = data.name;
	this.type = data.type;
	this.restrainer = restrainer;
	this.linkedObjects = [];

	//zOrder and Dragging
	if(data.zOrder === true) {
		this.draggable = true;
		this.zOrder = this.y + this.height;
	} else {
		this.draggable = false;
		this.zOrder = data.zOrder;
	}
	this.falling = false;

	//Temperature attributes
	this.DEFAULTTEMP = 24;
	this.temperature = this.DEFAULTTEMP;
	this.actionValue = data.actionValue / 2;

	//AnimationS stuff
	this.hover = false;

	this.stage = stage;
	this.onStage = true;
}
PhysicalThing.prototype = Object.create(VisualRenderAnimation.prototype);
PhysicalThing.prototype.constructor = PhysicalThing;

/**
 * the function will update the temperature according to the temperature parameter
 * @param temperature NUMBER - temperature of the object that calls the function
 */
PhysicalThing.prototype.updateTemperature = function(temperature) {
	if(temperature === undefined) {
		temperature = this.DEFAULTTEMP;
	}

	if(this.temperature !== temperature) {
		if(this.temperature < temperature) {
			this.temperature = this.temperature + temperature * this.actionValue;
			if(this.temperature >= temperature) {
				this.temperature = temperature;
			}
		} else {
			this.temperature = this.temperature - temperature * this.actionValue * 4;
			if(this.temperature <= temperature) {
				this.temperature = temperature;
			}
		}
	}
};

/**
 * the function is called to update the image/animation to be displayed
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
PhysicalThing.prototype.selectAnimation = function(keepIndex) {
	var anim = "default";

	if(this.hover) {
		anim += "Hover";
	}
	this.changeAnimation(anim, keepIndex);
};

/**
 * the function is called from the kitchen and sets the hover state and updates the image/animation
 * @param kitchen - the kitchen
 */
PhysicalThing.prototype.mouseOverAction = function(kitchen) {
	this.hover = true;
	this.selectAnimation(true);
};

/**
 * the function is called from the kitchen and sets the hover state and updates the image/animation
 * @param kitchen - the kitchen
 */
PhysicalThing.prototype.mouseOutAction = function(kitchen) {
	this.hover = false;
	this.selectAnimation(true);
};

/**
 * the function will set the falling attribute to false, and increase the zOrder to max and remove itself from all linkedObjects and clear afterwards the array
 * @param kitchen - the kitchen
 */
PhysicalThing.prototype.mouseDownAction = function(kitchen) {
	if(this.draggable) {
		this.falling = false;
		this.zOrder = kitchen.maxIndex;
	}
	var THIS = this;
	this.linkedObjects.forEach(function(object) {
		object.removeLinkedObject(THIS);
	});
	this.linkedObjects = [];
};

/**
 * if the object is dragabel the method checks if the object is in free fall and adjusts based on that the zOrder
 * @param kitchen - the kitchen
 */
PhysicalThing.prototype.mouseUpAction = function(kitchen) {
	if(this.draggable) {
		this.checkFalling(kitchen);
		if(!this.falling) {
			this.zOrder = this.y + this.height;
		}
	}
};

/**
 * the function will move the object down as long as it is still falling
 * @param kitchen - the kitchen
 */
PhysicalThing.prototype.action = function(kitchen) {
	if(this.falling) {
		this.y += 2;
		this.checkFalling(kitchen);
	}

	var onPlate = false; // this could be moved to container ?
	this.linkedObjects.forEach(function(object) {
		if(!onPlate && object instanceof Plate) {
			onPlate = true;
		}
	});
	if(!onPlate) {
		this.updateTemperature(this.DEFAULTTEMP);
	}
};

/**
 * the function is called by the kitchen upon a drag end event
 * the function checks for which objects the linkObjects function shall be called
 * @param kitchen - the kitchen
 */
PhysicalThing.prototype.dragEndAction = function(kitchen) {
	var THIS = this;
	var bottomObject = this.getBottomCenter();
	var bottom = bottomObject.cy - 10;                              //- 10 for the glow
	var left = bottomObject.cx - this.width / 8 - 10;               // -10 for the glow   /8 for 'smaller' hitzone
	var right = bottomObject.cx + this.width / 8 - 10;              // -10 for the glow   /8 for 'smaller' hitzone
	var objectsUnder = [];

	kitchen.allObjects.forEach(function(object) {                   //for all available objects
		if(object instanceof PhysicalThing && !(object instanceof Knife) && object !== THIS) {  //only thous and not this
			var zone = object.getHitZone();
			if(right >= zone.hx && bottom >= zone.hy && left <= zone.hx + zone.hw && bottom <= zone.hy + zone.hh) {
				objectsUnder.push(object);
			}
		}
	});

	objectsUnder.forEach(function(object) {                         // for all objects under this
		if(object instanceof Oven || object instanceof Cupboard) {  // special case for Oven and Cupboard to prevent putting this in them when they're closed
			//			console.log("Physical: check Oven and Cupboard");//DEBUG
			if((!object.open && !THIS.stage._checkTransparency({ x: bottomObject.cx, y: bottomObject.cy }, object))) {
				THIS.linkObjects(object);
			}
		} else {
			THIS.linkObjects(object);
		}
	});
};

/**
 * the function will check if this and the object will connect
 * @param object PhysicalThing - object to connect with
 */
PhysicalThing.prototype.linkObjects = function(object) {
	if(object instanceof PhysicalThing) {
		//		console.log("Physical: Check Link from: " + this.name + " with: " + object.name);//DEBUG
		object.addLinkedObject(this);
		this.addLinkedObject(object);
	}
};

/**
 * the function will add the object to the linkedObjects array
 * @param object object to be added
 */
PhysicalThing.prototype.addLinkedObject = function(object) {
	//	console.log("Physical: Link " + this.name + " with: " + object.name);//DEBUG

	this.linkedObjects.push(object);
};

/**
 * the function will remove the object from linkedObjects array
 * @param object - object to be removed
 */
PhysicalThing.prototype.removeLinkedObject = function(object) {
	var array = [];

	this.linkedObjects.forEach(function(linkedObject) {
		if(object !== linkedObject) {
			array.push(linkedObject);
		} else {
		}
	});

	this.linkedObjects = array;
};

/**
 * the function will set the onStage attribute to true and adds this to the stage
 * the function is a replacement for the addToStage function of Stage since that one is unsafe and allows one object to be added multiple times
 * // since we have now the stage we will use it to check for transparency ... thx!
 */
PhysicalThing.prototype.safeAddToStage = function() {
	if(!this.onStage) {
		this.stage.addToStage(this);
		this.onStage = true;
	}
};

/**
 * the function is the counter to the safeAddToStage function and will set the onStage attribute to false and remove this from the stage
 */
PhysicalThing.prototype.safeRemoveFromStage = function() {
	if(this.onStage) {
		this.stage.removeFromStage(this);
		this.onStage = false;
	}
};

/**
 * the function checks if he object is inside a collision box of the background
 * // with a little bit variation for the looks
 * @param kitchen
 */
PhysicalThing.prototype.checkFalling = function(kitchen) {
	var THIS = this;
	var random = Math.random();
	var bottomObject = this.getBottomCenter();
	var bottom = bottomObject.cy - 10;              // -10 for the glow
	var left = bottomObject.cx - this.width / 2;
	var right = bottomObject.cx + this.width / 2;

	var variation;
	var falling = true;

	kitchen.collisionBoxes.forEach(function(box) {
		variation = random * (box.h - box.h / 3) + box.h / 3; // from box height/3 to box height - this improved the results, without a height min value the collision was to often at the beginning of the box

		if(!THIS.falling) {
			if(right >= box.x && bottom >= box.y && left <= box.x + box.w && bottom <= box.y + box.h) {
				falling = false;
			}
		} else {
			if(right >= box.x && bottom >= box.y + variation && left <= box.x + box.w && bottom <= box.y + box.h) {
				falling = false;
			}
		}
	});
	if(this.falling !== falling) {
		this.falling = falling;
		if(this.falling) {
			this.zOrder = kitchen.maxIndex - 1;
		} else {
			this.zOrder = this.y + this.height;
			this.dragEndAction(kitchen);
		}
		kitchen.stage.reorderRenderObjects();
	}

};
