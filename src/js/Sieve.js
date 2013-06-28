function Sieve(context, data) {
	ContainerStuff.call(this, context, data);
	//	this.setHitZone(0, 0, 0, 0);
}

Sieve.prototype = Object.create(ContainerStuff.prototype);
Sieve.prototype.constructor = Sieve;
