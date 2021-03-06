# passport-bitbucket-token

[![NPM](https://nodei.co/npm/passport-bitbucket-token.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/passport-bitbucket-token/)

[![Build Status](https://travis-ci.org/GenFirst/passport-bitbucket-token.svg?branch=master)](https://travis-ci.org/GenFirst/passport-bitbucket-token)
[![Coverage Status](https://coveralls.io/repos/github/GenFirst/passport-bitbucket-token/badge.svg?branch=master)](https://coveralls.io/github/GenFirst/passport-bitbucket-token?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/GenFirst/passport-bitbucket-token.svg)](https://gemnasium.com/github.com/GenFirst/passport-bitbucket-token)
[![Code Climate](https://codeclimate.com/github/GenFirst/passport-bitbucket-token/badges/gpa.svg)](https://codeclimate.com/github/GenFirst/passport-bitbucket-token)
[![npm version](https://badge.fury.io/js/passport-bitbucket-token.svg)](https://badge.fury.io/js/passport-bitbucket-token)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

[Passport](http://passportjs.org/) strategy for authenticating with [Bitbucket](https://bitbucket.org/) access tokens using the OAuth 2.0 API.

Library is inspired by [passport-facebook-token](https://github.com/drudge/passport-facebook-token).

## Installation

`npm install passport-bitbucket-token`

## Usage

### Configure Strategy

The Bitbucket authentication strategy authenticate users using Bitbucket account and OAuthe 2 tokens. The strategy requires two parameters: `options` and `verify` callback. 
`options` are used to configure strategy. `verify` callback is function that accepts 4 arguments: `accessToken`, `refreshToken`, `profile`, `done`. `profile` is parsed Bitbucket profile. `done` is method which is called with user when `verify` method is finished. 

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
#### Options

* `apiVersion` - Which version of Bitbucket API user want to use. Allowed values are [1.0](https://confluence.atlassian.com/bitbucket/user-endpoint-296092264.html) or [2.0](https://developer.atlassian.com/bitbucket/api/2/reference/resource/user).
* `accessTokenField` - Name of HTTP header, body field or query parameter where access token is stored in request
* `refreshTokenField` - Name of HTTP header, body field or query parameter where refresh token is stored in request
* `passReqToCallback` - Should `verify` function received as first parameter `req` object
* `profileWithEmail` - If `true` library will try to load profile with all emails that are associated with profile. `email` is scope that is required. If nothing is selected emails will not be loaded.

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
### Client Requests

#### Sending access_token as a Query parameter

```GET /auth/bitbucket?access_token=<TOKEN>```

#### Sending access token as an HTTP header

```
GET /auth/bitbucket HTTP/1.1
Host: example.com
Authorization: Bearer base64_access_token_string
```

#### Sending access token as an HTTP body

```
POST /auth/bitbucket HTTP/1.1
Host: example.com

access_token=base64_access_token_string
```

### Profile examples

In this section we will show examples of parsed profile that are returned to `verify` callback.

#### Bitbucket API v1.0

```js
{ 
  provider: 'bitbucket',
  id: 'john_doe',
  username: 'john_doe',
  name: { first_name: 'John', last_name: 'Doe' },
  emails: [{value: 'test@example.com', primary: true, verified: true}]
  avatar: 'https://bitbucket.org/account/john_doe/avatar/32/?ts=1492462087',
  _raw: 'raw json object from Bitbucket server',
  _json: 
   { 
     'parsed json object from server'
   }
}
```

#### Bitbucket API v2.0

```js
{ 
  provider: 'bitbucket',
  id: 'john_doe',
  username: 'john_doe',
  display_name: 'John Doe',
  emails: [{value: 'test@example.com', primary: true, verified: true}]
  avatar: 'https://bitbucket.org/account/john_doe/avatar/32/?ts=1492462087',
  _raw: 'raw json object from Bitbucket server',
  _json: 
   { 
     'parsed json object from server'
   }
}
```

# Examples

Example of server application can be found [here](https://github.com/GenFirst/passport-bitbucket-token/tree/master/example/backend).

Full example of React.js + Node.js/Express.js can be found [here](https://github.com/GenFirst/react-node-bitbucket-login).

# License

passport-bitbucket-token is released under [MIT License](https://opensource.org/licenses/MIT).

