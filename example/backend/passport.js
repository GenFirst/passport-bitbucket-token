'use strict';

var passport = require('passport'),
  BitbucketTokenStrategy = require('passport-bitbucket-token'),
  User = require('mongoose').model('User');

module.exports = function () {

  passport.use(new BitbucketTokenStrategy({
      clientID: 'app-id',
      clientSecret: 'secrete'
    },
    function (accessToken, refreshToken, profile, done) {
      User.upsertUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
      });
    }));

};
