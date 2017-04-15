import uri from 'url';
import { OAuth2Strategy, InternalOAuthError } from 'passport-oauth';

export default class BitbucketTokenStrategy extends OAuth2Strategy {

  constructor(_options, _verify) {
    const options = _options || {};
    const verify = _verify;


    options.authorizationURL = options.authorizationURL || 'https://bitbucket.org/site/oauth2/authorize';
    options.tokenURL = options.tokenURL || 'https://bitbucket.org/site/oauth2/access_token';

    super(options, verify);

    this.name = 'bitbucket-token';
    this._accessTokenField = options.accessTokenField || 'access_token';
    this._refreshTokenField = options.refreshTokenField || 'refresh_token';
    this._profileURL = options.profileURL || `https://api.bitbucket.org/1.0/user`;
    this._profileFields = options.profileFields || ['user.username', 'user.first_name', 'user.last_name', 'user.avatar'];
    this._clientSecret = options.clientSecret;
    this._passReqToCallback = options.passReqToCallback;
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

        const profile = {
          provider: 'bitbucket',
          id: json.user.username,
          username: json.user.username,
          name: {
            first_name: json.user.first_name || '',
            last_name: json.user.last_name || ''
          },
          avatar:  json.user.avatar,
          _raw: body,
          _json: json
        };

        done(null, profile);
      } catch (e) {
        done(e);
      }
    });
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