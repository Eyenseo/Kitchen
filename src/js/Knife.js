/**
 * Function for the utensil Knife which is an Object from VisualRenderAnimation.
 * @param context context object - the 2d context of the canvas
 * @param data
 * @constructor
 */
function Knife(context, data, cuttingBoard) {
	VisualRenderAnimation.call(this, context, data.sx, data.sy, data.w, data.h, data.picture, data.zOrder, data.aniObject);
	this.setDraggable(true);
	this.cuttingBoard = cuttingBoard;
}

Knife.prototype = Object.create(VisualRenderAnimation.prototype);
Knife.prototype.constructor = Knife;

/**
 * Function when the knife is dragged over the cutting board.
 * The cutting board now knows that every ingredient on it has to be cut (change images).
 */
Knife.prototype.dragEndAction = function(kitchen) {
	var THIS = this;

	var knifeCenterX = this.getBottomCenter().cx;
	var knifeCenterY = this.getBottomCenter().cy;

	var zone = this.cuttingBoard.getHitZone();

	if(knifeCenterX >= zone.hx && knifeCenterY >= zone.hy && knifeCenterX <= zone.hx && knifeCenterY <= zone.hy + zone.hh) {
		this.cuttingBoard.cutAll();
		//TODO add sound
		//kitchen.soundManager.play(kitchen.soundManager.KNIFEONTOCUTTINGBOARD);
	}

};