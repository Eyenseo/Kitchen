function Sieve(context, data, restrainer) {
	Container.call(this, context, data, restrainer);
}
Sieve.prototype = Object.create(Container.prototype);
Sieve.prototype.constructor = Sieve;

Sieve.prototype.addContent = function(object) {
	if((object instanceof Ingredient || object instanceof  Container) &&
	   this.restrainer.checkPutRequest(this, object)) {
		this.content.push(object);
		this.selectAnimation(false);
	}
};

Sieve.prototype.linkObjects = function(object, kitchen) {
	var THIS = this;
	console.log("Sieve");
	this.PHY_linkObjects(object, kitchen);

	if(object instanceof Container) {
		this.content.forEach(function(content) {
			if(THIS.restrainer.checkPutRequest(object, content, true)) {
				if(!content.liquid) {
					console.log("Sieve: Put " + content.name + " in: " + object.name);
					object.addContent(content);
					THIS.removeContent(content);
				}
			} else if(content.liquid) {
				THIS.removeContent(content);
			}
		});
	}
};