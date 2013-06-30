function BakingTin(context, data) {
	ContainerStuff.call(this, context, data);
}

BakingTin.prototype = Object.create(ContainerStuff.prototype);
BakingTin.prototype.constructor = BakingTin;
