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