//TODO DOC
function JSONHandler() {
	var jsonHandler = this;
	this.recipes = null;
	this.ingredients = null;
	this.kitchenStuff = null;

	Ajax.getJSON("json/recipes.json", function(data) {
		jsonHandler.recipes = data.recipes;
	});
	Ajax.getJSON("json/ingredients.json", function(data) {
		jsonHandler.ingredients = data.types;
	});
	Ajax.getJSON("json/kitchenStuff.json", function(data) {
		jsonHandler.kitchenStuff = data.types;
	});
}

JSONHandler.prototype.constructor = JSONHandler;

//TODO DOC
JSONHandler.prototype.objectByName = function(name) {
	var object = null;

	this.kitchenStuff.forEach(function(jsonObject) {
		if(jsonObject.name === name) {
			object = jsonObject;
		}
	});
	if(object == null) {
		this.ingredients.forEach(function(jsonObject) {
			if(jsonObject.name === name) {
				object = jsonObject;
			}
		});
	}
	if(object == null) {
		throw "Object \"" + name + "\" was not found!";
	}
	return object;
};