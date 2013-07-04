/**
 * This object is the Button of the videoManager(TV) and change the power state
 * @param context - the context of the stage
 * @param data - Data object obtained from a JSON file
 * @constructor
 */
function PowerButton(context, data) {
	Button.call(this, context, data);
}

PowerButton.prototype = Object.create(Button.prototype);
PowerButton.prototype.constructor = PowerButton;

/**
 * the function will change the state of the videoManager
 * @param kitchen - the kitchen
 */
PowerButton.prototype.clickAction = function(kitchen) {
	kitchen.videoManager.changePower();
};