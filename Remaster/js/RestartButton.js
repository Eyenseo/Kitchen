/**
 * This object is a button that will restart the kitchen if clicked
 * @param context - context object - the 2d context of the canvas
 * @param data - Data object obtained from a JSON file
 * @constructor
 */
function RestartButton(context, data) {
	Button.call(this, context, data);
}

RestartButton.prototype = Object.create(Button.prototype);
RestartButton.prototype.constructor = RestartButton;

/**
 * the function will stop and restart the kitchen
 * @param kitchen - the kitchen
 */
RestartButton.prototype.clickAction = function(kitchen) {
	kitchen.finisched = true;
	kitchen.restart();
};
