const mongoose = require('mongoose')

const addPostSchema = new mongoose.Schema({
	googleId:{
		type:String,
		required:true		
	},
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	photo:{
		type:String,
		required:true
	},
	topic:{
		type:String,
		required:true
	},
	message:{
		type:String,
		required:true		
	},
	views:{
		type:Number,
		default:0
	},
	textMessage:{
		type:Number,
		default:0
	}
})




module.exports = new mongoose.model('message',addPostSchema)





