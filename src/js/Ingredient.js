function Ingredient(context, sx, sy, w, h, imgPath, zOrder, draggable, name) {
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);
	this.setDraggable(draggable);
	this.name = name;
}

Ingredient.prototype = new VisualRenderObject();
Ingredient.prototype.constructor = Ingredient;