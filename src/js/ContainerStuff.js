//TODO Doc
function ContainerStuff(context, data) {
	KitchenStuff.call(this, context, data);
	this.content = [];
	this.empty = true;
}

ContainerStuff.prototype = Object.create(KitchenStuff.prototype);
ContainerStuff.prototype.constructor = ContainerStuff;

/**
 * @param object Ingredient object to be added to the content array
 */
ContainerStuff.prototype.addContent = function(object) {
	if(object instanceof Ingredient) {
		this.content.push(object);
		if(this.empty) {
			this.empty = false;
			this.selectAnimation();
		}
	}
};

/**
 * @returns {Array} Ingredient - the return value is an array filled with all ContainerStuff that are in the pot
 */
ContainerStuff.prototype.getContent = function() {
	return this.content;
};

//TODO DOC
ContainerStuff.prototype.removeContent = function(object) {
	var array = [];
	for(var i = 0; i < this.content.length; i++) {
		if(this.content[i] !== object) {
			array.push(this.content[i]);
		}
	}
	if(array.length === 0) {
		this.empty = true;
		this.selectAnimation();
	}
	this.content = array;
};

/**
 *
 * @returns {Array} Ingredient - the return value is an empty array
 */
ContainerStuff.prototype.popContent = function() {
	var content = this.content;
	this.content = [];
	this.empty = true;
	this.selectAnimation();
	return content;
};

