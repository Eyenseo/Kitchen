//TODO DOC
function JSONHandler() {
	jsonHandler = this;
	this.recipes = 0;
	this.ingredients = 0;
	this.utensiles = 0;

	Ajax.getJSON("http://localhost/eyenseo/Kitchen/src/json/recipes.json", function(data) {
		jsonHandler.recipes = data;
	});
	Ajax.getJSON("http://localhost/eyenseo/Kitchen/src/json/ingredients.json", function(data) {
		jsonHandler.ingredients = data;
	});
	Ajax.getJSON("http://localhost/eyenseo/Kitchen/src/json/utensils.json", function(data) {
		jsonHandler.utensiles = data;
	});
}