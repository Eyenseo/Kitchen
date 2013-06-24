function RecipeHTML(jsonHandler, kitchen) {
	this.recipes = jsonHandler.recipes;
	this.kitchen = kitchen;
	this.allRecipes();
}

RecipeHTML.prototype.constructor = RecipeHTML;

RecipeHTML.prototype.allRecipes = function() {
	var THIS = this;
	var body = document.querySelector('body');

	var startUpDiv = document.createElement('div');
	startUpDiv.setAttribute('id', 'startUpDiv');
	body.appendChild(startUpDiv);

	var noteGroundDiv = document.createElement('div');
	noteGroundDiv.setAttribute('id', 'noteGroundDiv');
	startUpDiv.appendChild(noteGroundDiv);

	var scrollDiv = document.createElement("div");
	scrollDiv.setAttribute("id", "scrollDiv");
	noteGroundDiv.appendChild(scrollDiv);

	//menu
	var menuDiv = document.createElement('div');
	menuDiv.setAttribute('id', 'menuDiv');
	menuDiv.style.display = "none";
	scrollDiv.appendChild(menuDiv);

	var backImage = document.createElement('img');
	backImage.setAttribute('id', 'backImage');
	backImage.src = 'images/menu/back.png';
	backImage.addEventListener('click', function() {
		var detail = document.querySelector('#recipeDetails');
		detail.parentNode.removeChild(detail);
		document.querySelector('#menuDiv').style.display = 'none';
		document.querySelector('#allRecipesDiv').style.display = 'block';
	});
	menuDiv.appendChild(backImage);

	var startImage = document.createElement('img');
	startImage.setAttribute('id', 'startImage');
	startImage.src = 'images/menu/start.png';
	menuDiv.appendChild(startImage);

	//Recipe div
	var allRecipesDiv = document.createElement('div');
	allRecipesDiv.setAttribute('id', 'allRecipesDiv');
	scrollDiv.appendChild(allRecipesDiv);

	//header
	var header = document.createElement("h1");
	header.appendChild(document.createTextNode("Rezepte"));
	allRecipesDiv.appendChild(header);

	//List of Recipes
	var ul = document.createElement('ul');
	allRecipesDiv.appendChild(ul);

	for(var i = 0; i < this.recipes.length; i++) {
		var li = document.createElement('li');
		ul.appendChild(li);

		var oneRecipeDiv = document.createElement('div');
		oneRecipeDiv.setAttribute('class', 'oneRecipeDiv');
		// This is a closure
		// A closure, in JavaScript, can simply be described as a retained scope; at least, this is how I think of it. The benefit of a closure is in the fact that it retains the scope (the ?scope chain?) of the outer (or ?parent?) execution context. This behaviour can be used in a number of different ways and has become a useful remedy for quite a few JavaScript gotchas; one of the most common being the ?looping problem?.
		// ...
		// http://james.padolsey.com/javascript/closures-in-javascript/
		oneRecipeDiv.addEventListener("click", (function(n) {
			return function() {
				THIS.recipeDetail(n);
			};

		})(i));
		li.appendChild(oneRecipeDiv);

		var recipeImage = document.createElement('img');
		recipeImage.src = this.recipes[i].pictureFinish;
		oneRecipeDiv.appendChild(recipeImage);

		var recipeName = document.createElement('span');
		recipeName.innerHTML = this.recipes[i].name;
		oneRecipeDiv.appendChild(recipeName);

		var recipeDifficulty = document.createElement('img');
		recipeDifficulty.className = "recipeDifficulty";
		recipeDifficulty.src = "images/menu/stars/" + this.recipes[i].difficulty + ".png";
		oneRecipeDiv.appendChild(recipeDifficulty);

	}
};

/**
 * Function to display the selected recipe with more detail instead of the recipe list
 * @param index NUMBER - index of the selected recipe in the json file
 */
RecipeHTML.prototype.recipeDetail = function(index) {
	var THIS = this;
	document.querySelector('#menuDiv').style.display = 'block';
	document.querySelector('#allRecipesDiv').style.display = 'none';

	document.querySelector('#startImage').addEventListener('click', function() {
		document.querySelector('#startUpDiv').style.display = 'none';
		THIS.kitchen.prepareKitchen(THIS.recipes[index]);
	});

	var recipeDetails = document.createElement('div');
	recipeDetails.setAttribute('id', 'recipeDetails');
	document.querySelector("#scrollDiv").appendChild(recipeDetails);

	var h1 = document.createElement('h1');
	h1.appendChild(document.createTextNode(this.recipes[index].name));
	recipeDetails.appendChild(h1);

	var starImage = document.createElement('img');
	starImage.src = "images/menu/stars/" + this.recipes[index].difficulty + ".png";
	recipeDetails.appendChild(starImage);

	var ul = document.createElement('ul');
	recipeDetails.appendChild(ul);

	var p = document.createElement('p');
	recipeDetails.appendChild(p);

	this.recipes[index].ingredientsReadable.forEach(function(ingredient) {
		var li = document.createElement('li');
		ul.appendChild(li);

		var recipeIngredient = document.createTextNode(ingredient);
		li.appendChild(recipeIngredient);

	});

	var recipeImage = document.createElement('img');
	recipeImage.src = this.recipes[index].pictureBig;
	p.appendChild(recipeImage);
	p.appendChild(document.createTextNode(this.recipes[index].description));

};