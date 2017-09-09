//Load Packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user Schema by mongoose
var ImageSchema = new Schema({
	image : { data: Buffer, contentType: String },
	imageName : {type: String}
});


//return the model
module.exports = mongoose.model('Image', ImageSchema);