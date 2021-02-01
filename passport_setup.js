const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('./signin_schema.js')
const mongoose = require('mongoose')


passport.serializeUser(function (user,done) {
	done(null,user.id)
})

passport.deserializeUser(function (id,done) {
	User.findById(id).then((user)=>{
		done(null,user)
	}).catch(()=>{
		console.log('error')
	})
})

passport.use(new GoogleStrategy({
	clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback:true
},function (request,accessToken,refreshToken,profile,done) {
	console.log(profile)
	User.findOne({googleId:profile.id}).then((currentUser)=>{
		if (currentUser) {
			done(null,currentUser)
		}else{
			new User({
				googleId:profile.id,
				name:profile.displayName,
				email:profile.emails[0].value,
				image:profile.picture
			}).save().then((newUser)=>{
				done(null,newUser)
			})
		}
	})
}))
























