/**
 * This object is the Mascot ...
 * @param context - the context of the stage
 * @param data - Data object obtained from a JSON file
 * @constructor
 */
function Mascot(context, data) {
	VisualRenderObject.call(this, context, data.sx, data.sy, data.w, data.h, data.picture, data.zOrder)
	this.zOrder = this.y + this.height;
}

Mascot.prototype = Object.create(VisualRenderObject.prototype);
Mascot.prototype.constructor = Mascot;