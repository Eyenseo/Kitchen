function RecipeHTML() {
	var body = document.querySelector('body');

	var startUpDiv = document.createElement('div');
	startUpDiv.setAttribute('id', 'startUpDiv');
	body.appendChild(startUpDiv);

	var noteGroundDiv = document.createElement('div');
	noteGroundDiv.setAttribute('id', 'noteGroundDiv');
	startUpDiv.appendChild(noteGroundDiv);

	//menu
	var menuDiv = document.createElement('div');
	menuDiv.setAttribute('id', 'menuDiv');
	noteGroundDiv.appendChild(menuDiv);

	var backImage = document.createElement('img');
	backImage.setAttribute('id', 'backImage');
	backImage.src = 'images/menu/backImage.png';
	backImage.addEventListener('click', function() {
		var detail = document.querySelector('#recipeDetail');
		detail.parentNode.removeChild(detail);
		document.querySelector('#menuDiv').style.display = 'none';
		document.querySelector('#allRecipesDiv').style.display = 'block';
	});
	menuDiv.appendChild(backImage);

	var startImage = document.createElement('img');
	startImage.setAttribute('id', 'startImage');
	startImage.src = 'images/menu/startImage.png';
	menuDiv.appendChild(startImage);

	//List of Recipes
	var allRecipesDiv = document.createElement('div');
	allRecipesDiv.setAttribute('id', 'allRecipesDiv');
	noteGroundDiv.appendChild(allRecipesDiv);

	var ul = document.createElement('ul');
	allRecipesDiv.appendChild(ul);

	for(var i = 0; JSONHandler.recipes.length > i; i++) {
		var li = document.createElement('li');
		ul.appendChild(li);

		var oneRecipeDiv = document.createElement('div');
		oneRecipeDiv.setAttribute('class', 'oneRecipeDiv');
		oneRecipeDiv.addEventListener("click", this.recipeDetail(i));
		li.appendChild(oneRecipeDiv);

		var recipeImage = document.createElement('img');
		recipeImage.src = JSONHandler.recipes[i].pictureFinish;
		oneRecipeDiv.appendChild(recipeImage);

		var recipeName = document.createElement('span');
		recipeName.innerHTML = JSONHandler.recipes[i].name;
		oneRecipeDiv.appendChild(recipeName);

		var recipeDifficulty = document.createElement('img');
		recipeDifficulty.src = "images/star" + JSONHandler.recipes[i].difficulty + ".jpg";
		oneRecipeDiv.appendChild(recipeDifficulty);

	}
}

/**
 * Function to display the selected recipe with more detail instead of the recipe list
 * @param index NUMBER - index of the selected recipe in the json file
 */
RecipeHTML.prototype.recipeDetail = function(index) {
	document.querySelector('#menuDiv').style.display = 'block';
	document.querySelector('#allRecipesDiv').style.display = 'none';

	document.querySelector('#startImage').addEventListener('click', function() {
		//TODO function to give the kitchen the selected recipe
	});

	var recipeDetails = document.createElement('div');
	recipeDetails.setAttribute('id', 'recipeDetails');
	document.querySelector("menuDiv").appendChild(recipeDetails);

	var hl = document.createElement('hl');
	recipeDetails.appendChild(hl);

	var starImage = document.createElement('img');
	starImage.src = "images/star" + JSONHandler.recipes[index].difficulty + ".jpg";
	recipeDetails.appendChild(starImage);

	var recipeName = document.createElement('span');
	recipeName.innerHTML = JSONHandler.recipes[index].name;
	hl.appendChild(recipeName);

	var ul = document.createElement('ul');
	recipeDetails.appendChild(ul);

	var p = document.createElement('p');
	recipeDetails.appendChild(p);

	JSONHandler.recipes[index].ingredients.forEach(function(ingredient) {
		var li = document.createElement('li');
		ul.appendChild(li);

		var recipeIngredient = document.createTextNode(ingredients);
		li.appendChild(recipeIngredient);

	});

	var recipeImage = document.createElement('img');
	recipeImage.src = JSONHandler.recipes[index].pictureBig;
	p.appendChild(recipeImage);
	p.appendChild(document.createTextNode(JSONHandler.recipes[index].description));

};