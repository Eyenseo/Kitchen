/**
 * this object restrains the actions of the user, so the user will be allowed to do only things that are intended by the recipe
 * @param kitchen - the kitchen
 * @constructor
 */
function Restrainer(kitchen) {
	this.kitchen = kitchen;
	this.soundManager = this.kitchen.soundManager;
	this.recipe = null;
	this.recipeStage = 0;
	this.htmlManager = kitchen.htmlManager;
}

Restrainer.prototype.constructor = Restrainer;

/**
 * the function will set the recipeStage to 0, set the recipe and calls the htmlManager to display the first step of the recipe
 * @param recipe
 */
Restrainer.prototype.setRecipe = function(recipe) {
	this.recipeStage = 0;
	this.recipe = recipe;
	this.htmlManager.updateSpeechBubbleText(this.recipe.schedule[this.recipeStage].text);
};

/**
 * this function will check if a put request is allowed or not
 * @param utensil passive object  - utensil eg.Container
 * @param objectTwo active object  - utensil or ingredient
 * @param silent BOOLEAN - if by failure a sound shall be played
 * @returns {boolean} if the put request is allowed by the recipe
 */
Restrainer.prototype.checkPutRequest = function(utensil, objectTwo, silent) {
	if(this.recipe == null) {
		throw "The restrainer needs a recipe!";
	}

	var ok = false;

	if(utensil instanceof Container) {
		var action = this.recipe.schedule[this.recipeStage].action;         //current step of the recipe
		if(utensil instanceof Fridge || utensil instanceof Cupboard) {      //ignore those
			ok = true;
		} else {
			action.forEach(function(act) {
				if(act.utensil === utensil.name) {
					if(act.act === "put") {
						act.stuff.forEach(function(name) {
							if(name === objectTwo.name) {
								ok = true;
							}
						});
					}
				}
			});
		}
	} else {
		console.log("put is just available for Container");
	}

	if(!ok) {
		if(!(utensil instanceof Plate && objectTwo instanceof Ingredient)) {  //those are ignored too - combine with the other two
			if(!(silent === true)) {
				//				console.log(objectTwo.name + " may not be put in " + utensil.name);//DEBUG
				this.soundManager.play(this.soundManager.NEGATIVE);
			}
		}
	}
	return ok;
};

/**
 * th function will go trough all parts of the current recipe step and check if all is done, if it is the recipe stage is increased, a chime is played and the speech bubble text is updated
 * if it was the last stage the kitchen will be stoped, all sounds & videos are stoped and the "wow" picture will be shown
 */
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
		if(this.recipeStage === this.recipe.schedule.length - 1) {
			this.htmlManager.showWow(this.recipe.pictureFinish);
			this.soundManager.stopAll();
			this.kitchen.videoManager.stopAll();
			this.kitchen.finished = true;
		} else {
			this.recipeStage = this.recipeStage + 1;
			this.htmlManager.updateSpeechBubbleText(this.recipe.schedule[this.recipeStage].text);
		}
		this.soundManager.play(this.soundManager.POSITIVE);
	}
};

/**
 * the function will check if the action was done
 * @param stuffObjectName - active object
 * @param action STRING - action to check [put,isCooked,isCut]
 * @returns {boolean} if it was done or not ...
 */
Restrainer.prototype.checkActionState = function(stuffObjectName, action) {
	var THIS = this;
	var done = false;
	var stuffObjects = this.getObject(stuffObjectName);

	switch(action.act) {
		case "put":
			var utensilObjects = THIS.getObject(action.utensil);

			if(utensilObjects !== undefined) {
				utensilObjects.forEach(function(object) {
					if(!done) {
						stuffObjects.forEach(function(stuff) {
							if(stuff instanceof Container) {
								object.linkedObjects.forEach(function(o) {
									if(!done && stuffObjectName === o.name) {
										done = true;
									}
								});
							}
						});
						if(!done) {
							if(object instanceof Container && object.name === action.utensil) {
								var content = object.content;
								content.forEach(function(o) {
									if(!done && stuffObjectName === o.name) {
										done = true;
									}
								});
								//					if(!done) {
								//						console.log(stuffObjectName + " was not inside....");
								//					}
							} else if(object instanceof Plate || object instanceof Sink) {
								object.linkedObjects.forEach(function(o) {
									if(!done && stuffObjectName === o.name) {
										done = true;
									}
								})
							} else {
								console.log("put is just available for Container, Plate and Sink - bad name: " +
								            object.name);
							}
						}
					}
				});
			}
			break;

		case "isCooked":
			stuffObjects.forEach(function(object) {
				if(!done) {
					if(object instanceof Ingredient) {
						done = object.cooked;

						//					if(!done) {
						//						console.log(stuffObjectName + " was not cooked....");
						//					}
					} else {
						console.log("isCooked is just available for Ingredients");
					}
				}
			});
			break;

		case "isCut":
			stuffObjects.forEach(function(object) {
				if(!done) {
					if(object instanceof Ingredient) {
						done = object.cut;
						//					if(!done) {
						//						console.log(stuffObjectName + " was not cut....");
						//					}
					} else {
						console.log("isCut is just available for Ingredients");
					}
				}
			});
			break;

		default:
			console.log("Undefined action!");
	}

	return done;
};

/**
 * the function searches in the allObjects array for all objects with the name
 * @param name STRING - name of the object to be found
 * @returns {Array} - array with all found objects
 */
Restrainer.prototype.getObject = function(name) {
	var found = [];

	this.kitchen.allObjects.forEach(function(object) {
		if(object.hasOwnProperty("name") && object.name === name) {
			found.push(object);
		}
	});

	if(name !== "water" && found.length === 0) {                      //water still needed?
		console.log("Object with name: " + name + " wasn't found!");
	} else {
		return found;
	}
};