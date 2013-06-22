/**
 * Function for the cutting board. Methods like changing the state of ingredients are set.
 * @param context context object - the 2d context of the canvas
 * @param sx x-coordinate where the picture is set
 * @param sy y-coordinate where the picture is set
 * @param zOrder level on which the cutting board lies
 * @param name
 * @constructor cutting board is from the VisualRenderObject
 */
function CuttingBoard(context) {
	VisualRenderAnimation.call(this, context, sx, sy, 158, 61, "images/utensils/cuttingBoard.png", 5);
	this.setDraggable(false);
	this.name = cuttingBoard;
	this.sx = 255;
	this.sy = 400;

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