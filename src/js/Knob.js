function Knob(context, sx, sy, zOrder, name, plate) {
	VisualRenderObject.call(this, context, sx, sy, 58, 58, "images/knob.png", zOrder);
	this.setDraggable(false);
	this.name = name;
	this.plate = plate;
	this.state = 0;
}

Knob.prototype = new VisualRenderObject();
Knob.prototype.constructor = Knob;

Knob.prototype.changeState = function() {
	switch(this.state) {
		case 0:
			this.state = 1;
			this.setRotation(90);
			break;
		case 1:
			this.state = 2;
			this.setRotation(180);
			break;
		case 2:
			this.state = 3;
			this.setRotation(270);
			break;
		case 3:
			this.state = 0;
			this.setRotation(0);
	}
	this.plate.setState(this.state);
};
