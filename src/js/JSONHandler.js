//TODO DOC
function JSONHandler() {
	var jsonHandler = this;
	this.recipes = 0;
	this.ingredients = 0;
	this.utensiles = 0;

	Ajax.getJSON("json/recipes.json", function(data) {
		jsonHandler.recipes = data;
	});
	Ajax.getJSON("json/ingredients.json", function(data) {
		jsonHandler.ingredients = data;
	});
	Ajax.getJSON("json/utensils.json", function(data) {
		jsonHandler.utensiles = data;
	});
}