/**
 * Class for the Knife to know what it can do and how it does it.
 * @param stage Stageobject
 * @param data Data from the Jasonfile to load the image
 * @param restrainer Restrainerobject from the restrainer.js
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
 * Function to check where the knife is dragged. Then push it to the object over which it was dragged.
 * @param kitchen Kitchenobject
 */
Knife.prototype.dragEndAction = function(kitchen) {
	var THIS = this;
	var centerObject = this.getCenter();
	var bottom = centerObject.cy - 10; //for the glow
	var left = centerObject.cx - this.width / 4;
	var right = centerObject.cx + this.width / 4;
	var objectsUnder = [];

	kitchen.allObjects.forEach(function(object) {
		if(object instanceof CuttingBoard || object instanceof Cupboard) {
			var zone = object.getHitZone();
			if(right >= zone.hx && bottom >= zone.hy && left <= zone.hx + zone.hw && bottom <= zone.hy + zone.hh) {
				objectsUnder.push(object);
			}
		}
	});

	/**
	 * Function which checks if the pixels under the Knife which was dragged are transparent.
	 * If not and if it is a door, it should open.
	 */
	objectsUnder.forEach(function(object) {
		if(object instanceof Oven || object instanceof Cupboard) {
			console.log("Knife: check Oven and Cupboard");
			if(object.open ||
			   (!object.open && !THIS.stage._checkTransparency({ x: centerObject.cx, y: centerObject.cy }, object))) {
				THIS.linkObjects(object);
			}
		} else {
			THIS.linkObjects(object);
		}
	});

	/**
	 * If the knife was dragged over the cutting board and there lies something on it select the right animation for that thing.
	 */
	this.linkedObjects.forEach(function(object) {
		if(object instanceof CuttingBoard && object.content.length !== 0) {
			object.content.forEach(function(content) {
				if(!content.cut) {
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
 * Function to show the right animation of an ingredient which should be cut on the cutting board
 * @param keepIndex
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

Knife.prototype.linkObjects = function(object) {
	if(object instanceof CuttingBoard || object instanceof Cupboard || object instanceof Oven) {
		object.addLinkedObject(this);
		this.addLinkedObject(object);
	}
};

Knife.prototype.PHY_action = Knife.prototype.action;
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