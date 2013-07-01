//TODO Doc
function Restrainer(kitchen) {
	this.kitchen = kitchen;
	this.recipe = null;
	this.recipeStage = 0;
}

Restrainer.prototype.constructor = Restrainer;

//TODO Doc
Restrainer.prototype.checkPutRequest = function(utensile, objectTwo) {
	if(this.recipe == null) {
		throw "The restrainer needs a recipe!";
	}

	var ok = false;

	if(utensile instanceof Container) {
		var action = this.recipe.schedule[this.recipeStage].action;
		action.forEach(function(act) {
			if(act.utensil === utensile.name) {
				if(act.act === "put") {
					act.stuff.forEach(function(name) {
						if(name === objectTwo.name) {
							ok = true;
						}
					});
				}
			}
		});
	} else {
		throw "put is just available for ContainerUtensils";
	}

	if(!ok) {
		//TODO do boom or what ever
		if(!(utensile instanceof Plate && objectTwo instanceof Ingredient)) {
			console.log(objectTwo.name + " may not be put in " + utensile.name);
		}
	}
	return ok;
};

//TODO Doc
Restrainer.prototype.checkStage = function() {
	if(this.recipe == null) {
		throw "The restrainer needs a recipe!";
	}

	var THIS = this;
	var action = this.recipe.schedule[this.recipeStage].action;
	var done = true;

	action.forEach(function(act) {
		if(done) {
			act.stuff.forEach(function(second) {
				if(done) {
					done = THIS.checkActionState(second, act);
				}
			});
		}
	});

	if(done) {
		this.recipeStage = this.recipeStage + 1; // TODO check for last step to "WoW"
		console.log(this.recipe.schedule[this.recipeStage].text);
	}
};

//TODO Doc
Restrainer.prototype.checkActionState = function(stuffObjectName, action) {
	var THIS = this;
	var done = false;

	var stuffObjects = null;

	switch(action.act) {
		case "put":
			var utensilObjects = THIS.getObject(action.utensil);

			utensilObjects.forEach(function(object) {
				if(!done) {
					if(object instanceof Container) {
						var content = object.content;
						content.forEach(function(object) {
							if(!done && stuffObjectName === object.name) {
								done = true;
							}
						});
						//					if(!done) {
						//						console.log(stuffObjectName + " was not inside....");
						//					}
					} else {
						throw "put is just available for ContainerUtensils - bad name: " + stuffObjectName;
					}
				}
			});
			break;

		case "isCooked" :
			stuffObjects = THIS.getObject(stuffObjectName);

			stuffObjects.forEach(function(object) {
				if(!done) {
					if(object instanceof Ingredient) {
						done = object.cooked;

						//					if(!done) {
						//						console.log(stuffObjectName + " was not cooked....");
						//					}
					} else {
						throw "isCooked is just available for Ingredients";
					}
				}
			});
			break;

		case "isCut" :
			stuffObjects = THIS.getObject(stuffObjectName);

			stuffObjects.forEach(function(object) {
				if(!done) {
					if(object instanceof Ingredient) {
						done = object.cut;
						//					if(!done) {
						//						console.log(stuffObjectName + " was not cut....");
						//					}
					} else {
						throw "isCut is just available for Ingredients";
					}
				}
			});
			break;

		default:
			throw "Undefined action!";
	}

	return done;
};

//TODO Doc
Restrainer.prototype.getObject = function(name) {
	var found = [];
	this.kitchen.allObjects.forEach(function(object) {
		if(object.hasOwnProperty("name") && object.name === name) {
			found.push(object);
		}
	});
	if(found.length === 0) {
		throw "Object with name: " + name + " wasn't found!";
	} else {
		return found;
	}
};