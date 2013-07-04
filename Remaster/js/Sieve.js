function Sieve(stage, data, restrainer, soundManager) {
	Container.call(this, stage, data, restrainer);
	this.soundManager = soundManager;
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

Sieve.prototype.linkObjects = function(object) {
	var added = false;
	var THIS = this;

	console.log("Sieve");
	this.PHY_linkObjects(object);

	if(object instanceof Container) {
		this.content.forEach(function(content) {
			if(THIS.restrainer.checkPutRequest(object, content, true)) {
				if(!content.tiny) {
					console.log("Sieve: Put " + content.name + " in: " + object.name);
					object.addContent(content);
					THIS.removeContent(content);
					added = true;
				}
			} else if(content.tiny) {
				THIS.removeContent(content);
			}
			this.selectAnimation(false);
		});
	}

	if(added) {
		this.soundManager.play(this.soundManager.DROP);
	}
};