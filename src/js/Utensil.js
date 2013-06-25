function Utensil(context, data) {
	VisualRenderAnimation.call(this, context, data.sx, data.sy, data.w, data.h, data.picture, data.zOrder, data.aniObject);

	this.setDraggable(true);
	this.name = data.name;
	this.hover = false;
}

Utensil.prototype = Object.create(VisualRenderAnimation.prototype);
Utensil.prototype.constructor = Utensil;

/**
 * Function to make the utensil hover.
 */
Utensil.prototype.mouseOverAction = function() {
	this.changeAnimation("defaultHover");
	this.hover = true;
};

Utensil.prototype.mouseOutAction = function() {
	this.changeAnimation("default");
	this.hover = false;
};