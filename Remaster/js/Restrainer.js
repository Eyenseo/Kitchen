//TODO Doc
function Restrainer(kitchen) {
	this.kitchen = kitchen;
	this.soundManager = this.kitchen.soundManager;
	this.recipe = null;
	this.recipeStage = 0;
	this.htmlManager = kitchen.htmlManager;
}

Restrainer.prototype.constructor = Restrainer;

Restrainer.prototype.setRecipe = function(recipe) {
	this.recipeStage = 0;
	this.recipe = recipe;
	this.htmlManager.updateSpeechBubbleText(this.recipe.schedule[this.recipeStage].text);
};

//TODO Doc
Restrainer.prototype.checkPutRequest = function(utensile, objectTwo, silent) {
	if(this.recipe == null) {
		throw "The restrainer needs a recipe!";
	}

	var ok = false;

	if(utensile instanceof Container) {
		var action = this.recipe.schedule[this.recipeStage].action;
		if(utensile instanceof Fridge || utensile instanceof Cupboard) {
			ok = true;
		} else {
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
		}
	} else {
		console.log("put is just available for Container");
	}

	if(!ok) {
		//TODO do boom or what ever
		if(!(utensile instanceof Plate && objectTwo instanceof Ingredient)) {
			if(!(silent === true)) {
				console.log(objectTwo.name + " may not be put in " + utensile.name);
				this.soundManager.play(this.soundManager.NEGATIVE);
			}
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
		if(this.recipeStage === this.recipe.schedule.length - 1) {
			this.htmlManager.showWow(this.recipe.pictureFinish);
			this.kitchen.finished = true;
		} else {
			this.recipeStage = this.recipeStage + 1;
			this.htmlManager.updateSpeechBubbleText(this.recipe.schedule[this.recipeStage].text);
		}
		this.soundManager.play(this.soundManager.POSITIVE);
	}
};

//TODO Doc
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

//TODO Doc
Restrainer.prototype.getObject = function(name) {
	var found = [];

	this.kitchen.allObjects.forEach(function(object) {
		if(object.hasOwnProperty("name") && object.name === name) {
			found.push(object);
		}
	});

	if(name !== "water" && found.length === 0) {
		console.log("Object with name: " + name + " wasn't found!");
	} else {
		return found;
	}
};