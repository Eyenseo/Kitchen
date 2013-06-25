function Bowl(context, data) {
	ContainerUtensil.call(this, context, data);
	this.setHitZone(11, 9, 95, 22);
}

Bowl.prototype = Object.create(ContainerUtensil.prototype);
Bowl.prototype.constructor = Bowl;