function ContainerUtensil(context, data) {
	Utensil.call(this, context, data);
	this.content = [];
	this.empty = true;
}

ContainerUtensil.prototype = Object.create(Utensil.prototype);
ContainerUtensil.prototype.constructor = ContainerUtensil;

/**
 * @param ingredient Ingredient object to be added to the content array
 */
ContainerUtensil.prototype.addContent = function(ingredient) {
	if(ingredient instanceof Ingredient) {
		this.content.push(ingredient);
	}
	this.empty = false;
};

/**
 * @returns {Array} Ingredient - the return value is an array filled with all ContainerUtensil that are in the pot
 */
ContainerUtensil.prototype.getContent = function() {
	return this.content;
};

//TODO DOC
ContainerUtensil.prototype.removeContent = function(ingredient) {
	var array = []
	for(var i = 0; i < this.content.length; i++) {
		if(this.content[i] !== ingredient) {
			array.push(this.content[i]);
		}
	}
	if(array.length == 0) {
		this.empty = true;
	}
	this.content = array;
};

/**
 *
 * @returns {Array} Ingredient - the return value is an empty array
 */
ContainerUtensil.prototype.popContent = function() {
	var content = this.content;
	this.content = [];
	this.empty = true;
	return content;
}

