/**
 * Function for the utensil Knife which is an Object from VisualRenderAnimation.
 * @param context context object - the 2d context of the canvas
 * @constructor
 */
function Knife(context, data) {
	Utensil.call(this, context, data);
	this.setDraggable(true);
	this.cutting = false;
	this.cyclus = 0;
}

Knife.prototype = Object.create(Utensil.prototype);
Knife.prototype.constructor = Knife;

/**
 * Function when the knife is dragged over the cutting board.
 * The cutting board now knows that every ingredient on it has to be cut (change images).
 */
Knife.prototype.dragEndAction = function(kitchen) {
	var knifeCenterX = this.getCenter().cx;
	var knifeCenterY = this.getCenter().cy;
	var zone;

	if(kitchen.cuttingBoard != null && kitchen.cuttingBoard != undefined) {
		zone = kitchen.cuttingBoard.getHitZone();
	}

	if(knifeCenterX >= zone.hx && knifeCenterY >= zone.hy && knifeCenterX <= zone.hx + zone.hw && knifeCenterY <= zone.hy + zone.hh) {
		this.cutting = true;
		this.selectAnimation();
		//TODO add sound
		//kitchen.soundManager.play(kitchen.soundManager.KNIFEONTOCUTTINGBOARD);
	}
};

/**
 * Function to make the utensil hover.
 */
Knife.prototype.mouseOverAction = function() {
	this.hover = true;
	this.selectAnimation();
};

//TODO DOC
Knife.prototype.selectAnimation = function() {
	if(this.hover) {
		if(this.cutting) {
			this.changeAnimation("cutHover", true);
		} else {
			this.changeAnimation("defaultHover");
		}
	} else {
		if(this.cutting) {
			this.changeAnimation("cut", true);
		} else {
			this.changeAnimation("default");
		}
	}
};

//TODO DOC
Knife.prototype.mouseOutAction = function() {
	this.hover = false;
	this.selectAnimation();
};
//TODO DOC
Knife.prototype.action = function(kitchen) {
	if(this.cyclus > 600) {
		kitchen.cuttingBoard.cutAll();
		this.cyclus = 0;
		this.cutting = false;
		this.selectAnimation();
	} else {
		this.cyclus++;
	}
};