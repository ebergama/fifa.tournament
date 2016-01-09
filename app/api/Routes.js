module.exports = function(app, passport, newrelic) {
	var index = function (req, res) {
		res.render('index', {user: req.user, newrelic: newrelic});
    };
    app.get('/', index);
	app.get('/templates/:name', function (req, res) {
		res.render(req.params.name, { user: req.user });
	});

	app.get('/auth/google',
		passport.authenticate('google', { scope:
			[ 'https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/userinfo.email' ] }));

	app.get( '/auth/google/callback',
		passport.authenticate( 'google', {
			successRedirect: '/',
			failureRedirect: '/error'
		}));
	
	app.get('/login', function(req, res){
		res.render('login', { user: req.user });
	});
	app.get('/error', function(req, res) {
		res.render('error');
	});
	
	app.get('/account', ensureAuthenticated, function(req, res){
		res.render('account', { user: req.user });
	});

	app.get('/account/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	app.get('/:whatever', index);
	app.get('/:whatever/:whatever2', index);

	// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login');
	}
};