function Kitchen(canvasId) {

	// get the right requestAnimationFrame for this browser
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	// apply the right animation frame to the window object
	window.requestAnimationFrame = requestAnimationFrame;

	// create a new stage object
	this.stage = new Stage(canvasId);

	//create Objects

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

	//Pot
	this.pots = [];
	var pot1 = new Pot(this.stage.getContext(), 300, 100, 242, 187, "images/pot.png", 100, true, "Pot One", 0.002, this.soundManager);
	var pot2 = new Pot(this.stage.getContext(), 300, 100, 242, 187, "images/pot.png", 100, true, "Pot Two", 0.002, this.soundManager);

	this.pots.push(pot1);
	this.pots.push(pot2);

	this.stage.addToStage(pot1);
	this.stage.addToStage(pot2);

	//ingredients
	this.ingredients = [];
	var nudel = new Ingredient(this.stage.getContext(), 15, 80, 165, 54, "images/nudel.png", 111, true, "Nudel", 0.001);
	var water = new Ingredient(this.stage.getContext(), 20, 85, 86, 150, "images/water.png", 111, true, "Wasser", 0.00125);
	var oil = new Ingredient(this.stage.getContext(), 25, 90, 87, 350, "images/oil.png", 111, true, "Öl", 0.001);
	var fleisch = new Ingredient(this.stage.getContext(), 25, 90, 100, 100, "images/fleisch.png", 111, true, "Fleisch", 0.0008);
	var karotte = new Ingredient(this.stage.getContext(), 25, 90, 100, 100, "images/karotte.png", 111, true, "Karotte", 0.002);
	var pilze = new Ingredient(this.stage.getContext(), 25, 90, 100, 100, "images/pilze.png", 111, true, "Pilze", 0.0008);

	this.ingredients.push(nudel);
	this.ingredients.push(water);
	this.ingredients.push(oil);
	this.ingredients.push(fleisch);
	this.ingredients.push(karotte);
	this.ingredients.push(pilze);

	this.stage.addToStage(nudel);
	this.stage.addToStage(water);
	this.stage.addToStage(oil);
	this.stage.addToStage(fleisch);
	this.stage.addToStage(karotte);
	this.stage.addToStage(pilze);

	//event stuff
	this.stage.registerEvent('click', this);
	this.stage.registerEvent('dragend', this);
	this.stage.registerEvent('dragstart', this);

	// start the animation loop
	// parameter this (kitchen itself) needed, because of the closure within the run function
	this.run(this);
}

//Event handler
Kitchen.prototype.onClick = function(event) {
	var kitchen = this;
	if(event.target instanceof Knob) {
		event.target.changeState();
		kitchen.soundManager.play(kitchen.soundManager.KNOB);
	}
};

Kitchen.prototype.onDragend = function(event) {
	//console.log(event.target);
	var kitchen = this;
	if(event.target instanceof Ingredient) {
		var ingredinentCenterX = event.target.getCenter().cx;
		var ingredinentCenterY = event.target.getCenter().cy;

		this.pots.forEach(function(pot) {
			var zone = pot.getHitZone();
			if(ingredinentCenterX >= zone.hx && ingredinentCenterY >= zone.hy && ingredinentCenterX <= zone.hx + zone.hw && ingredinentCenterY <= zone.hy + zone.hh) {
				pot.addPotContent(event.target);
				kitchen.stage.removeFromStage(event.target);
				kitchen.soundManager.play(kitchen.soundManager.DROP);
			}
		});
	} else if(event.target instanceof Pot) {
		var plateCenterX = event.target.getBottomCenter().cx;
		var plateCenterY = event.target.getBottomCenter().cy;
		this.plates.forEach(function(plate) {
			var zone = plate.getHitZone();
			if(plateCenterX >= zone.hx && plateCenterY >= zone.hy && plateCenterX <= zone.hx + zone.hw && plateCenterY <= zone.hy + zone.hh) {
				plate.setPot(event.target);
				event.target.setPlate(plate);
				plate.updatePotTemperature();

				kitchen.soundManager.play(kitchen.soundManager.POTONTOSTOVE);
			}
		});
	}
};

Kitchen.prototype.onDragstart = function(event) {
	if(event.target instanceof Pot) {
		if(event.target.plate != null) {
			event.target.plate.setPot(null);
			event.target.plate = null;
		}
		event.target.setGoalTemperature(event.target.DEFAULTTEMPERATURE);
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