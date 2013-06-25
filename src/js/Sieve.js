function Sieve(context, data) {
	ContainerUtensil.call(this, context, data);
	//	this.setHitZone(0, 0, 0, 0);
}

Sieve.prototype = Object.create(ContainerUtensil.prototype);
Sieve.prototype.constructor = Sieve;
