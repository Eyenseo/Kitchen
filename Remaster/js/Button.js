function Button(context, data) {
	VisualRenderAnimation.call(this, context, data);
	this.hover = false;
}

Button.prototype = Object.create(VisualRenderAnimation.prototype);
Button.prototype.constructor = Button;

Button.prototype.selectAnimation = function(keepIndex) {
	var anim = "default";

	if(this.hover) {
		anim += "Hover";
	}
	this.changeAnimation(anim, keepIndex);
};

Button.prototype.mouseOverAction = function(kitchen) {
	this.hover = true;
	this.selectAnimation(true);
};

Button.prototype.mouseOutAction = function(kitchen) {
	this.hover = false;
	this.selectAnimation(true);
};