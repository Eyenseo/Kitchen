function ForwardButton(context, data) {
	Button.call(this, context, data);
}

ForwardButton.prototype = Object.create(Button.prototype);
ForwardButton.prototype.constructor = ForwardButton;

ForwardButton.prototype.clickAction = function(kitchen) {
	kitchen.videoManager.nextVideo();
};