function Kitchen(canvasId) {

	// get the right requestAnimationFrame for this browser
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	// apply the right animation frame to the window object
	window.requestAnimationFrame = requestAnimationFrame;

	// create a new stage object
	this.stage = new Stage(canvasId);

	this.prepared = false;

	//Ajax
	this.jsonHandler = new JSONHandler();

	//create Objects
	this.allObjects = [];
	this.allMoveable = [];
	this.pots = [];
	this.plates = [];
	this.maxIndex = 0;
	this.holdObject = null;
	this.restrainer = null;

	//kitchen background
	this.kitchenBackground = new VisualRenderObject(this.stage.getContext(), 0, 0, 1024, 650,
	                                                "images/background/kitchenBackground.png", 5);
	this.allObjects.push(this.kitchenBackground);
	this.stage.addToStage(this.kitchenBackground);

	//SoundManager
	this.soundManager = new SoundManager();

	//Plate
	var hotPlateFrontLeft = new Plate(this.stage.getContext(), this.findJSONObjectByName("hotPlateFrontLeft"));
	var hotPlateFrontRight = new Plate(this.stage.getContext(), this.findJSONObjectByName("hotPlateFrontRight"));
	var hotPlateBackLeft = new Plate(this.stage.getContext(), this.findJSONObjectByName("hotPlateBackLeft"));
	var hotPlateBackRight = new Plate(this.stage.getContext(), this.findJSONObjectByName("hotPlateBackRight"));

	this.allObjects.push(hotPlateFrontLeft);
	this.allObjects.push(hotPlateFrontRight);
	this.allObjects.push(hotPlateBackLeft);
	this.allObjects.push(hotPlateBackRight);

	this.plates.push(hotPlateFrontLeft);
	this.plates.push(hotPlateFrontRight);
	this.plates.push(hotPlateBackLeft);
	this.plates.push(hotPlateBackRight);

	this.stage.addToStage(hotPlateFrontLeft);
	this.stage.addToStage(hotPlateFrontRight);
	this.stage.addToStage(hotPlateBackLeft);
	this.stage.addToStage(hotPlateBackRight);

	//Knob
	//	var knob1 = new Knob(this.stage.getContext(), 600, 500, 90, "Knob One", oven);
	var knob2 = new Knob(this.stage.getContext(), this.findJSONObjectByName("knob2"), hotPlateBackLeft);
	var knob3 = new Knob(this.stage.getContext(), this.findJSONObjectByName("knob3"), hotPlateBackRight);
	var knob4 = new Knob(this.stage.getContext(), this.findJSONObjectByName("knob4"), hotPlateFrontLeft);
	var knob5 = new Knob(this.stage.getContext(), this.findJSONObjectByName("knob5"), hotPlateFrontRight);

	//	this.allObjects.push(knob1);
	this.allObjects.push(knob2);
	this.allObjects.push(knob3);
	this.allObjects.push(knob4);
	this.allObjects.push(knob5);

	//	this.stage.addToStage(knob1);
	this.stage.addToStage(knob2);
	this.stage.addToStage(knob3);
	this.stage.addToStage(knob4);
	this.stage.addToStage(knob5);

	this.cuttingBoard = null;

	//event stuff
	this.stage.registerEvent('click', this);
	this.stage.registerEvent('dragend', this);
	this.stage.registerEvent('dragstart', this);
	this.stage.registerEvent('mousedown', this);
	this.stage.registerEvent('mouseup', this);
	this.stage.registerEvent('mouseover', this);
	this.stage.registerEvent('mouseout', this);

	// start the animation loop
	// parameter this (kitchen itself) needed, because of the closure within the run function
	this.run(this);

	var html = new RecipeHTML(this.jsonHandler, this);
}

//TODO DOC
Kitchen.prototype.findJSONObjectByName = function(name) {
	var object = null;
	this.jsonHandler.kitchenStuff.forEach(function(jsonObject) {
		if(jsonObject.name === name) {
			object = jsonObject;
		}
	});
	if(object == null) {
		this.jsonHandler.ingredients.forEach(function(jsonObject) {
			if(jsonObject.name === name) {
				object = jsonObject;
			}
		});
	}
	return object;
};

//TODO DOC
Kitchen.prototype.prepareKitchen = function(currentRecipe) {
	this.addIngredients(currentRecipe.ingredients);
	this.addUtensils(currentRecipe.utensils);
	this.restrainer = new Restrainer(this, currentRecipe);
	var index = 0;

	this.allObjects.sort(function compare(a, b) {
		if(a.zOrder < b.zOrder) {
			return -1;
		}
		if(a.zOrder > b.zOrder) {
			return 1;
		}
		return 0;
	});

	this.allObjects.forEach(function(object) {
		if(object !== undefined && object !== null) {
			object.zOrder = index;
			index = index + 1;
		}
	});

	this.stage.reorderRenderObjects();
	this.maxIndex = index;
	this.prepared = true;
};

