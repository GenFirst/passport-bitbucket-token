'use strict';

import { assert } from 'chai';
import BitbucketTokenStrategy from '../src/index';

describe('BitbucketTokenStrategy:init', () => {

  it('Should properly export Strategy constructor', () => {
    assert.isFunction(BitbucketTokenStrategy);
  });

  it('Should properly throw exception when options is empty', () => {
    assert.throw(() => new BitbucketTokenStrategy(), Error);
  });

  it('Should properly initialize', () => {
    let strategy = new BitbucketTokenStrategy({
      clientID: '123',
      clientSecret: '123'
    }, () => {});

    assert.equal(strategy.name, 'bitbucket-token');
    assert.equal(strategy._oauth2._useAuthorizationHeaderForGET, true);
    assert.equal(strategy._oauth2._accessTokenUrl, 'https://bitbucket.org/site/oauth2/access_token');
    assert.equal(strategy._oauth2._authorizeUrl, 'https://bitbucket.org/site/oauth2/authorize');
    assert.equal(strategy._profileURL,`https://api.bitbucket.org/1.0/user`);
    assert.equal(strategy._accessTokenField, 'access_token');
    assert.equal(strategy._refreshTokenField, 'refresh_token');
    assert.equal(strategy._passReqToCallback, false);
  });

  it('Should changed property correctly', () => {
    let strategy = new BitbucketTokenStrategy({
      clientID: '123',
      clientSecret: '123',
      accessTokenField: 'test_access_token',
      refreshTokenField: 'test_refresh_token',
      profileURL: 'test_profile_url',
      passReqToCallback: true,
      tokenURL: 'test_token_url',
      authorizationURL: 'test_authorization_url'
    }, () => {});

    assert.equal(strategy.name, 'bitbucket-token');
    assert.equal(strategy._oauth2._useAuthorizationHeaderForGET, true);
    assert.equal(strategy._oauth2._accessTokenUrl, 'https://bitbucket.org/site/oauth2/access_token');
    assert.equal(strategy._oauth2._authorizeUrl, 'https://bitbucket.org/site/oauth2/authorize');
    assert.equal(strategy._profileURL, 'https://api.bitbucket.org/1.0/user');
    assert.equal(strategy._accessTokenField, 'test_access_token');
    assert.equal(strategy._refreshTokenField, 'test_refresh_token');
    assert.equal(strategy._passReqToCallback, true);
  });

  it('Should change profile URL when API version is set to 2.0', () => {
    let strategy = new BitbucketTokenStrategy({
      clientID: '123',
      clientSecret: '123',
      accessTokenField: 'test_access_token',
      refreshTokenField: 'test_refresh_token',
      profileURL: 'test_profile_url',
      passReqToCallback: true,
      tokenURL: 'test_token_url',
      authorizationURL: 'test_authorization_url',
      apiVersion: '2.0'
    }, () => {});

    assert.equal(strategy.name, 'bitbucket-token');
    assert.equal(strategy._oauth2._useAuthorizationHeaderForGET, true);
    assert.equal(strategy._oauth2._accessTokenUrl, 'https://bitbucket.org/site/oauth2/access_token');
    assert.equal(strategy._oauth2._authorizeUrl, 'https://bitbucket.org/site/oauth2/authorize');
    assert.equal(strategy._profileURL, 'https://api.bitbucket.org/2.0/user');
    assert.equal(strategy._accessTokenField, 'test_access_token');
    assert.equal(strategy._refreshTokenField, 'test_refresh_token');
    assert.equal(strategy._passReqToCallback, true);
  });

});