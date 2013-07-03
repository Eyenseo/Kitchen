function Kitchen(canvasId) {
	// get the right requestAnimationFrame for this browser
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	// apply the right animation frame to the window object
	window.requestAnimationFrame = requestAnimationFrame;

	// create a new stage object
	this.stage = new Stage(canvasId);

	this.prepared = false;
	this.collisionBoxes;

	//Ajax
	this.jsonHandler = new JSONHandler();

	//SoundManager
	this.soundManager = new SoundManager();

	//VideoManager
	this.videoManager = new VideoManager();

	//HTML manager
	this.htmlManager = new HTMLManager(this.jsonHandler, this);

	//Restrainer
	this.restrainer = new Restrainer(this);

	//event stuff
	this.stage.registerEvent('click', this);
	this.pressesObject = null;
	this.stage.registerEvent('dragend', this);
	this.stage.registerEvent('dragstart', this);
	this.stage.registerEvent('mousedown', this);
	this.stage.registerEvent('mouseup', this);
	this.stage.registerEvent('mouseover', this);
	this.stage.registerEvent('mouseout', this);

	//create Objects
	this.allObjects = [];

	//zOrder
	this.maxIndex = 660;
	this.initialiseKitchen();

	this.bug = 0;

	// start the animation loop
	// parameter this (kitchen itself) needed, because of the closure within the run function
	this.run(this);

}

Kitchen.prototype.restart = function() {
	var THIS = this;

	this.allObjects.forEach(function(object) {
		THIS.stage.removeFromStage(object);
		if(object instanceof SoundManager && object instanceof VideoManager) {
			object.stopAll();
		}
	});

	this.initialiseKitchen();
	this.htmlManager.allRecipes();
};

Kitchen.prototype.makeObjectById = function(objectId, extra) {
	var objectData = this.jsonHandler.objectById(objectId);
	return  this.makeObject(objectData, extra);
};

Kitchen.prototype.makeObject = function(objectData, extra) {
	var addToStage = true;
	var object;
	if(objectData != null && objectData !== undefined) {

		switch(objectData.type) {
			case "Ingredient":
				if(extra == false) {
					addToStage = false;
				}
				object = new Ingredient(this.stage, objectData, this.restrainer, this.soundManager);
				break;
			case "Plate":
				object = new Plate(this.stage, objectData, this.restrainer);
				break;
			case "Knob":
				if(extra === undefined) {
					throw "A connection from a Knob is needed!"
				}
				object = new Knob(this.stage, objectData, this.restrainer, extra);
				break;
			case "Sieve":
				object = new Sieve(this.stage, objectData, this.restrainer);
				break;
			case "Pot":
				object = new CookContainer(this.stage, objectData, this.restrainer, this.soundManager);
				break;
			case "Knife":
				object = new Knife(this.stage, objectData, this.restrainer);
				break;
			case "Container":
				object = new Container(this.stage, objectData, this.restrainer);
				break;
			case "CuttingBoard":
				object = new CuttingBoard(this.stage, objectData, this.restrainer);
				break;
			case "Sink":
				if(extra === undefined) {
					throw "Water data is for a Sink needed!"
				}
				object = new Sink(this.stage, objectData, this.restrainer, this, extra);
				break;
			case "Fridge":
				object = new Fridge(this.stage, objectData, this.restrainer, this.soundManager);
				break;
			case  "Cupboard":
				object = new Cupboard(this.stage, objectData, this.restrainer);
				break;
			case "PowerButton":
				object = new PowerButton(this.stage.getContext(), objectData);
				break;
			case "ForwardButton":
				object = new ForwardButton(this.stage.getContext(), objectData);
				break;
			case "BackButton":
				object = new BackButton(this.stage.getContext(), objectData);
				break;
			case "Oven":
				object = new Oven(this.stage, objectData, this.restrainer, this.soundManager);
				break;
			case "Mascot":
				object = new Mascot(this.stage.getContext(), objectData);
				break;
			default :
				console.log("There is no object with the type: " + objectData.type);
		}

		this.addObject(object, addToStage);
	}
	return  object;
};

Kitchen.prototype.addObject = function(object, addToStage) {
	if(object !== null && object !== undefined) {
		this.allObjects.push(object);
		if(addToStage) {
			this.stage.addToStage(object);
		}
	}
};

