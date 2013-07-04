function PhysicalThing(stage, data, restrainer) {
	VisualRenderAnimation.call(this, stage.getContext(), data);

	//Various attributes
	this.name = data.name;
	this.type = data.type;
	this.restrainer = restrainer;
	this.linkedObjects = [];

	//zOrder and Dragging
	if(data.zOrder === true) {
		this.draggable = true;
		this.zOrder = this.y + this.height;
	} else {
		this.draggable = false;
		this.zOrder = data.zOrder;
	}
	this.falling = false;

	//Temperature attributes
	this.DEFAULTTEMP = 24;
	this.temperature = this.DEFAULTTEMP;
	this.actionValue = data.actionValue / 2;

	//AnimationS stuff
	this.hover = false;

	this.stage = stage;
	this.onStage = true;
}
PhysicalThing.prototype = Object.create(VisualRenderAnimation.prototype);
PhysicalThing.prototype.constructor = PhysicalThing;

PhysicalThing.prototype.updateTemperature = function(temperature) {
	if(temperature === undefined) {
		temperature = this.DEFAULTTEMP;
	}

	if(this.temperature !== temperature) {
		if(this.temperature < temperature) {
			this.temperature = this.temperature + temperature * this.actionValue;
			if(this.temperature >= temperature) {
				this.temperature = temperature;
			}
		} else {
			this.temperature = this.temperature - temperature * this.actionValue * 4;
			if(this.temperature <= temperature) {
				this.temperature = temperature;
			}
		}
	}
};

PhysicalThing.prototype.selectAnimation = function(keepIndex) {
	var anim = "default";

	if(this.hover) {
		anim += "Hover";
	}
	this.changeAnimation(anim, keepIndex);
};

PhysicalThing.prototype.mouseOverAction = function(kitchen) {
	this.hover = true;
	this.selectAnimation(true);
};

PhysicalThing.prototype.mouseOutAction = function(kitchen) {
	this.hover = false;
	this.selectAnimation(true);
};

PhysicalThing.prototype.mouseDownAction = function(kitchen) {
	if(this.draggable) {
		this.falling = false;
		this.zOrder = kitchen.maxIndex;
	}
	var THIS = this;
	this.linkedObjects.forEach(function(object) {
		object.removeLinkedObject(THIS);
	});
	this.linkedObjects = [];
};

PhysicalThing.prototype.mouseUpAction = function(kitchen) {
	if(this.draggable) {
		this.checkFalling(kitchen);
		if(!this.falling) {
			this.zOrder = this.y + this.height;
		}
	}
};

PhysicalThing.prototype.action = function(kitchen) {
	if(this.falling) {
		this.y += 2;
		this.checkFalling(kitchen);
	}

	var onPlate = false;
	this.linkedObjects.forEach(function(object) {
		if(!onPlate && object instanceof Plate) {
			onPlate = true;
		}
	});
	if(!onPlate) {
		this.updateTemperature(this.DEFAULTTEMP);
	}
};

PhysicalThing.prototype.dragEndAction = function(kitchen) {
	var THIS = this;
	var bottomObject = this.getBottomCenter();
	var bottom = bottomObject.cy - 10; //for the glow
	var left = bottomObject.cx - this.width / 8 - 10;
	var right = bottomObject.cx + this.width / 8 - 10;
	var objectsUnder = [];

	kitchen.allObjects.forEach(function(object) {
		if(object instanceof PhysicalThing && !(object instanceof Knife) && object !== THIS) {
			var zone = object.getHitZone();
			if(right >= zone.hx && bottom >= zone.hy && left <= zone.hx + zone.hw && bottom <= zone.hy + zone.hh) {
				objectsUnder.push(object);
			}
		}
	});

	objectsUnder.forEach(function(object) {
		if(object instanceof Oven || object instanceof Cupboard) {
			//			console.log("Physical: check Oven and Cupboard");//DEBUG
			if((!object.open && !THIS.stage._checkTransparency({ x: bottomObject.cx, y: bottomObject.cy }, object))) {
				THIS.linkObjects(object);
			}
		} else {
			THIS.linkObjects(object);
		}
	});
};

PhysicalThing.prototype.linkObjects = function(object) {
	if(object instanceof PhysicalThing) {
		//		console.log("Physical: Check Link from: " + this.name + " with: " + object.name);//DEBUG
		object.addLinkedObject(this);
		this.addLinkedObject(object);
	}
};

PhysicalThing.prototype.addLinkedObject = function(object) {
	//	console.log("Physical: Link " + this.name + " with: " + object.name);//DEBUG

	this.linkedObjects.push(object);
};

PhysicalThing.prototype.removeLinkedObject = function(object) {
	var array = [];

	this.linkedObjects.forEach(function(linkedObject) {
		if(object !== linkedObject) {
			array.push(linkedObject);
		} else {
		}
	});

	this.linkedObjects = array;
};

PhysicalThing.prototype.safeAddToStage = function() {
	if(!this.onStage) {
		this.stage.addToStage(this);
		this.onStage = true;
	}
};

PhysicalThing.prototype.safeRemoveFromStage = function() {
	if(this.onStage) {
		this.stage.removeFromStage(this);
		this.onStage = false;
	}
};

PhysicalThing.prototype.checkFalling = function(kitchen) {
	var THIS = this;
	var random = Math.random();
	var bottomObject = this.getBottomCenter();
	var bottom = bottomObject.cy - 10; //for the glow
	var left = bottomObject.cx - this.width / 2;
	var right = bottomObject.cx + this.width / 2;

	var variation;
	var falling = true;

	kitchen.collisionBoxes.forEach(function(box) {
		variation = random * (box.h - box.h / 3) + box.h / 3;

		if(!THIS.falling) {
			if(right >= box.x && bottom >= box.y && left <= box.x + box.w && bottom <= box.y + box.h) {
				falling = false;
			}
		} else {
			if(right >= box.x && bottom >= box.y + variation && left <= box.x + box.w && bottom <= box.y + box.h) {
				falling = false;
			}
		}
	});
	if(this.falling !== falling) {
		this.falling = falling;
		if(this.falling) {
			this.zOrder = kitchen.maxIndex - 1;
		} else {
			this.zOrder = this.y + this.height;
			this.dragEndAction(kitchen);
		}
		kitchen.stage.reorderRenderObjects();
	}

};
