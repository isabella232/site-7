var config = require('likeastore-config');
var users = require('./db/users.js');
var subscribers = require('./db/subscribers.js');
var networks = require('./db/networks.js');

module.exports = function (app, passport) {

	var authRedirect = {
		successReturnToOrRedirect: '/setup',
		failureRedirect: '/'
	};

	var notify = function (req, res) {
		subscribers.save(req, function (err) {
			if (err) {
				return res.send(500);
			}
			res.json({ message: 'You have been subscribed successfully!' });
		});
	};

	var localAuth = function (req, res) {
		users.findOrCreateLocal(req.body, function (err, user) {
			if (err) {
				return res.send(500, err);
			}

			var appRedirectUrl = config.applicationUrl + '?email=' + user.email + '&apiToken=' + user.apiToken;

			res.json({ applicationUrl: appRedirectUrl });
		});
	};

	var setupServiceUser = function (req, res) {
		users.setupServiceUser(req.user._id, req.body, function (err) {
			if (err) {
				return res.send(500, err);
			}

			var appRedirectUrl = config.applicationUrl + '?email=' + req.body.email + '&apiToken=' + req.user.apiToken;

			// we don't store facebook as network for now
			if (req.user.provider === 'facebook') {
				return res.json({ applicationUrl: appRedirectUrl });
			}

			networks.save(req.user, function (err, net) {
				if (err) {
					return res.send(500, err);
				}
				return res.json({ applicationUrl: appRedirectUrl });
			});
		});
	};

	app.post('/notify', notify);
	app.post('/auth/setup', setupServiceUser);
	app.post('/auth/local/login', localAuth);
	app.post('/auth/local/register', localAuth);
	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', authRedirect));
	app.get('/auth/github', passport.authenticate('github'));
	app.get('/auth/github/callback', passport.authenticate('github', authRedirect));
	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback', passport.authenticate('facebook', authRedirect));

};
