/**
 * The Background is the background of the kitchen.
 * It has collision boxes that other objects can use to detect weather they are inf ree fall or on an actual object
 * @param stage - the stage of the Kitchen
 * @constructor
 */
function Background(stage) {
	VisualRenderObject.call(this, stage.getContext(), 0, 0, 1024, 650, "images/background/kitchenBackground.png", 9);
	this.collisionBoxes = [];

	this.initialiseCollisionBoxes();
}

Background.prototype = Object.create(VisualRenderObject.prototype);
Background.prototype.constructor = Background;
/**
 * The function will create all need collision boxes needed for the background
 */
Background.prototype.initialiseCollisionBoxes = function() {
	// From top to bottom, left to right

	//Refrigerator
	//top
	this.addCollisionBox(41, 143, 201, 9);
	//layer one
	this.addCollisionBox(44, 226, 178, 64);
	//layer two
	this.addCollisionBox(42, 335, 180, 75);
	//layer three
	this.addCollisionBox(42, 419, 180, 89);
	//layer four
	this.addCollisionBox(50, 518, 169, 81);

	//board
	this.addCollisionBox(244, 194, 204, 49);

	//working space
	this.addCollisionBox(277, 313, 709, 94);

	//cupboard one
	//layer one
	this.addCollisionBox(235, 417, 176, 91);
	//layer two
	this.addCollisionBox(237, 518, 174, 86);

	//oven
	//layer one
	this.addCollisionBox(429, 483, 165, 60);
	//layer two
	this.addCollisionBox(429, 550, 165, 51);

	//cupboard two
	//layer one
	this.addCollisionBox(611, 416, 175, 91);
	//layer two
	this.addCollisionBox(613, 516, 174, 88);

	//floor
	this.addCollisionBox(0, 609, 1024, 100);
};

/**
 * the function will create a box object and will push the new object in the collisionBoxes array
 * @param x NUMBER - x-start position of the object
 * @param y NUMBER - y-start position of the object
 * @param w NUMBER - width of the object
 * @param h NUMBER - height of the object
 */
Background.prototype.addCollisionBox = function(x, y, w, h) {
	var box = {"x": x, "y": y, "w": w, "h": h};
	this.collisionBoxes.push(box);
};