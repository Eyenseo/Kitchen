/**
 * Function for the cutting board. Methods like changing the state of ingredients are set.
 * @param context context object - the 2d context of the canvas
 * @constructor cutting board is from the VisualRenderObject
 */
function CuttingBoard(context, data) {
	VisualRenderAnimation.call(this, context, data.sx, data.sy, data.w, data.h, data.picture, data.zOrder, data.aniObject);
	this.setDraggable(false);
	this.name = data.name;

	//Array for the ingredients on the cutting board
	this.ingredients = [];
}

CuttingBoard.prototype = Object.create(VisualRenderAnimation.prototype);
CuttingBoard.prototype.constructor = CuttingBoard;

/**
 * Function to add an ingredient if it is dragged over the cutting board
 * @param ingredient ingredient which is dragged over the cutting board
 */
CuttingBoard.prototype.addIngredient = function(ingredient) {
	if(ingredient instanceof Ingredient) {
		this.ingredients.push(ingredient);
		ingredient.cuttingBoard = this;
	}
};

/**
 * Function to remove an ingredient from the array when it is removed from the cutting board.
 * @param ingredient Ingredient which has to be removed
 */
CuttingBoard.prototype.removeIngredient = function(ingredient) {
	if(ingredient instanceof Ingredient) {
		delete this.ingredients[ingredient];
		ingredient.cuttingBoard = null;
	}
};

/**
 * Function to change the picture and the state of an ingredient if the knife is moving over the cutting board.
 */
CuttingBoard.prototype.cutAll = function() {
	for(var i = 0; i < this.ingredients.length; i++) {
		Ingredient.changeState(this.ingredients[i]);
	}
};