function Kitchen(canvasId) {

	// get the right requestAnimationFrame for this browser
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	// apply the right animation frame to the window object
	window.requestAnimationFrame = requestAnimationFrame;

	// create a new stage object
	this.stage = new Stage(canvasId);

	//Ajax
	this.jsonHandler = new JSONHandler();

	//create Objects
	//kitchen background
	this.kitchenBackground = new VisualRenderObject(this.stage.getContext(), 0, 0, 1024, 650, "images/kitchenBackground.png", 5);
	this.stage.addToStage(this.kitchenBackground);

	//SoundManager
	this.soundManager = new SoundManager();

	//Plate
	this.plates = [];
	var plate1 = new Plate(this.stage.getContext(), 500, 400, 90, "Plate One");
	var plate2 = new Plate(this.stage.getContext(), 750, 400, 90, "Plate Two");

	this.plates.push(plate1);
	this.plates.push(plate2);

	this.stage.addToStage(plate1);
	this.stage.addToStage(plate2);

	//Knob
	this.knobs = [];
	var knob1 = new Knob(this.stage.getContext(), 600, 500, 90, "Knob One", plate1);
	var knob2 = new Knob(this.stage.getContext(), 850, 500, 90, "Knob Two", plate2);

	this.knobs.push(knob1);
	this.knobs.push(knob2);

	this.stage.addToStage(knob1);
	this.stage.addToStage(knob2);

	this.pots = [];
	this.ingredients = [];

	//event stuff
	this.stage.registerEvent('click', this);
	this.stage.registerEvent('dragend', this);
	this.stage.registerEvent('dragstart', this);

	// start the animation loop
	// parameter this (kitchen itself) needed, because of the closure within the run function
	this.run(this);

	var html = new RecipeHTML(this.jsonHandler, this);

	//TODO This is for testing only - the object will be loaded from the Ajax object
	//	this.addIngredients([
	//		                    {
	//			                    "name": "noodle",
	//			                    "sx": 15,
	//			                    "sy": 85,
	//			                    "w": 165,
	//			                    "h": 54,
	//			                    "zOrder": 6,
	//			                    "actionTime": 0.001,  // TODO 'old heatRising value - most probably will be changed to time based action
	//			                    "picture": "images/nudel.png",
	//			                    "aniObject": {
	//				                    "image": {
	//					                    "tileWidth": 165,
	//					                    "tileHeight": 54,
	//					                    "imgWidth": 165,
	//					                    "imgHeight": 54
	//				                    },
	//				                    "animations": {
	//					                    "default": {
	//						                    "seq": [0],
	//						                    "loop": false
	//					                    }
	//				                    }
	//			                    }
	//		                    },
	//		                    {
	//			                    "name": "water",
	//			                    "sx": 20,
	//			                    "sy": 80,
	//			                    "w": 86,
	//			                    "h": 150,
	//			                    "zOrder": 201,
	//			                    "actionTime": 0.002,  // TODO 'old heatRising value - most probably will be changed to time based action
	//			                    "picture": "images/water.png",
	//			                    "aniObject": {
	//				                    "image": {
	//					                    "tileWidth": 86,
	//					                    "tileHeight": 150,
	//					                    "imgWidth": 86,
	//					                    "imgHeight": 150
	//				                    },
	//				                    "animations": {
	//					                    "default": {
	//						                    "seq": [0],
	//						                    "loop": false
	//					                    }
	//				                    }
	//			                    }
	//		                    }
	//	                    ]);
	//	this.addUtensils([
	//		                 {
	//			                 "name": "bigPot",
	//			                 "type": "Pot",
	//			                 "sx": 15,
	//			                 "sy": 187,
	//			                 "w": 242,
	//			                 "h": 187,
	//			                 "zOrder": 10,
	//			                 "cookTime": 10,
	//			                 "draggable": true,
	//			                 "actionTime": 0.0003,   // TODO 'old heatRising value - most probably will be changed to time based action
	//			                 "picture": "images/potAni.png",
	//			                 "aniObject": {
	//				                 "image": {
	//					                 "tileWidth": 242,
	//					                 "tileHeight": 187,
	//					                 "imgWidth": 2420,
	//					                 "imgHeight": 187
	//				                 },
	//				                 "animations": {
	//					                 "default": {
	//						                 "seq": [0],
	//						                 "loop": false
	//					                 },
	//					                 "lowStatic": {
	//						                 "seq": [3],
	//						                 "loop": false
	//					                 },
	//					                 "mediumStatic": {
	//						                 "seq": [6],
	//						                 "loop": false
	//					                 },
	//					                 "highStatic": {
	//						                 "seq": [9],
	//						                 "loop": false
	//					                 },
	//					                 "lowChanging": {
	//						                 "seq": [1, 2, 3, 2],
	//						                 "loop": true
	//					                 },
	//					                 "mediumChanging": {
	//						                 "seq": [4, 5, 6, 5],
	//						                 "loop": true
	//					                 },
	//					                 "highChanging": {
	//						                 "seq": [7, 8, 9, 8],
	//						                 "loop": true
	//					                 }
	//				                 }
	//			                 }
	//		                 },
	//		                 {
	//			                 "name": "bigPot",
	//			                 "type": "Pot",
	//			                 "sx": 15,
	//			                 "sy": 187,
	//			                 "w": 242,
	//			                 "h": 187,
	//			                 "zOrder": 11,
	//			                 "cookTime": 10,
	//			                 "draggable": true,
	//			                 "actionTime": 0.0003,  // TODO 'old heatRising value - most probably will be changed to time based action
	//			                 "picture": "images/potAni.png",
	//			                 "aniObject": {
	//				                 "image": {
	//					                 "tileWidth": 242,
	//					                 "tileHeight": 187,
	//					                 "imgWidth": 2420,
	//					                 "imgHeight": 187
	//				                 },
	//				                 "animations": {
	//					                 "default": {
	//						                 "seq": [0],
	//						                 "loop": false
	//					                 },
	//					                 "lowStatic": {
	//						                 "seq": [3],
	//						                 "loop": false
	//					                 },
	//					                 "mediumStatic": {
	//						                 "seq": [6],
	//						                 "loop": false
	//					                 },
	//					                 "highStatic": {
	//						                 "seq": [9],
	//						                 "loop": false
	//					                 },
	//					                 "lowChanging": {
	//						                 "seq": [1, 2, 3, 2],
	//						                 "loop": true
	//					                 },
	//					                 "mediumChanging": {
	//						                 "seq": [4, 5, 6, 5],
	//						                 "loop": true
	//					                 },
	//					                 "highChanging": {
	//						                 "seq": [7, 8, 9, 8],
	//						                 "loop": true
	//					                 }
	//				                 }
	//			                 }
	//		                 }
	//	                 ]);
}

