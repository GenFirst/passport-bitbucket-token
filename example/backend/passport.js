'use strict';

var passport = require('passport'),
  BitbucketTokenStrategy = require('../../lib/index'),
  User = require('mongoose').model('User');

module.exports = function () {

  passport.use(new BitbucketTokenStrategy({
      clientID: 'app-id',
      clientSecret: 'client-secret',
      apiVersion: '1.0',
      profileWithEmail: true
    },
    function (accessToken, refreshToken, profile, done) {
      User.upsertUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
      });
    }));

};
