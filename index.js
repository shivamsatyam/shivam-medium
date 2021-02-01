require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const passport = require('passport');
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const addPostSchema = require('./addPostSchema')
const bodyParser = require('body-parser')

require('./passport_setup');

app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
const static_path = path.join(__dirname,'public')
app.use(express.static(static_path))
app.use(bodyParser.urlencoded({extended:false}))

mongoose.connect('mongodb://localhost:27017/medium',{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
	console.log('the connection is succesfully established')
})


const isLoggedIn = (req,res,next)=>{
	if (req.user) {
		next();
	}else{
		res.redirect('/signin')
	}
}

//initializing the passport js
app.use(passport.initialize());
app.use(passport.session());


app.get('/',isLoggedIn,(req,res)=>{
	console.log('the user is ',req.user)
	addPostSchema.find({views:{$gte:0}}).then((data)=>{
	res.render('index',{data:data})

	})
})

app.get('/good',(req,res)=>{
	res.redirect('/your')
})

app.get('/failed',(req,res)=>{
	res.render('your')
})


//the real passport js google authentication work
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

app.get('/signin',(req,res)=>{
	res.render('signin')
})

app.get('/post',(req,res)=>{
	res.render('post')
})

app.post('/post',(req,res)=>{
	console.log(req.body)
	const topic = req.body.topic
	const content = req.body.content
	if (req.user) {
		new addPostSchema({
			googleId:req.user.googleId,
			name:req.user.name,
			email:req.user.email,
			photo:req.user.image,
			topic:req.body.topic,
			message:req.body.content
		}).save((err)=>{
			if (err) {
				throw err;
			}else{
				res.redirect('/your')
			}
		})
	}else{
		res.redirect('/')
	}
})

app.get('/your',(req,res)=>{
	if (req.user) {
		addPostSchema.find({email:req.user.email}).then((data)=>{
			res.render('your',{data:data,author:req.user})
		})
	}else{
		res.redirect('/signin')
	}
})

const updateDocument = async(id,views)=>{
	try {
		// const update = await compiledModel.updateOne({_id:id},{$set:{name:"Commando three"}})
		// another method of doing this
		const update = await addPostSchema.findByIdAndUpdate({_id:id},{
			$set:{
				views:views+1
			}
		},{
			//for showing the new value
			/*new:true,*/
			useFindAndModify:false
		})

		console.log(update)
	} catch(e) {
		
		console.log('Some error occured at update document '+e);
	}
}

app.get('/:id',(req,res)=>{
	try {
		
	const id = req.params.id
	let views = 0
addPostSchema.find({_id:req.params.id}).then((data)=>{
			
			updateDocument(req.params.id,data[0].views)
			res.render('show',{data:data[0]})
		
	}).catch((err)=>{
		console.log('some error occured')
	})


	} catch(e) {
		
		console.log('error');
	}
})




app.listen('5000',()=>{
	console.log('the app is running')
})























