function Pot(context, sx, sy, w, h, imgPath, zOrder, draggable, name) {
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);
	this.setDraggable(draggable);
	this.name = name;
	
	this.potContent = [];
	this.setHitZone(35,8,205,42);
}

Pot.prototype = new VisualRenderObject();
Pot.prototype.constructor = Pot;

Pot.prototype.addPotContent = function(ingredient){
	if(ingredient instanceof Ingredient) {
		this.potContent.push(ingredient);
	}
};

Pot.prototype.getPotContent = function(){
	return this.potContent;
};
