/**
 * This object is a child of PhysicalThing and is needed to cut Ingredient objects
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @constructor
 */
function CuttingBoard(stage, data, restrainer) {
	Container.call(this, stage, data, restrainer);
}
CuttingBoard.prototype = Object.create(Container.prototype);
CuttingBoard.prototype.constructor = CuttingBoard;

/**
 * the function will add the object to the linkedObjects array and if the object is appropriated it will be added to the content
 * @param object object to be added
 */
CuttingBoard.prototype.addLinkedObject = function(object) {
	//console.log("CuttingBoard: Link " + this.name + " with: " + object.name);//DEBUG

	if(object instanceof Ingredient && (object.cut || this.restrainer.checkPutRequest(this, object))) {
		this.addContent(object);
		//		console.log("Container: Add: " + object.name);//DEBUG
	}
	this.linkedObjects.push(object)
};

/**
 * the function will add the object to the linkedObjects array and if the object is appropriated it will be added to the content
 * the function will check if the object is on the Stage, if not it will be added and its location is in the center
 * @param object - object to be added
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