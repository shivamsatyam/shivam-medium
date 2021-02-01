const mongoose = require('mongoose')

const signinSchema = new mongoose.Schema({
	
	googleId:{
		type:String
	},
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	image:{
		type:String,
		required:true
	},
	password:{
		type:String
	}
})



module.exports = new mongoose.model('mediumPerson',signinSchema)




