//TODO DOC
Kitchen.prototype.addIngredients = function(recipeIngredients) {
	var THIS = this;

	recipeIngredients.forEach(function(ingredientName) {
		var add = false;
		THIS.jsonHandler.ingredients.forEach(function(ingredientData) {
			if(ingredientName === ingredientData.name) {
				var thing = new Ingredient(THIS.stage.getContext(), ingredientData);

				THIS.allObjects.push(thing);
				THIS.allMoveable.push(thing);
				THIS.stage.addToStage(thing);
				add = true;
			}
		});

		if(!add) {
			console.log(ingredientName + " was not added!");
		}
	});
};

//TODO DOC
Kitchen.prototype.addUtensils = function(recipeUtensils) {
	var THIS = this;

	recipeUtensils.forEach(function(utensilName) {
		var thing;
		var add = false;
		THIS.jsonHandler.kitchenStuff.forEach(function(utensilData) {
			if(utensilName === utensilData.name) {
				switch(utensilData.type) {
					case "Pot":
						thing = new Pot(THIS.stage.getContext(), utensilData, THIS.soundManager);
						THIS.pots.push(thing);
						break;
					case "Knife":
						thing = new Knife(THIS.stage.getContext(), utensilData);
						break;
					case "CuttingBoard":
						thing = new CuttingBoard(THIS.stage.getContext(), utensilData);
						THIS.cuttingBoard = thing;
						break;
					case "Bowl":
						thing = new Bowl(THIS.stage.getContext(), utensilData);
						break;
					case "Sieve":
						thing = new Sieve(THIS.stage.getContext(), utensilData);
						break;
					/*case "BakingTin":
					 thing = new BakingTin(THIS.stage.getContext(), utensilData);
					 break;*/
				}
				if(thing !== undefined) {
					THIS.allObjects.push(thing);
					THIS.allMoveable.push(thing);
					THIS.stage.addToStage(thing);
					add = true;
				}
			}
		});

		if(!add) {
			console.log(utensilName + " was not added!");
		}
	});
};

//TODO DOC
Kitchen.prototype.onClick = function(event) {
	if(event.target instanceof Knob) {
		event.target.clickAction(this);
	}
};

/**
 * Checks what has to happen if something is dropped over an other thing.
 * Then the special function dragEndAction of an object is performed.
 * @param event
 */
Kitchen.prototype.onDragend = function(event) {
	//console.log(event.target);
	if(event.target instanceof Ingredient || event.target instanceof Pot || event.target instanceof Knife) {
		event.target.dragEndAction(this);
	}
};

/**
 * Checks if a function has to be performed when something is dragged from somewhere.
 * @param event
 */
Kitchen.prototype.onDragstart = function(event) {
	if(event.target instanceof Pot || event.target instanceof Ingredient) {
		event.target.dragStartAction();
	}
};

//TODO JAVADOC
Kitchen.prototype.onMouseover = function(event) {
	if(event.target instanceof Ingredient || event.target instanceof KitchenStuff) {
		event.target.mouseOverAction();
	}
};

//TODO JAVADOC
Kitchen.prototype.onMouseout = function(event) {
	if(event.target instanceof Ingredient || event.target instanceof KitchenStuff) {
		event.target.mouseOutAction();
	}
};

//TODO JAVADOC
Kitchen.prototype.onMousedown = function(event) {
	if(event.target.hasOwnProperty("draggable") && event.target.draggable) {
		var THIS = this;
		var oldIndex = event.target.zOrder;
		this.holdObject = event.target;

		this.allMoveable.forEach(function(object) {
			if(object === event.target) {
				object.zOrder = THIS.maxIndex;
			} else if(object.zOrder >= oldIndex) {
				object.zOrder = object.zOrder - 1;
			}
		});

		this.stage.reorderRenderObjects();
	}
};

//TODO JAVADOC
Kitchen.prototype.onMouseup = function(event) {
	if(this.holdObject !== null) {
		this.holdObject.zOrder = this.holdObject.zOrder - 1;
		this.holdObject = null;
		this.stage.reorderRenderObjects();
	}
};

/**
 * Animation loop
 * @param kit the kitchen object
 */
Kitchen.prototype.run = function(kit) {
	if(this.prepared) {
		var THIS = this;

		// update the objects (Plate, Knob, ...)
		for(var i = 0; i < this.pots.length; i++) {
			this.pots[i].updateTemperatures();
		}

		this.allMoveable.forEach(function(object) {
			//the keyword [String] in [Object] checks if the object has a function named as specified in the String
			if("action" in object) {
				object.action(THIS);
			}
		});
		this.restrainer.checkStage();
	}

	// Always render after the updates
	kit.stage.render();
	// keep the loop going
	window.requestAnimationFrame(function() {
		kit.run(kit);
	});

};