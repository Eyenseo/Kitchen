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

VideoManager.prototype.stopAll = function() {
	this.videoDiv.innerHTML = "";
};

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

VideoManager.prototype.changePower = function() {
	this.power = !this.power;

	if(this.power) {
		this.playVideo();
	} else {
		this.videoDiv.innerHTML = "";
	}
};

VideoManager.prototype.playVideo = function() {
	var video = this.videos[this.currentVideo];

	if(video.readyState == 4) {     //Experimental
		this.videoDiv.innerHTML = "";

		video.currentTime = ((Date.now() - this.time) / 1000) % video.duration; //Experimental

		this.videoDiv.appendChild(video);
		video.play();
	}          //Experimental
};