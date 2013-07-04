/**
 * This object is used for objects that will be cooled down
 * It's a child of Oven
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @param soundManager - soundManager
 * @constructor
 */
function Fridge(stage, data, restrainer, soundManager) {
	Oven.call(this, stage, data, restrainer, soundManager);
	this.temperature = 8;
}

Fridge.prototype = Object.create(Oven.prototype);
Fridge.prototype.constructor = Fridge;

/**
 * the function is called to update the image/animation to be displayed
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
Fridge.prototype.selectAnimation = function(keepIndex) {
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

/**
 * the function is called by the kitchen upon a click event
 * the function will play a sound for opening and closing
 * the function will update the image/animation
 * @param kitchen - the kitchen
 */
Fridge.prototype.clickAction = function(kitchen) {
	this.open = !this.open;

	if(this.open) {
		this.soundManager.play(this.soundManager.OPENDOOR);
	} else {
		this.soundManager.play(this.soundManager.CLOSEDOOR);
	}

	this.selectAnimation(false);
};

/**
 * the function is called by the kitchen at evey frame draw
 * the function will update the temperature of all linked Objects
 */
Fridge.prototype.action = function() {
	var THIS = this;
	if(this.linkedObjects.length > 0) {
		this.linkedObjects.forEach(function(object) {
			if(object instanceof PhysicalThing) {
				object.updateTemperature(THIS.temperature);
			}
		});
	}
};

/**
 * the function will add the object to the linkedObjects array
 * the function will set the open state to true
 * the function will update the image/animation
 * @param object
 */
Fridge.prototype.addLinkedObject = function(object) {
	//	console.log("Fridge: Link " + this.name + " with: " + object.name);//DEBUG

	this.open = true;
	this.selectAnimation(false);
	this.linkedObjects.push(object);
};
