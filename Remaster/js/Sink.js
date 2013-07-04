/**
 * This object is used to create water really,it doesn't have any pipes!
 * It's a child of PhysicalThing
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @param kitchen - the kitchen
 * @param waterData - water data object to create a water Ingredient
 * @constructor
 */
function Sink(stage, data, restrainer, kitchen, waterData) {
	PhysicalThing.call(this, stage, data, restrainer);

	this.puring = false;
	this.changeAnimation("closed");
	this.currentAniIndex = this.currentAnimation.length - 1;
	this.waterData = waterData;
	this.kitchen = kitchen;
	this.soundManager = kitchen.soundManager;
	this.water = new Ingredient(stage, this.waterData, restrainer, this.soundManager);
}

Sink.prototype = Object.create(PhysicalThing.prototype);
Sink.prototype.constructor = Sink;

/**
 * the function is called to update the image/animation to be displayed
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
Sink.prototype.selectAnimation = function(keepIndex) {
	var anim = "";

	if(this.puring) {
		anim = "puring";
		if(this.currentAnimationName != "puring" && this.currentAnimationName != "puringHover") {
			keepIndex = false;
		}
	} else {
		if(this.currentAnimationName != "closed" && this.currentAnimationName != "closedHover") {
			keepIndex = false;
		}
		anim = "closed";
	}

	if(this.hover) {
		anim += "Hover";
	}

	this.changeAnimation(anim, keepIndex);
};

/**
 * the function will add the object to the linkedObjects array and if the object is appropriated it will be added to the content
 * @param object object to be added
 */
Sink.prototype.addLinkedObject = function(object) {
	if(this.puring && object instanceof Container && this.restrainer.checkPutRequest(object, this.water, true)) {
		object.addContent(this.kitchen.makeObject(this.waterData, false));
	}
	this.linkedObjects.push(object);
};

/**
 * the function will switch the state of the tap and will play/stop the puring sound
 * the function will update the image/animation
 * @param kitchen - the kitchen
 */
Sink.prototype.clickAction = function(kitchen) {
	var THIS = this;
	this.puring = !this.puring;

	this.selectAnimation(false);
	if(this.puring) {
		this.linkedObjects.forEach(function(object) {
			object.addContent(kitchen.makeObject(THIS.waterData, false));
		});
		this.soundManager.playLoop(this.soundManager.WATER);
	} else {
		this.soundManager.stopLoop(this.soundManager.WATER);
	}
};
