function CuttingBoard(context, data, restrainer) {
	Container.call(this, context, data, restrainer);
}
CuttingBoard.prototype = Object.create(Container.prototype);
CuttingBoard.prototype.constructor = CuttingBoard;

CuttingBoard.prototype.addLinkedObject = function(object) {
	console.log("CuttingBoard: Put " + this.name + " on: " + object.name);

	if(object instanceof Ingredient && (object.cut || this.restrainer.checkPutRequest(this, object))) {
		this.addContent(object);
		console.log("Container: Add: " + object.name);
	}
	this.linkedObjects.push(object)
};