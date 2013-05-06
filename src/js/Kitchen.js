function Kitchen(canvasId){
	
	// get the right requestAnimationFrame for this browser
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	// apply the right animation frame to the window object
	window.requestAnimationFrame = requestAnimationFrame;
	
	// create a new stage object
	this.stage = new Stage(canvasId);
	
	
	//create Objects
	
	//Pot
	this.pots = [];
	var p1 = new Pot(this.stage.getContext(),300,100, 242,187, "images/pot.png", 100, true, "BigPot");
	this.pots.push(p1);
	this.stage.addToStage(p1);
	
	//ingredients
	this.ingredients = [];
	var nudel = new Ingredient(this.stage.getContext(), 15,80, 165,54, "images/nudel.png", 111, true, "Nudel");
	var water = new Ingredient(this.stage.getContext(), 20,85, 86,150, "images/water.png", 111, true, "Wasser");
	var oil = new Ingredient(this.stage.getContext(), 25,90, 87,350, "images/oil.png", 111, true, "Öl");
	
	this.ingredients.push(nudel);
	this.ingredients.push(water);
	this.ingredients.push(oil);
	
	this.stage.addToStage(nudel);
	this.stage.addToStage(water);
	this.stage.addToStage(oil);
	
	//event stuff
	this.stage.registerEvent('click', this);
	this.stage.registerEvent('dragend', this);
	
	// start the animation loop
	// parameter this (kitchen itself) needed, because of the closure within the run function
	this.run(this);
}


//Event handler
Kitchen.prototype.onClick = function(event){
	 console.log(event.target);
}

Kitchen.prototype.onDragend = function(event) {
	//console.log(event.target);
	if(event.target instanceof Ingredient) {
		var ingredinentCenterX = event.target.getCenter().cx;
		var ingredinentCenterY = event.target.getCenter().cy;
		var kitchen = this;
		
		this.pots.forEach(function (pot) {
		var zone = pot.getHitZone();
			if(ingredinentCenterX >= zone.hx &&
			   ingredinentCenterY >= zone.hy &&
			   ingredinentCenterX <= zone.hx + zone.hw &&
			   ingredinentCenterY <= zone.hy + zone.hh) {
				pot.addPotContent(event.target);
				kitchen.stage.removeFromStage(event.target);
			}
		});
	}
}




/**
 * Animation loop
 * @param kit the kitchen object
 */
Kitchen.prototype.run = function(kit) {
	
	// update the objects (Plate, Knob, ...)
	
	
	// Always render after the updates
	kit.stage.render();
	// keep the loop going
	window.requestAnimationFrame(function(){ kit.run(kit);});
	
}





