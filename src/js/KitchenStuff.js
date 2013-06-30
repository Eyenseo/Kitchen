//TODO Doc
function KitchenStuff(context, data) {
	VisualRenderAnimation.call(this, context, data.sx, data.sy, data.w, data.h, data.picture, data.zOrder, data.aniObject);

	this.setDraggable(data.draggable);
	this.name = data.name;
	this.hover = false;
}

KitchenStuff.prototype = Object.create(VisualRenderAnimation.prototype);
KitchenStuff.prototype.constructor = KitchenStuff;

/**
 * Function to make the utensil hover.
 */
	//TODO Doc
KitchenStuff.prototype.mouseOverAction = function() {
	this.hover = true;
	this.selectAnimation(true);
};

//TODO Doc
KitchenStuff.prototype.mouseOutAction = function() {
	this.hover = false;
	this.selectAnimation(true);
};

//TODO Doc
KitchenStuff.prototype.selectAnimation = function(keepIndex) {
	var anim = "";

	if(this.empty) {
		anim = "default";
		if(this.currentAnimationName !== "default" && this.currentAnimationName !== "defaultHover") {
			keepIndex = false;
		}
	} else {
		anim = "full";
	}

	if(this.hover) {
		anim += "Hover";
	}

	this.changeAnimation(anim, keepIndex);
};