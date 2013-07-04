/**
 * the Object handels the loading of the json files
 * @constructor
 */
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

/**
 * the function searches for a id in the loaded json files
 * @param id STRING - id of the object to be found
 * @returns {null} object that has the same id as the id parameter
 */
JSONHandler.prototype.objectById = function(id) {
	var object = null;

	this.kitchenStuff.forEach(function(jsonObject) {
		if(jsonObject.id === id) {
			object = jsonObject;
		}
	});
	if(object == null) {
		this.ingredients.forEach(function(jsonObject) {
			if(jsonObject.id === id) {
				object = jsonObject;
			}
		});
	}
	if(object == null) {
		throw "Object \"" + id + "\" was not found!";
	}
	return object;
};