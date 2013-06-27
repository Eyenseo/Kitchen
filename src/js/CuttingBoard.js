/**
 * Function for the cutting board. Methods like changing the state of ingredients are set.
 * @param context context object - the 2d context of the canvas
 * @constructor cutting board is from the VisualRenderObject
 */
function CuttingBoard(context, data) {
	ContainerUtensil.call(this, context, data);
	this.setDraggable(false);
	this.name = data.name;
}

CuttingBoard.prototype = Object.create(ContainerUtensil.prototype);
CuttingBoard.prototype.constructor = CuttingBoard;

/**
 * Function to change the picture and the state of an ingredient if the knife is moving over the cutting board.
 * It checks every ingredient and changes the image.
 */
CuttingBoard.prototype.cutAll = function() {
	this.content.forEach(function(ingredient) {
		ingredient.changeState();
	});
};
