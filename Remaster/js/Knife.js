/**
 * This object is used to cut Ingredients that are in the content array of a Container
 * It's a child of PhysicalThing
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @param soundManager - soundManager
 * @constructor
 */
function Knife(stage, data, restrainer, soundManager) {
	PhysicalThing.call(this, stage, data, restrainer);
	this.soundManager = soundManager;
	this.cutting = false;
	this.cuttingTime = 0;
}

Knife.prototype = Object.create(PhysicalThing.prototype);
Knife.prototype.constructor = Knife;

/**
 * the function is called by the kitchen upon a drag end event
 * the function checks for which objects the linkObjects function shall be called and if there are any Ingredients that are not jet cut are the content of a CuttingBoard
 * the function will update the image/animation
 * the function will play a sound it cuts
 * @param kitchen - the kitchen
 */
Knife.prototype.dragEndAction = function(kitchen) {
	var THIS = this;
	var centerObject = this.getCenter();
	var bottom = centerObject.cy - 10;                                      // -10 for the glow
	var left = centerObject.cx - this.width / 4;                            // /4 for 'smaller' hitzone
	var right = centerObject.cx + this.width / 4;                           // /4 for 'smaller' hitzone
	var objectsUnder = [];

	kitchen.allObjects.forEach(function(object) {                           //for all available objects
		if(object instanceof CuttingBoard || object instanceof Cupboard) {  //only thous and not this
			var zone = object.getHitZone();
			if(right >= zone.hx && bottom >= zone.hy && left <= zone.hx + zone.hw && bottom <= zone.hy + zone.hh) {
				objectsUnder.push(object);
			}
		}
	});

	objectsUnder.forEach(function(object) {                                 // for all objects under this
		if(object instanceof Oven || object instanceof Cupboard) {
			//			console.log("Knife: check Oven and Cupboard");//DEBUG
			if(object.open ||
			   (!object.open && !THIS.stage._checkTransparency({ x: centerObject.cx, y: centerObject.cy }, object))) {
				THIS.linkObjects(object);
			}
		} else {
			THIS.linkObjects(object);
		}
	});

	this.linkedObjects.forEach(function(object) {                           // for all linked objects
		if(object instanceof CuttingBoard && object.content.length !== 0) {
			object.content.forEach(function(content) {
				if(!content.cut) {                                          // if one object is not jet cut
					THIS.cutting = true;
				}
			});
			THIS.selectAnimation(false);
		}
	});

	if(this.cutting) {
		this.soundManager.playLoop(this.soundManager.CUT);
	}
};

/**
 * the function is called to update the image/animation to be displayed
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
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

/**
 * the function is the overridden function of the parent
 * the function will check if this and the object will connect
 *  @param object PhysicalThing - object to connect with
 */
Knife.prototype.linkObjects = function(object) {
	if(object instanceof CuttingBoard || object instanceof Cupboard || object instanceof Oven) {
		object.addLinkedObject(this);
		this.addLinkedObject(object);
	}
};

/**
 * the function is the function of the parent object
 * @type {Function}
 */
Knife.prototype.PHY_action = Knife.prototype.action;
/**
 * the function will call its parent and if cutting is true it will count up until time limit, and cut all ingredients
 * the function will update the image/animation
 * the function will stop a sound it cuts
 * @param kitchen - the kitchen
 */
Knife.prototype.action = function(kitchen) {
	this.PHY_action(kitchen);

	if(this.cutting) {
		if(this.cuttingTime > this.actionValue) {
			this.linkedObjects.forEach(function(object) {
				if(object instanceof CuttingBoard) {
					object.content.forEach(function(ingredient) {
						ingredient.setCut(true);
					});
				}
			});
			this.cuttingTime = 0;
			this.cutting = false;
			this.soundManager.stopLoop(this.soundManager.CUT);
			this.selectAnimation(false);
		} else {
			this.cuttingTime++;
		}
	}
};