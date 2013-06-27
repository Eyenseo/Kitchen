//TODO Doc
function Restrainer(recipe, kitchenStage) {
	this.recipe = recipe;
	this.kitchenStage = kitchenStage;
	this.recipeStage = 0;

}

Restrainer.prototype.constructor = Restrainer;

//TODO Doc
Restrainer.prototype.checkOption = function(objectOneName, doAction, objectTwoName) {
	var objectTwo;

	switch(doAction) {
		case "put":
			var objectOne = this.getObject(objectOneName);
			//TODO make it available for more utensils than pot ...
			if(objectOne instanceof Pot) {
				var action = this.recipe.schedule[this.recipeStage].action;

				action.forEach(function(act) {
					if(act.act === daAction) {
						act.stuff.forEach(function(name) {
							if(name === objectTwoName) {
								return true;
							} else {
								return false;
							}
						});
					}
				});
			} else {
				throw "put is just available for Pots";
			}
			break;

		case "isCooked":
			objectTwo = this.getObject(objectOneName);

			if(objectTwo instanceof Ingredient) {
				if(objectTwo.isCooked()) {
					return true;
				}
			} else {
				throw "isCooked is just available for Ingredients";
			}
			break;

		case "isCut":
			objectTwo = this.getObject(objectOneName);

			if(objectTwo instanceof Ingredient) {
				if(objectTwo.isCut()) {
					return true;
				}
			} else {
				throw "isCut is just available for Ingredients";
			}
			break;

		default:
			throw "Undefined action!";
	}

	//TODO do boom or what ever
	console.log(objectOne.name + " may not " + doAction + " with " + objectTwo.name);
	return false;
};

//TODO Doc
Restrainer.prototype.checkStage = function() {
	var THIS = this;
	var action = this.recipe.schedule[this.recipeStage].action;
	var isDone = true;

	action.forEach(function(act) {
		act.stuff.forEach(function(second) {
			isDone = THIS.checkOption(act.utensil, act.act, second);
			if(!isDone) {
				return false;
			}
		});
	});
	return true;
};

//TODO Doc
Restrainer.prototype.getObject = function(name) {
	this.kitchenStage.renderObjects.forEach(function(object) {
		if(object.hasOwnProperty(name) && object.name === name) {
			return object;
		}
	});
	throw "Object with name: " + name + " wasn't found!";
};