Kitchen.prototype.prepareKitchen = function(currentRecipe) {
	var kitchen = this;

	kitchen.addIngredients(currentRecipe.ingredients);
	kitchen.addUtensils(currentRecipe.utensils);
};

//TODO DOC
Kitchen.prototype.addIngredients = function(recipeIngredients) {
	var THIS = this;

	recipeIngredients.forEach(function(ingredientName) {
		var add = false;
		THIS.jsonHandler.ingredients.forEach(function(ingredientData) {
			if(ingredientName == ingredientData.name) {
				var thing = new Ingredient(THIS.stage.getContext(), ingredientData);

				THIS.ingredients.push(thing);
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

	var thing;

	recipeUtensils.forEach(function(utensilName) {
		var add = false;
		THIS.jsonHandler.utensils.forEach(function(utensilData) {
			if(utensilName == utensilData.name) {
				switch(utensilData.type) {
					case "Pot":
						thing = new Pot(THIS.stage.getContext(), utensilData, THIS.soundManager);
						THIS.pots.push(thing);
						break;
				}
				THIS.stage.addToStage(thing);
				add = true;
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
	if(event.target instanceof Ingredient || event.target instanceof Pot || event.target instanceof CuttingBoard) {
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

/**
 * Function to make an object hover if the mouse slides over it
 * @param event
 */
Kitchen.prototype.onMouseover = function(event) {
	if(event.target instanceof Ingredient) {
		event.target.hoverAction();
	}
};

/**
 * Animation loop
 * @param kit the kitchen object
 */
Kitchen.prototype.run = function(kit) {

	// update the objects (Plate, Knob, ...)
	for(var i = 0; i < this.pots.length; i++) {
		this.pots[i].updateTemperatures();
	}

	// Always render after the updates
	kit.stage.render();
	// keep the loop going
	window.requestAnimationFrame(function() {
		kit.run(kit);
	});

};