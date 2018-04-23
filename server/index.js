const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index.js')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const helper = require('./helpers/helpers.js');
const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const path = require('path');

const app = express();


app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('client',path.join(__dirname,'views'))

app.use(express.static(path.join(__dirname,'/views')))
app.use(express.static(__dirname + '/../node_modules'));

app.use(bodyParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())





app.use(session({
	secret: 'shhh, it\'s aa secret',
	resave : false,
	saveUninitialized:true,
	unset: 'destroy'
}));

app.get('/', function (req, res) {
	res.render('index.html')

});


app.get('/index1',function (req, res) {

	
	if(helper.isLoggedIn(req)){
		res.render("index1")
	}
	else{
		res.render("index")
	}

})
;


app.get('/', function (req, res) {
	res.render('singleChat.html')
	
});

app.get('/', function (req, res) {
	res.render('groupChat.html')
	
});


app.post('/signin', function(req,res) {
	
	var username = req.body.username;
	var password = req.body.password;
	console.log(username)

	db.User.findOne({user:username},function(err,user){
		if (err){console.log(err)}
			else if(!user){res.status(404).send('user is not found')}
				else{
					helper.comparePassword(password,function(match){
						if(match){

							helper.createSession(req,res,user)
						}else{
							res.redirect('/signin')
						}
					})
				}
			})



});



app.post('/signup', function(req,res) {
	var name = req.body.username
	var password = req.body.password
	var email = req.body.email


	var obj = {'user':name , 'password':password,'email':email}

	
	db.User.findOne({user:name},function(err,user){
		if (err){console.log(err)}
			else if(name=== "" || name === null || name === undefined){
				res.status(404).send('enter a valid name')	
			}
			else if(!user){
				helper.hash(obj)
				helper.createSession(req,res,user)
				
			}

			else{
				res.status(404).send('username is used')
			}



		})

});




app.get('/logout', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/');
	});
})






var port = process.env.PORT || 4568;

app.listen(port, function() {
	console.log('listening on port 3000!');
});