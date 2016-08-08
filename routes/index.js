var express = require('express')
var router = express.Router()
var AMI = require('yana')


var ami = new AMI({
  port: 5038,
  host: '10.1.10.5',
  login: 'myasterisk',
  password: 'mycode',
  events: true,
  reconnect: true
}) 
ami.connect(function () {
	console.log('Connected to AMI')
})

// middleware ensureAuthenticated
// Get Homepage
router.get('/', function(req, res){
	user = req.user || false
	res.render('index',{user: user})
});





router.get('/calls', function(req, res){
	calls = []

	new Promise(function(done){
		ami.send({
		  Action: 'CoreShowChannels'
		}, function (res2) {
				//console.log(res2.ApplicationData)
			if(res2.ApplicationData == 'menu_principal.php'){					
				calls.push(res2)
			}
			setTimeout(function(){	
				done();
			}, 1000)
		})

	}).then(function(){	
		res.json(calls)
	})

});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;