/**
 * This object is used for all ingredient objects
 * It's a child of PhysicalThing
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @param soundManager - soundManager
 * @constructor
 */
function Ingredient(stage, data, restrainer, soundManager) {
	PhysicalThing.call(this, stage, data, restrainer);
	this.name = data.name;
	this.tiny = data.tiny;
	this.soundManager = soundManager;

	this.COOKEDTEMP = 100;
	this.cooked = false;
	this.cut = false;
}

Ingredient.prototype = Object.create(PhysicalThing.prototype);
Ingredient.prototype.constructor = Ingredient;

/**
 * the function is the function of the parent object
 * @type {Function}
 */
Ingredient.prototype.Phy_updateTemperatures = Ingredient.prototype.updateTemperature;
/**
 * the function is the overridden function of the parent
 * the function will update the temperature according to the temperature parameter
 * the function will set the cooked state to true if the temperature was once over 100
 * @param temperature NUMBER - temperature of the object that calls the function
 */
Ingredient.prototype.updateTemperature = function(temperature) {
	this.Phy_updateTemperatures(temperature);

	if(!this.cooked && this.temperature >= this.COOKEDTEMP) {
		//		console.log(this.name + " is cooked");//DEBUG
		this.setCooked(true);
	}
};

/**
 * the function is called by the kitchen upon a drag end event
 * the function checks for which objects the linkObjects function shall be called
 * @param kitchen - the kitchen
 */
Ingredient.prototype.dragEndAction = function(kitchen) {
	var THIS = this;
	var bottomObject = this.getBottomCenter();
	var bottom = bottomObject.cy - 10;                  // -10 for the glow
	var left = bottomObject.cx - this.width / 4;        // /4 for 'smaller' hitzone
	var right = bottomObject.cx + this.width / 4;       // /4 for 'smaller' hitzone
	var objectsUnder = [];

	kitchen.allObjects.forEach(function(object) {       //for all available objects
		if(object instanceof PhysicalThing && !(object instanceof Knife) && !(object instanceof Ingredient) &&
		   object !== THIS) {                           //only thous and not this
			var zone = object.getHitZone();
			if(right >= zone.hx && bottom >= zone.hy && left <= zone.hx + zone.hw && bottom <= zone.hy + zone.hh) {
				objectsUnder.push(object);
			}
		}
	});

	objectsUnder.forEach(function(object) {             // for all objects under this
		if(object instanceof Oven || object instanceof Cupboard) {
			if(object.open ||
			   (!object.open && !THIS.stage._checkTransparency({ x: bottomObject.cx, y: bottomObject.cy }, object))) { // special case for Oven and Cupboard to prevent putting this in them when they're closed
				THIS.linkObjects(object);
			}
		} else {
			THIS.linkObjects(object);
		}
	});
};

/**
 * the function is the overridden function of the parent
 * the function will check if this and the object will connect and if it will remove itself from the stage and play a drop sound if the object is a Container
 * the function will update the image/animation
 *  @param object PhysicalThing - object to connect with
 */
Ingredient.prototype.linkObjects = function(object) {
	if(object instanceof CuttingBoard && this.cut ||
	   object instanceof Container && this.restrainer.checkPutRequest(object, this) || object instanceof Cupboard ||
	   object instanceof Oven) {
		this.addLinkedObject(object);
		object.addLinkedObject(this);

		if(object instanceof Container && !(object instanceof CuttingBoard)) {
			this.safeRemoveFromStage();
			this.soundManager.play(this.soundManager.DROP);
		}
	}
};

/**
 * the function is the overridden function of the parent
 * @param object - object to be added
 */
Ingredient.prototype.addLinkedObject = function(object) {
	//	console.log("Ingredient: Link " + this.name + " with: " + object.name);//DEBUG

	this.linkedObjects.push(object);
};

/**
 * the function is called to update the image/animation to be displayed
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
Ingredient.prototype.selectAnimation = function(keepIndex) {
	var anim = "";

	if(this.cut) {
		anim = "cut";
	} else {
		anim = "default";
	}

	if(this.hover) {
		anim += "Hover";
	}

	this.changeAnimation(anim, keepIndex);
};

/**
 * the function will set the cut state accordingly to cut
 * the function will update the image/animation
 * @param cut BOOLEAN - state of cut
 */
Ingredient.prototype.setCut = function(cut) {
	this.cut = cut;
	this.selectAnimation(false);
};

/**
 * the function will set the cut state accordingly to cut
 * the function will update the image/animation
 * @param cooked BOOLEAN - state of cooked
 */
Ingredient.prototype.setCooked = function(cooked) {
	this.cooked = cooked;
	this.selectAnimation(false);
};
