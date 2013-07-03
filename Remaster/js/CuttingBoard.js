/**
 * Class which defines what a cutting board can do
 * @param stage Stageobject
 * @param data Data from the jasonfile which says where the image of the cutting board lies
 * @param restrainer Restrainerobject
 * @constructor
 */
function CuttingBoard(stage, data, restrainer) {
	Container.call(this, stage, data, restrainer);
}
CuttingBoard.prototype = Object.create(Container.prototype);
CuttingBoard.prototype.constructor = CuttingBoard;

CuttingBoard.prototype.addLinkedObject = function(object) {
	console.log("CuttingBoard: Link " + this.name + " with: " + object.name);

	if(object instanceof Ingredient && (object.cut || this.restrainer.checkPutRequest(this, object))) {
		this.addContent(object);
		console.log("Container: Add: " + object.name);
	}
	this.linkedObjects.push(object)
};

/**
 * Function to add an object to the cutting board.
 * If it is an ingredient or an object from the container.js it can be pushed into an array where the things which lie on the cutting board are saved.
 * @param object Object which was put on the cutting board
 */
CuttingBoard.prototype.addContent = function(object) {
	if((object instanceof Ingredient || object instanceof  Container) &&
	   this.restrainer.checkPutRequest(this, object)) {
		var center = this.getCenter();

		this.content.push(object);
		if(!object.onStage) {
			object.safeAddToStage();
			object.x = center.cx - object.width / 2;
			object.y = center.cy - object.height / 2;
		}
		this.selectAnimation(false);
	}
	this.selectAnimation(true);
};