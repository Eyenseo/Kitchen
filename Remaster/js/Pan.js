/**
 * This object is used for objects that are rather a pan than a pot and a frying sound is used
 * It's a child of CookContainer
 * @param stage - the stage of the Kitchen
 * @param data - Data object obtained from a JSON file
 * @param restrainer - restrainer
 * @param soundManager - soundManager
 * @constructor
 */
function Pan(stage, data, restrainer, soundManager) {
	CookContainer.call(this, stage, data, restrainer, soundManager);
}
Pan.prototype = Object.create(CookContainer.prototype);
Pan.prototype.constructor = Pan;

/**
 * the function is called to update the image/animation to be displayed
 * the function will start and stop the heating sound accordingly to the temperature level
 * @param keepIndex BOOLEAN - if the animation index should be changed or not
 */
Pan.prototype.selectAnimation = function(keepIndex) {
	var temperatureLevel = this.getTemperatureLevel();
	var state = this.getStatus();

	if(temperatureLevel + state !== this.temperatureState) {
		if(this.temperatureLevel === "default") {
			this.soundManager.playLoop(this.soundManager.FIRYING);
		}
		if(temperatureLevel === "default") {
			this.soundManager.stopLoop(this.soundManager.FIRYING);
		}
		this.temperatureLevel = temperatureLevel;
		this.temperatureState = temperatureLevel + state;
		this.changeAnimation(this.temperatureState, true);
	}
};