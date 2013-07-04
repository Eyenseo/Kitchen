/**
 * This object is a button that will select the next video of the videoManager
 * @param context - context object - the 2d context of the canvas
 * @param data - Data object obtained from a JSON file
 * @constructor
 */
function ForwardButton(context, data) {
	Button.call(this, context, data);
}

ForwardButton.prototype = Object.create(Button.prototype);
ForwardButton.prototype.constructor = ForwardButton;

/**
 * the function will select the next video of the video manager from the kitchen
 * @param kitchen - the kitchen
 */
ForwardButton.prototype.clickAction = function(kitchen) {
	kitchen.videoManager.nextVideo();
};