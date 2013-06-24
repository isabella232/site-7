describe('github authenticate flow #github #e2e', function () {
	var config = require('likeastore-config');
	var should = require('should');
	var Browser = require('zombie');
	var browser;

	before(function () {
		browser = new Browser();
		browser.silent = true;
	});

	describe('when user is on login page', function () {
		before(function (done) {
			browser.visit(config.siteUrl, function () {
				done();
			});
		});

		before(function (done) {
			browser.clickLink('.login-btn', function () {
				done();
			});
		});

		it('should have github auth link', function () {
			browser.query('.github').should.be.ok;
		});

		describe('when user clicks github auth link', function () {
			before(function (done) {
				browser.clickLink('.github', function () {
					done();
				});
			});

			it('should redirect to github login site', function () {
				browser.location.href.should.include('https://github.com/login');
			});

			describe('when user submits valid github credentials', function () {
				before(function (done) {
					browser
						.fill('login', 'likeman')
						.fill('password', 'likeman7')
						.pressButton('commit', function () {
							done();
						});
				});

				it('should redirect to setup', function () {
					browser.location.href.should.include(config.siteUrl + '/setup');
				});
			});
		});
	});

	after(function () {
		browser.close();
	});
});