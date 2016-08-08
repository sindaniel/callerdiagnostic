var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var	db = require('../includes/db');




// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login', { layout: 'other' });
});

// Register User
router.post('/register', function(req, res){


	var name = req.body.name
	var email = req.body.email
	var password = req.body.password
	var password2 = req.body.password2

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){

		res.render('register',{
			errors:errors
		});


	} else {
		
		var hash =  '=)'

		sql = "INSERT INTO `clients` ( `name`, `key`) VALUES (?, ?);";
		db.getConnection(function(err, connection){
			connection.query(sql, [name, hash], function(err, result) {
				sql = "INSERT INTO `users` ( `client_id`, `email`, `password`) VALUES (?, ?, ?);"
				connection.query(sql, [result.insertId, email, password], function(err2, result2) {
					req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/users/login');
				});
			});
			connection.release();
		});
		
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {

	db.getConnection(function(err, connection){
		console.log(username, password)
		sql = "SELECT id, email FROM `users` WHERE `username` = ? AND `password` = ? ";
		connection.query(sql,[username, password], function(err, rows, fields) {

			try {
			    if(rows.length >= 1){
			    	return done(null, rows[0]);
			    }else{
			    	return done(null, false, {message: 'Invalid password'});
			    }
			}
			catch(err) {
			    	return done(null, false, {message: 'Invalid password'});
			}
		
		});
		connection.release();
  	});
  


}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	db.getConnection(function(err, connection){
		//data que va quedar en session
		sql = "SELECT id, username, email FROM `users` WHERE id  = ?";
		connection.query(sql,[id], function(err, rows, fields) {
			done(err, rows[0]);
		});
		connection.release();
  	});
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });


// router.post('/login', function(req, res, next ){
//     passport.authenticate('local', function(err, user, info) {
//     	if (err) { return next(err) }
//     	if (!user) {
//     			req.flash('message', info.message)
//     			res.render('login'); 
//       		//return res.json( { message: info.message})
//       	}else{
//       		res.redirect('/');
      		
//       	}
//     })(req, res, next);   
// });



router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;