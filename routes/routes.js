var invitable=require('./invitableRoute.js');

module.exports = function(app, passport) {

	// show homepage
	app.get('/', function(req, res) {
		res.render('index.jade');
	});

	// show login form
	app.get('/login', function(req, res) {
		res.render('login.jade', { message: req.flash('loginMessage') });
	});

	// process login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	// show signup form
	app.get('/signup', function(req, res) {
		res.render('signup.jade', { message: req.flash('signupMessage') });
	});

	// process signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	// show the user's profile
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.jade', {
			user : req.user
		});
	})

	// go to facebook to authenticate the user
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));


	// logout the user
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// get all invitables
	app.get('/invitables', invitable.get);

	// create an invitable
	app.post('/invitables', invitable.create);

	// get an invitable by id
	app.get('/invitables/:event_id', invitable.getSingle);

	// add a user to an invitable queue
	app.get('/invitables/:event_id/:user_name', invitable.addUserToEvent);

};

// route middleware to see if a user is logged in
function isLoggedIn(req, res, next) {

	// if user is logged in, continue
	if (req.isAuthenticated())
		return next();

	// else, send them to home page
	res.redirect('/');
}
