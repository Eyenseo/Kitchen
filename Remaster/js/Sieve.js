/**
 * This object does what a sieve does
 * It's a child of Container
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @param soundManager - soundManager
 * @constructor
 */
function Sieve(stage, data, restrainer, soundManager) {
	Container.call(this, stage, data, restrainer);
	this.soundManager = soundManager;
}
Sieve.prototype = Object.create(Container.prototype);
Sieve.prototype.constructor = Sieve;

/**
 * function to add a object to the content array - if the object is appropriated
 * the function will update the image/animation
 * @param object - object to be added
 */
Sieve.prototype.addContent = function(object) {
	if((object instanceof Ingredient || object instanceof  Container) &&
	   this.restrainer.checkPutRequest(this, object, false)) {
		this.content.push(object);
		this.selectAnimation(false);
	}
};

/**
 * the function is the overridden function of the parent
 * the function will check if this and the object will do more than just connect
 * if the object is a Container and the restrainer allows it, this content will be put into the objects
 * the function will update the image/animation
 * the function will play a drop sound
 *  @param object PhysicalThing - object to connect with
 */
Sieve.prototype.linkObjects = function(object) {
	var added = false;
	var THIS = this;

	//	console.log("Sieve");//DEBUG
	this.PHY_linkObjects(object);

	if(object instanceof Container) {
		this.content.forEach(function(content) {
			if(THIS.restrainer.checkPutRequest(object, content, true)) {
				if(!content.tiny) {
					//					console.log("Sieve: Put " + content.name + " in: " + object.name);//DEBUG
					object.addContent(content);
					THIS.removeContent(content);
					added = true;
				}
			} else if(content.tiny) {
				THIS.removeContent(content);
			}
			THIS.selectAnimation(false);
		});
	}

	if(added) {
		this.soundManager.play(this.soundManager.DROP);
	}
};