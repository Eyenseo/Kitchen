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

	//Restrainer
	this.restrainer = new Restrainer(this);

	//SoundManager
	this.soundManager = new SoundManager();

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

Kitchen.prototype.makeObjectByName = function(objectName, extra) {
	var objectData = this.jsonHandler.objectByName(objectName);
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
				object = new Ingredient(context, objectData);
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
			case "Pot":
				object = new CookContainer(context, objectData, this.restrainer, this.soundManager);
				break;
			case "Knife":
				object = new Knife(context, objectData);
				break;
			case "Container":
				object = new Container(context, objectData, this.restrainer);
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
	bufferObject = this.makeObjectByName("hotPlateFrontLeft");
	this.makeObjectByName("knob2", bufferObject);
	bufferObject = this.makeObjectByName("hotPlateFrontRight");
	this.makeObjectByName("knob3", bufferObject);
	bufferObject = this.makeObjectByName("hotPlateBackLeft");
	this.makeObjectByName("knob4", bufferObject);
	bufferObject = this.makeObjectByName("hotPlateBackRight");
	this.makeObjectByName("knob5", bufferObject);

	//Create Sink
	this.makeObjectByName("sink", this.jsonHandler.objectByName("water"));
};

Kitchen.prototype.prepareKitchen = function(currentRecipe) {
	var THIS = this;

	currentRecipe.ingredients.forEach(function(objectName) {
		THIS.makeObjectByName(objectName);
	});
	currentRecipe.utensils.forEach(function(objectName) {
		THIS.makeObjectByName(objectName);
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