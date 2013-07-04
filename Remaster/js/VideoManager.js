/**
 * the Video Manager manages the videos ... like a tv ... vm tv ...
 * @constructor
 */
function VideoManager() {
	var kitchenDiv = document.querySelector("#kitchenDiv");

	this.videoDiv = document.createElement("div");
	this.videoDiv.setAttribute("id", "video");
	kitchenDiv.appendChild(this.videoDiv);

	this.videos = [];
	var videoElement;

	videoElement = document.createElement("video");
	videoElement.type = "video/webm";
	videoElement.src = "videos/spaetzle.webm";
	videoElement.controls = false;
	videoElement.loop = true;
	videoElement.preload = true;
	this.videos.push(videoElement);

	videoElement = document.createElement("video");
	videoElement.type = "video/webm";
	videoElement.src = "videos/kritzelkunst.webm";
	videoElement.controls = false;
	videoElement.loop = true;
	videoElement.preload = true;
	this.videos.push(videoElement);

	videoElement = document.createElement("video");
	videoElement.type = "video/webm";
	videoElement.src = "videos/batman.webm";
	videoElement.controls = false;
	videoElement.loop = true;
	videoElement.preload = true;
	this.videos.push(videoElement);

	this.currentVideo = 0;
	this.power = false;
	this.time = Date.now();
}

VideoManager.prototype.constructor = VideoManager;

/**
 * the function will stop all videos
 */
VideoManager.prototype.stopAll = function() {
	this.videoDiv.innerHTML = "";
};

/**
 * the function will switch the video if powered on else it will just change the video that will be displayed on turning the power on
 */
VideoManager.prototype.nextVideo = function() {
	if(this.currentVideo < this.videos.length - 1) {
		this.currentVideo++;
	} else {
		this.currentVideo = 0;
	}

	if(this.power) {
		this.playVideo();
	}
};

/**
 * the function will switch the video if powered on else it will just change the video that will be displayed on turning the power on
 */
VideoManager.prototype.previousVideo = function() {
	if(this.currentVideo !== 0) {
		this.currentVideo--;
	} else {
		this.currentVideo = this.videos.length - 1;
	}

	if(this.power) {
		this.playVideo();
	}
};

/**
 * the function will flip the power state and will either play or stop the videos
 */
VideoManager.prototype.changePower = function() {
	this.power = !this.power;

	if(this.power) {
		this.playVideo();
	} else {
		this.videoDiv.innerHTML = "";
	}
};

/**
 * the function will play the current video if it is loaded
 * via the modulo calculation ti seems like the videos are played in the background and are not paused on turning of the tv ... vm
 */
VideoManager.prototype.playVideo = function() {
	var video = this.videos[this.currentVideo];

	if(video.readyState == 4) {     //Experimental, but it seems to work
		this.videoDiv.innerHTML = "";

		video.currentTime = ((Date.now() - this.time) / 1000) % video.duration; //Experimental

		this.videoDiv.appendChild(video);
		video.play();
	}          //Experimental
};