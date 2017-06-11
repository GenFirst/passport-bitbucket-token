'use strict';

import { assert } from 'chai';
import sinon from 'sinon';
import BitbucketTokenStrategy from '../src/index';

describe('It should load emails with 1.0 API', () => {
  let strategy;

  const fakeEmails = [
    {email: 'test@example.com', primary: false, active: false},
    {email: 'test2@example.com', primary: true, active: false},
    {email: 'test3@example.com', primary: false, active: true},
    {email: 'test4@example.com', primary: true, active: true}
  ];
  const fakeEmailsString = JSON.stringify(fakeEmails);

  before(() => {
    strategy = new BitbucketTokenStrategy({
      clientID: '123',
      clientSecret: '123',
      apiVersion: '1.0',
      profileWithEmail: true
    }, (accessToken, refreshToken, profile, next) => {
      assert.equal(accessToken, 'access_token');
      assert.equal(refreshToken, 'refresh_token');
      assert.typeOf(profile, 'object');
      assert.typeOf(next, 'function');
      return next(null, profile);
    });
  });

  it('Should properly parse v1.0 emails', done => {
    sinon.stub(strategy._oauth2, 'get').callsFake((url, accessToken, next) => next(null, fakeEmailsString));

    strategy.loadUserMail('accessToken', 'john_doe', {}, (error, profile) => {
      assert.isNull(error);

      assert.isDefined(profile);
      assert.isArray(profile.emails);
      assert.isTrue(profile.emails.length === 4);

      let emails = profile.emails;

      assert.equal(emails[0].value, 'test@example.com');
      assert.equal(emails[0].primary, false);
      assert.equal(emails[0].verified, false);

      assert.equal(emails[1].value, 'test2@example.com');
      assert.equal(emails[1].primary, true);
      assert.equal(emails[1].verified, false);

      assert.equal(emails[2].value, 'test3@example.com');
      assert.equal(emails[2].primary, false);
      assert.equal(emails[2].verified, true);

      assert.equal(emails[3].value, 'test4@example.com');
      assert.equal(emails[3].primary, true);
      assert.equal(emails[3].verified, true);

      strategy._oauth2.get.restore();
      done();
    });
  });

  it('Should properly parse empty email address respnse from v1.0 emails', done => {
    sinon.stub(strategy._oauth2, 'get').callsFake((url, accessToken, next) => next(null, '[]'));

    strategy.loadUserMail('accessToken', 'john_doe', {}, (error, profile) => {
      assert.isNull(error);

      assert.isDefined(profile);
      assert.isArray(profile.emails);
      assert.isTrue(profile.emails.length === 0);

      strategy._oauth2.get.restore();
      done();
    });
  });

  it('Should properly return error from Bitbucket API', done => {
    sinon.stub(strategy._oauth2, 'get').callsFake((url, accessToken, next) => next('error', null));

    strategy.loadUserMail('accessToken', 'john_doe', {}, (error, profile) => {
      assert.isDefined(error);
      assert.isUndefined(profile);

      strategy._oauth2.get.restore();
      done();
    });
  });

  it('Should properly return error on parsing error from Bitbucket API', done => {
    sinon.stub(strategy._oauth2, 'get').callsFake((url, accessToken, next) => next(null, '[{emils: "true@example.com"}]'));

    strategy.loadUserMail('accessToken', 'john_doe', {}, (error, profile) => {
      assert.isDefined(error);
      assert.isUndefined(profile);

      strategy._oauth2.get.restore();
      done();
    });
  });

});

describe('It should load emails with 2.0 API', () => {
  let strategy;

  const fakeEmails = { values: [
    {email: 'test@example.com', is_primary: false, is_confirmed: false},
    {email: 'test2@example.com', is_primary: true, is_confirmed: false},
    {email: 'test3@example.com', is_primary: false, is_confirmed: true},
    {email: 'test4@example.com', is_primary: true, is_confirmed: true}
  ]};
  const fakeEmailsString = JSON.stringify(fakeEmails);

  before(() => {
    strategy = new BitbucketTokenStrategy({
      clientID: '123',
      clientSecret: '123',
      apiVersion: '2.0',
      profileWithEmail: true
    }, (accessToken, refreshToken, profile, next) => {
      assert.equal(accessToken, 'access_token');
      assert.equal(refreshToken, 'refresh_token');
      assert.typeOf(profile, 'object');
      assert.typeOf(next, 'function');
      return next(null, profile);
    });
  });

  it('Should properly parse v2.0 emails', done => {
    sinon.stub(strategy._oauth2, 'get').callsFake((url, accessToken, next) => next(null, fakeEmailsString));

    strategy.loadUserMail('accessToken', 'john_doe', {}, (error, profile) => {
      assert.isNull(error);

      assert.isDefined(profile);
      assert.isArray(profile.emails);
      assert.isTrue(profile.emails.length === 4);

      let emails = profile.emails;

      assert.equal(emails[0].value, 'test@example.com');
      assert.equal(emails[0].primary, false);
      assert.equal(emails[0].verified, false);

      assert.equal(emails[1].value, 'test2@example.com');
      assert.equal(emails[1].primary, true);
      assert.equal(emails[1].verified, false);

      assert.equal(emails[2].value, 'test3@example.com');
      assert.equal(emails[2].primary, false);
      assert.equal(emails[2].verified, true);

      assert.equal(emails[3].value, 'test4@example.com');
      assert.equal(emails[3].primary, true);
      assert.equal(emails[3].verified, true);

      strategy._oauth2.get.restore();
      done();
    });
  });

  it('Should properly parse empty email address response from v2.0 emails', done => {
    let emptyResponse = {values: []};
    sinon.stub(strategy._oauth2, 'get').callsFake((url, accessToken, next) => next(null, JSON.stringify(emptyResponse)));

    strategy.loadUserMail('accessToken', 'john_doe', {}, (error, profile) => {
      assert.isNull(error);

      assert.isDefined(profile);
      assert.isArray(profile.emails);
      assert.isTrue(profile.emails.length === 0);

      strategy._oauth2.get.restore();
      done();
    });
  });

  it('Should properly return error from Bitbucket v2.0 API', done => {
    sinon.stub(strategy._oauth2, 'get').callsFake((url, accessToken, next) => next('error', null));

    strategy.loadUserMail('accessToken', 'john_doe', {}, (error, profile) => {
      assert.isDefined(error);
      assert.isUndefined(profile);

      strategy._oauth2.get.restore();
      done();
    });
  });

  it('Should properly return error on parsing error from Bitbucket v2.0 API', done => {
    sinon.stub(strategy._oauth2, 'get').callsFake((url, accessToken, next) => next(null, '[]'));

    strategy.loadUserMail('accessToken', 'john_doe', {}, (error, profile) => {
      assert.isDefined(error);
      assert.isUndefined(profile);

      strategy._oauth2.get.restore();
      done();
    });
  });

});