'use strict';

import uri from 'url';
import { OAuth2Strategy, InternalOAuthError } from 'passport-oauth';

export default class BitbucketTokenStrategy extends OAuth2Strategy {

  constructor(_options, _verify) {
    const options = _options || {};
    const verify = _verify;

    options.authorizationURL = 'https://bitbucket.org/site/oauth2/authorize';
    options.tokenURL = 'https://bitbucket.org/site/oauth2/access_token';

    super(options, verify);

    this.name = 'bitbucket-token';
    this.apiVersion = options.apiVersion || '1.0';
    this._accessTokenField = options.accessTokenField || 'access_token';
    this._refreshTokenField = options.refreshTokenField || 'refresh_token';
    this._profileURL = `https://api.bitbucket.org/${this.apiVersion}/user`;
    this._clientSecret = options.clientSecret;
    this._passReqToCallback = options.passReqToCallback || false;
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  authenticate(req, options) {
    const accessToken = this.lookup(req, this._accessTokenField);
    const refreshToken = this.lookup(req, this._refreshTokenField);

    if (!accessToken) return this.fail({message: `You should provide ${this._accessTokenField}`});

    this._loadUserProfile(accessToken, (error, profile) => {
      if (error) return this.error(error);

      const verified = (error, user, info) => {
        if (error) return this.error(error);
        if (!user) return this.fail(info);

        return this.success(user, info);
      };

      if (this._passReqToCallback) {
        this._verify(req, accessToken, refreshToken, profile, verified);
      } else {
        this._verify(accessToken, refreshToken, profile, verified);
      }
    });
  }

  userProfile(accessToken, done) {
    let profileURL = uri.parse(this._profileURL);

    this._oauth2.get(profileURL, accessToken, (error, body, res) => {
      if (error) return done(new InternalOAuthError('Failed to fetch user profile', error));

      try {
        const json = JSON.parse(body);

        const profile = this.apiVersion === '1.0' ? this.parseV1Profile(json, body) : this.parseV2Profile(json, body);

        done(null, profile);
      } catch (e) {
        done(e);
      }
    });
  }

  parseV1Profile(bitbucketProfile, rawProfile) {
    return {
      provider: 'bitbucket',
      id: bitbucketProfile.user.username,
      username: bitbucketProfile.user.username,
      name: {
        first_name: bitbucketProfile.user.first_name,
        last_name: bitbucketProfile.user.last_name
      },
      avatar:  bitbucketProfile.user.avatar,
      _raw: rawProfile,
      _json: bitbucketProfile
    };
  }

  parseV2Profile(bitbucketProfile, rawProfile) {
    console.log(bitbucketProfile);
    return {
      provider: 'bitbucket',
      id: bitbucketProfile.user.uuid,
      username: bitbucketProfile.user.username,
      display_name: bitbucketProfile.user.display_name,
      avatar:  bitbucketProfile.user.links.avatar.href,
      _raw: rawProfile,
      _json: bitbucketProfile
    };
  }

  parseOAuth2Token(req) {
    const OAuth2AuthorizationField = 'Authorization';
    const headerValue = (req.headers && (req.headers[OAuth2AuthorizationField] || req.headers[OAuth2AuthorizationField.toLowerCase()]));

    return (
      headerValue && (() => {
        const bearerRE = /Bearer\ (.*)/;
        let match = bearerRE.exec(headerValue);
        return (match && match[1]);
      })()
    );
  }

  lookup(req, field) {
    return (
      (req.body && req.body[field]) ||
      (req.query && req.query[field]) ||
      (req.headers && (req.headers[field] || req.headers[field.toLowerCase()])) ||
      this.parseOAuth2Token(req)
    );
  }
}