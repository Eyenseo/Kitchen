/**
 * Function for the cutting board. Methods like changing the state of ingredients are set.
 * @param context context object - the 2d context of the canvas
 * @constructor cutting board is from the VisualRenderObject
 */
	//TODO Doc
function CuttingBoard(context, data) {
	ContainerStuff.call(this, context, data);
}

CuttingBoard.prototype = Object.create(ContainerStuff.prototype);
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
