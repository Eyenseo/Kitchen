/**
 * This object is a Button that has only methods for the change of the image to be displayed upon hover
 * It is intended to be used as super object
 * @param context - context object - the 2d context of the canvas
 * @param data - Data object obtained from a JSON file
 * @constructor
 */
function Button(context, data) {
	VisualRenderAnimation.call(this, context, data);
	this.hover = false;
}

Button.prototype = Object.create(VisualRenderAnimation.prototype);
Button.prototype.constructor = Button;

/**
 * the function is called to update the image/animation to be displayed
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
Button.prototype.selectAnimation = function(keepIndex) {
	var anim = "default";

	if(this.hover) {
		anim += "Hover";
	}
	this.changeAnimation(anim, keepIndex);
};

/**
 * the function is called from the kitchen and sets the hover state and updates the image/animation
 * @param kitchen - the kitchen
 */
Button.prototype.mouseOverAction = function(kitchen) {
	this.hover = true;
	this.selectAnimation(true);
};

/**
 * the function is called from the kitchen and sets the hover state and updates the image/animation
 * @param kitchen - the kitchen
 */
Button.prototype.mouseOutAction = function(kitchen) {
	this.hover = false;
	this.selectAnimation(true);
};