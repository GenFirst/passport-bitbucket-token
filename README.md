# passport-bitbucket-token

[![NPM](https://nodei.co/npm/passport-bitbucket-token.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/passport-bitbucket-token/)

[![Build Status](https://travis-ci.org/GenFirst/passport-bitbucket-token.svg?branch=master)](https://travis-ci.org/GenFirst/passport-bitbucket-token)
[![Coverage Status](https://coveralls.io/repos/github/GenFirst/passport-bitbucket-token/badge.svg?branch=master)](https://coveralls.io/github/GenFirst/passport-bitbucket-token?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/GenFirst/passport-bitbucket-token.svg)](https://gemnasium.com/github.com/GenFirst/passport-bitbucket-token)
[![npm version](https://badge.fury.io/js/passport-bitbucket-token.svg)](https://badge.fury.io/js/passport-bitbucket-token)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

[Passport](http://passportjs.org/) strategy for authenticating with [Bitbucket](https://bitbucket.org/) access tokens using the OAuth 2.0 API.

Library is inspired by [passport-facebook-token](https://github.com/drudge/passport-facebook-token).

## Installation

`npm install passport-bitbucket-token`

## Usage

### Configure Strategy

```js
var BitbucketTokenStrategy = require('passport-bitbucket-token');

passport.use(new BitbucketTokenStrategy({
      clientID: 'app-id',
      clientSecret: 'client-secret'
    },
    function (accessToken, refreshToken, profile, done) {
      User.upsertUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
      });
    }));
```

### Authenticate User

```js
router.route('/auth/bitbucket')
  .post(passport.authenticate('bitbucket-token'), function(req, res, next) {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }

    res.send(200);
  });
```

# License

passport-bitbucket-token is released under [MIT License](https://opensource.org/licenses/MIT).

