/**
 * This object is a child of PhysicalThing and is intended to be used as a door / to hide things
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @param soundManager - soundManager
 * @constructor
 */
function Cupboard(stage, data, restrainer, soundManager) {
	PhysicalThing.call(this, stage, data, restrainer);
	this.open = false;
	this.soundManager = soundManager;
}

Cupboard.prototype = Object.create(PhysicalThing.prototype);
Cupboard.prototype.constructor = Cupboard;

/**
 * the function is called to update the image/animation to be displayed
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
Cupboard.prototype.selectAnimation = function(keepIndex) {
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
Cupboard.prototype.clickAction = function(kitchen) {
	this.open = !this.open;

	if(this.open) {
		this.soundManager.play(this.soundManager.OPENDOOR);
	} else {
		this.soundManager.play(this.soundManager.CLOSEDOOR);
	}

	this.selectAnimation(false);
};

/**
 * the function will add the object to the linkedObjects array
 * the function will set the open state to true
 * the function will update the image/animation
 * @param object
 */
Cupboard.prototype.addLinkedObject = function(object) {
	//	console.log("Cupboard: Link " + this.name + " with: " + object.name);//DEBUG

	this.open = true;
	this.selectAnimation(false);
	this.linkedObjects.push(object);
};
