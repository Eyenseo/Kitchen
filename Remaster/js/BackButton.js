function BackButton(context, data) {
	Button.call(this, context, data);
}

BackButton.prototype = Object.create(Button.prototype);
BackButton.prototype.constructor = BackButton;

BackButton.prototype.clickAction = function(kitchen) {
	kitchen.videoManager.previousVideo();
};