//TODO Doc
function Bowl(context, data) {
	ContainerStuff.call(this, context, data);
	this.setHitZone(11, 9, 95, 22);
}

Bowl.prototype = Object.create(ContainerStuff.prototype);
Bowl.prototype.constructor = Bowl;