function RestartButton(context, data) {
	Button.call(this, context, data);
}

RestartButton.prototype = Object.create(Button.prototype);
RestartButton.prototype.constructor = RestartButton;

RestartButton.prototype.clickAction = function(kitchen) {
	kitchen.finisched = true;
	kitchen.restart();
};
