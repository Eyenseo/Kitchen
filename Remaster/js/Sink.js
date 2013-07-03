/**
 * Class for the sink and the tap.
 * @param stage Stageobject
 * @param data Data from the jsonfile
 * @param restrainer Restrainerobject
 * @param kitchen Kitchenobject
 * @param waterData Data to create water
 * @constructor
 */
function Sink(stage, data, restrainer, kitchen, waterData) {
	PhysicalThing.call(this, stage, data, restrainer);

	this.puring = false;
	this.changeAnimation("closed");
	this.currentAniIndex = this.currentAnimation.length - 1;
	this.waterData = waterData;
	this.kitchen = kitchen;
	this.water = new Ingredient(stage, this.waterData);
}

Sink.prototype = Object.create(PhysicalThing.prototype);
Sink.prototype.constructor = Sink;

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
 * Function to check which object is in the sink to put water into it if the water is puring and the object is able to get water.
 * @param object Object which is in the sink
 */
Sink.prototype.addLinkedObject = function(object) {
	if(this.puring && object instanceof Container && this.restrainer.checkPutRequest(object, this.water, true)) {
		object.addContent(this.kitchen.makeObject(this.waterData, false));
	}
	this.linkedObjects.push(object);
};

/**
 * Function to define that the water should stop or start to pur if the sink was clicked.
 * Every object in the sink is told that water is floating and may be get "into" the objects.
 * @param kitchen Kitchenobject
 */
Sink.prototype.clickAction = function(kitchen) {
	var THIS = this;
	this.puring = !this.puring;

	this.selectAnimation(false);
	if(this.puring) {
		this.linkedObjects.forEach(function(object) {
			object.addContent(kitchen.makeObject(THIS.waterData, false));
		});
	}
};
