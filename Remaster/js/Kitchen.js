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

	//Restrainer
	this.restrainer = new Restrainer(this);

	//HTML manager
	this.htmlManager = new HTMLManager(this.jsonHandler, this);

	//event stuff
	this.stage.registerEvent('click', this);
	this.stage.registerEvent('dragend', this);
	this.stage.registerEvent('dragstart', this);
	this.stage.registerEvent('mousedown', this);
	this.stage.registerEvent('mouseup', this);
	this.stage.registerEvent('mouseover', this);
	this.stage.registerEvent('mouseout', this);

	//create Objects
	this.allObjects = [];

	//zOrder
	this.maxIndex = 651;
	this.holdObject = null;
	this.initialiseKitchen();

	// start the animation loop
	// parameter this (kitchen itself) needed, because of the closure within the run function
	this.run(this);

}

Kitchen.prototype.makeObjectById = function(objectId, extra) {
	var objectData = this.jsonHandler.objectById(objectId);
	return  this.makeObject(objectData, extra);
};

Kitchen.prototype.makeObject = function(objectData, extra) {
	var addToStage = true;
	var object;
	if(objectData != null && objectData !== undefined) {
		var context = this.stage.getContext();

		switch(objectData.type) {
			case "Ingredient":
				if(extra == false) {
					addToStage = false;
				}
				object = new Ingredient(context, objectData, this.restrainer);
				break;
			case "Plate":
				object = new Plate(context, objectData, this.restrainer);
				break;
			case "Knob":
				if(extra === undefined) {
					throw "A connection from a Knob is needed!"
				}
				object = new Knob(context, objectData, this.restrainer, extra);
				break;
			case "Sieve":
				object = new Sieve(context, objectData, this.restrainer);
				break;
			case "Pot":
				object = new CookContainer(context, objectData, this.restrainer, this.soundManager);
				break;
			case "Knife":
				object = new Knife(context, objectData, this.restrainer);
				break;
			case "Container":
				object = new Container(context, objectData, this.restrainer);
				break;
			case "CuttingBoard":
				object = new CuttingBoard(context, objectData, this.restrainer);
				break;
			case "Sink":
				if(extra === undefined) {
					throw "Water data is for a Sink needed!"
				}
				object = new Sink(context, objectData, this.restrainer, this, extra);
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
	bufferObject = new Background(this.stage.getContext());
	this.collisionBoxes = bufferObject.collisionBoxes;
	this.addObject(bufferObject, true);

	//Create Stove
	bufferObject = this.makeObjectById("hotPlateFrontLeft");
	this.makeObjectById("knob2", bufferObject);
	bufferObject = this.makeObjectById("hotPlateFrontRight");
	this.makeObjectById("knob3", bufferObject);
	bufferObject = this.makeObjectById("hotPlateBackLeft");
	this.makeObjectById("knob4", bufferObject);
	bufferObject = this.makeObjectById("hotPlateBackRight");
	this.makeObjectById("knob5", bufferObject);

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
	this.restrainer.recipe = currentRecipe;
	this.prepared = true;
};

Kitchen.prototype.onClick = function(event) {
	if("clickAction" in event.target) {
		event.target.clickAction(this);
	}
};

/**
 * Checks what has to happen if something is dropped over an other thing.
 * Then the special function dragEndAction of an object is performed.
 * @param event
 */
Kitchen.prototype.onDragend = function(event) {
	if("dragEndAction" in event.target) {
		event.target.dragEndAction(this);
		this.stage.reorderRenderObjects();
	}
};

/**
 * Checks if a function has to be performed when something is dragged from somewhere.
 * @param event
 */
Kitchen.prototype.onDragstart = function(event) {
	if("dragStartAction" in event.target) {
		event.target.dragStartAction(this);
	}
};

//TODO JAVADOC
Kitchen.prototype.onMouseover = function(event) {
	if("mouseOverAction" in event.target) {
		event.target.mouseOverAction(this);
	}
};

//TODO JAVADOC
Kitchen.prototype.onMouseout = function(event) {
	if("mouseOutAction" in event.target) {
		event.target.mouseOutAction(this);
	}
};

//TODO JAVADOC
Kitchen.prototype.onMousedown = function(event) {
	if("mouseDownAction" in event.target && event.target.hasOwnProperty("draggable") && event.target.draggable) {
		event.target.mouseDownAction(this);
		this.stage.reorderRenderObjects();
	}
};

//TODO JAVADOC
Kitchen.prototype.onMouseup = function(event) {
	if("mouseUpAction" in event.target) {
		event.target.mouseUpAction(this);
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

		this.allObjects.forEach(function(object) {
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