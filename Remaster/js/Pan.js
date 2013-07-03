function Pan(stage, data, restrainer, soundManager) {
	CookContainer.call(this, stage, data, restrainer, soundManager);
}
Pan.prototype = Object.create(CookContainer.prototype);
Pan.prototype.constructor = Pan;

Pan.prototype.selectAnimation = function() {
	var temperatureLevel = this.getTemperatureLevel();
	var state = this.getStatus();

	if(temperatureLevel + state !== this.temperatureState) {
		if(this.temperatureLevel === "default") {
			this.soundManager.playLoop(this.soundManager.POTHEATINGUP);
		}
		if(temperatureLevel === "default") {
			this.soundManager.stopLoop(this.soundManager.POTHEATINGUP);
		}
		this.temperatureLevel = temperatureLevel;
		this.temperatureState = temperatureLevel + state;
		this.changeAnimation(this.temperatureState, true);
	}
};