Kitchen.prototype.initialiseKitchen = function() {
	var bufferObject;

	//Create background
	bufferObject = new Background(this.stage);
	this.collisionBoxes = bufferObject.collisionBoxes;
	this.addObject(bufferObject, true);

	//TV
	this.makeObjectById("powerButton");
	this.makeObjectById("backButton");
	this.makeObjectById("forwardButton");

	//Fridge
	this.makeObjectById("fridge");

	//Mascot
	this.makeObjectById("mascot");

	//Left cupboard
	this.makeObjectById("leftCupboard");

	//Oven
	bufferObject = this.makeObjectById("oven");
	this.makeObjectById("knob0", bufferObject);

	//Right cupboard
	this.makeObjectById("rightCupboard");

	//Create Stove
	bufferObject = this.makeObjectById("hotPlateFrontLeft");
	this.makeObjectById("knob1", bufferObject);
	bufferObject = this.makeObjectById("hotPlateBackLeft");
	this.makeObjectById("knob2", bufferObject);
	bufferObject = this.makeObjectById("hotPlateBackRight");
	this.makeObjectById("knob3", bufferObject);
	bufferObject = this.makeObjectById("hotPlateFrontRight");
	this.makeObjectById("knob4", bufferObject);

	//Create Sink
	this.makeObjectById("sink", this.jsonHandler.objectById("water"));
};

Kitchen.prototype.prepareKitchen = function(currentRecipe) {
	var THIS = this;

	currentRecipe.ingredients.forEach(function(objectId) {
		THIS.makeObjectById(objectId);
	});
	currentRecipe.utensils.forEach(function(objectId) {
		THIS.makeObjectById(objectId);
	});

	this.stage.reorderRenderObjects();
	this.restrainer.setRecipe(currentRecipe);
	this.prepared = true;
	this.finished = false;
};

Kitchen.prototype.onClick = function(event) {
	if(event.target !== null && event.target !== undefined) {
		if(this.pressesObject !== null && this.pressesObject !== undefined && this.pressesObject === event.target &&
		   "clickAction" in event.target) {
			event.target.clickAction(this);
		}
	}
};

/**
 * Checks what has to happen if something is dropped over an other thing.
 * Then the special function dragEndAction of an object is performed.
 * @param event
 */
Kitchen.prototype.onDragend = function(event) {
	if(event.target !== null && event.target !== undefined) {
		if("dragEndAction" in event.target) {
			event.target.dragEndAction(this);
			this.stage.reorderRenderObjects();
		}
	}
};

/**
 * Checks if a function has to be performed when something is dragged from somewhere.
 * @param event
 */
Kitchen.prototype.onDragstart = function(event) {
	if(event.target !== null && event.target !== undefined) {
		if("dragStartAction" in event.target) {
			event.target.dragStartAction(this);
		}
	}
};

//TODO JAVADOC
Kitchen.prototype.onMouseover = function(event) {
	if(event.target !== null && event.target !== undefined) {
		if("mouseOverAction" in event.target) {
			event.target.mouseOverAction(this);
		}
	}
};

//TODO JAVADOC
Kitchen.prototype.onMouseout = function(event) {
	if(event.target !== null && event.target !== undefined) {
		if("mouseOutAction" in event.target) {
			event.target.mouseOutAction(this);
		}
	}
};

//TODO JAVADOC
Kitchen.prototype.onMousedown = function(event) {
	if(event.target !== null && event.target !== undefined) {
		if("mouseDownAction" in event.target && event.target.hasOwnProperty("draggable") && event.target.draggable) {
			event.target.mouseDownAction(this);
			this.stage.reorderRenderObjects();
		}
	}
	this.pressesObject = event.target;
};

//TODO JAVADOC
Kitchen.prototype.onMouseup = function(event) {
	if(event.target !== null && event.target !== undefined) {
		if("mouseUpAction" in event.target) {
			event.target.mouseUpAction(this);
			this.stage.reorderRenderObjects();
		}
	}
};

/**
 * Animation loop
 * @param kit the kitchen object
 */
Kitchen.prototype.run = function(kit) {
	if(!this.finished) {
		if(this.prepared) {
			var THIS = this;

			this.allObjects.forEach(function(object) {
				//the keyword [String] in [Object] checks if the object has a function named as specified in the String
				if("action" in object) {
					object.action(THIS);
				}
			});
			this.restrainer.checkStage();
		}

		if(this.bug < 5) { // Dirty hack - probably because of something in the stage?
			this.videoManager.changePower(); // if this is not done the stage doesn't start to render the previous created
			this.videoManager.changePower();
			this.bug++
		}

		// Always render after the updates
		kit.stage.render();
	}
	// keep the loop going
	window.requestAnimationFrame(function() {
		kit.run(kit);
	});
};