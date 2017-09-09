//Load Packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user Schema by mongoose
var EmployeeSchema = new Schema({
	name : {
		type : String,
		required: true
	},
	address : {
		type:String,
		require: true
	},
	email: {
		type:String, 
		required:true, 
		index:{unique:true}
	},
	phone : {
		type : Number
	},
	dob : {
		type : Date
	},
	image: {type: Schema.Types.ObjectId, ref: 'Image'}
});


//return the model
module.exports = mongoose.model('Employee',EmployeeSchema);