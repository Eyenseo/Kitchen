function PowerButton(context, data) {
	Button.call(this, context, data);
}

PowerButton.prototype = Object.create(Button.prototype);
PowerButton.prototype.constructor = PowerButton;

PowerButton.prototype.clickAction = function(kitchen) {
	kitchen.videoManager.changePower();
};