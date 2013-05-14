function Plate(context, sx, sy, zOrder, name) {
	VisualRenderObject.call(this, context, sx, sy, 198, 67, "images/platte0.png", zOrder);
	this.setDraggable(false);
	this.name = name;
	this.state = 0;
	this.pot = null;
}

Plate.prototype = Object.create(VisualRenderObject.prototype);
Plate.prototype.constructor = Plate;

Plate.prototype.setState = function(state) {
	this.state = state;
	this.changeImage("images/platte" + state + ".png");
	this.updatePotTemperature();
};

Plate.prototype.setPot = function(pot) {
	this.pot = pot;
};

Plate.prototype.updatePotTemperature = function() {
	if(this.pot != null) {
		if(this.state != 0) {
			this.pot.setGoalTemperature(60 * this.state);
		} else {
			this.pot.setGoalTemperature(this.pot.DEFAULTTEMPERATURE);
		}
	}
};
