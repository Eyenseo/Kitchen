/**
 * This object is a button that will select the previous video of the videoManager
 * @param context - context object - the 2d context of the canvas
 * @param data - Data object obtained from a JSON file
 * @constructor
 */
function BackButton(context, data) {
	Button.call(this, context, data);
}

BackButton.prototype = Object.create(Button.prototype);
BackButton.prototype.constructor = BackButton;

/**
 * the function will select the previous video of the video manager from the kitchen
 * @param kitchen - the kitchen
 */
BackButton.prototype.clickAction = function(kitchen) {
	kitchen.videoManager.previousVideo();
};