/**
 * Function for the utensil Knife which is an Object from VisualRenderAnimation.
 * @param context context object - the 2d context of the canvas
 * @constructor
 */
function Knife(context, data) {
	VisualRenderAnimation.call(this, context, data.sx, data.sy, data.w, data.h, data.picture, data.zOrder, data.aniObject);
	this.setDraggable(true);
}

Knife.prototype = Object.create(VisualRenderAnimation.prototype);
Knife.prototype.constructor = Knife;

/**
 * Function when the knife is dragged over the cutting board.
 * The cutting board now knows that every ingredient on it has to be cut (change images).
 */
Knife.prototype.dragEndAction = function(kitchen) {
	var knifeCenterX = this.getBottomCenter().cx;
	var knifeCenterY = this.getBottomCenter().cy;

	if(kitchen.cuttingBoard != null && kitchen.cuttingBoard != undefined) {
		var zone = kitchen.cuttingBoard.getHitZone();
	}

	if(knifeCenterX >= zone.hx && knifeCenterY >= zone.hy && knifeCenterX <= zone.hx && knifeCenterY <= zone.hy + zone.hh) {
		kitchen.cuttingBoard.cutAll();
		//TODO add sound
		//kitchen.soundManager.play(kitchen.soundManager.KNIFEONTOCUTTINGBOARD);
	}
};