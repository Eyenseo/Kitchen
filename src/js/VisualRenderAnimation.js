/**
 *represents an object to be rendered with an animation on the stage
 * @param context - context object - the 2d context of the canvas
 * @param sx Number - the start x position
 * @param sy Number - the start y position
 * @param w Number - the width of the object
 * @param h Number - the height of the object
 * @param imgPath - the path of the image
 * @param zOrder - the order to be drawn on stage
 * @param aniObject - holds all needed information for the animation:
 *      Source Image:
 *          The tile number is counted from top left to right bottom, one row is one sequence:
 *            ___ ___ ___ ___
 *           |   |   |   |   |      |
 *           | 0 | 1 | 2 | 3 |      |
 *           |___|___|___|___|      | 360
 *           |   |   |   |   | |    |
 *           | 4 | 5 | 6 | 7 | |180 |
 *           |___|___|___|___| |    |
 *                        ___
 *                        160
 *           ________________
 *                  640
 *
 *      aniObject:
 *          seq - is the sequence of the tiles that will be shown
 *
 *           var aniObject = {
 *		  		"image"     : {
 *		  			"tileWidth" : 160,
 *		  			"tileHeight": 180,
 *		  			"imgWidth"  : 640,
 *		  			"imgHeight" : 360
 *		  		},
 *		  		"animations": {
 *		  			"default": {
 *		  				"seq" : [0],
 *		  				"loop": false
 *		  			},
 *		  			"Abc"   : {
 *		  				"seq" : [0],
 *		  				"loop": false
 *		  			},
 *		  			"XYZ": {
 *		  				"seq" : [1, 2, 3, 3, 2],
 *		  				"loop": true
 *		  			},
 *		  		    ...
 *		  		}
 *		  	};
 */
function VisualRenderAnimation(context, sx, sy, w, h, imgPath, zOrder, aniObject) {
	VisualRenderObject.call(this, context, sx, sy, w, h, imgPath, zOrder);

	this.animations = aniObject.animations;

	this.tileWidth = aniObject.image.tileWidth || w;
	this.tileHeight = aniObject.image.tileHeight || h;

	// needed for the calculation of the x, y coordinate for one tile
	this.maxCols = aniObject.image.imgWidth / this.tileWidth || 1;
	// Not needed ...
	// this.maxRows = aniObject.image.imgHeight / this.tileHeight || 1;

	this.currentAnimation = this.animations["default"].seq || [0];
	this.currentAniIndex = 0;

	this.loop = this.animations["default"].loop || false;

	this.lastSpriteUpdateTime = 0;
	this.aniInterval = 170;
}

VisualRenderAnimation.prototype = Object.create(VisualRenderObject.prototype);
VisualRenderAnimation.prototype.constructor = VisualRenderAnimation;

/**
 * Change current animation
 * @param name Name of the new animation specified in the aniObject from the constructor that shall be rendered next
 */
VisualRenderAnimation.prototype.changeAnimation = function(name) {
	try {
		this.currentAnimation = this.animations[name].seq;
		this.loop = this.animations[name].loop;
		this.currentAniIndex = 0;
	} catch(e) {
		console.log("There is no animation named:" + name);
		//TODO Stop Script !
	}
};

/**
 * calculate the next tile for the current animation
 */
VisualRenderAnimation.prototype.nextAniTile = function() {
	if(this.currentAniIndex + 1 < this.currentAnimation.length) {
		this.currentAniIndex++;
	} else if(this.loop) {
		this.currentAniIndex = 0;
	}
};

/**
 * Override! NO rotation
 * Draw this object to the canvas.
 */
VisualRenderAnimation.prototype.draw = function() {
	// which col and row is the tile to render in
	var col = parseInt(this.currentAnimation[this.currentAniIndex] % this.maxCols);
	var row = parseInt(this.currentAnimation[this.currentAniIndex] / this.maxCols);

	// calculate x, yp position
	var imgX = col * this.tileWidth;
	var imgY = row * this.tileHeight;

	// draw
	this.context.drawImage(this.img, imgX, imgY, this.tileWidth, this.tileHeight, this.x, this.y, this.width, this.height);

	var time = Date.now();
	if(this.lastSpriteUpdateTime < time - this.aniInterval) {
		this.nextAniTile();
		this.lastSpriteUpdateTime = time;
	}
};