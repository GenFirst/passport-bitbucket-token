'use strict';

import chai, { assert } from 'chai';
import sinon from 'sinon';
import BitbucketTokenStrategy from '../src/index';

describe('BitbucketTokenStrategy:userProfile v2', () => {

  let strategy;

  // improve fake profile with more data
  const fakeProfile = {
    user: {
      username: 'john_doe',
      website: '',
      display_name: 'John Doe',
      uuid: 'unique-uuid',
      links: {
        avatar: {
          href: 'https://bitbucket.org/account/john_doe/avatar/32/?ts=1492462087'
        },
        self: {
          href:''
        },
        repositories: {
          href: ''
        },
        html: {
          href: ''
        },
        followers: {
          href: ''
        },
        following: {
          href: ''
        }
      },
      created_on: 'date-time'
    }
  };

  const fakeProfileString = JSON.stringify(fakeProfile);

  before(() => {
    strategy = new BitbucketTokenStrategy({
      clientID: '123',
      clientSecret: '123',
      apiVersion: '2.0'
    }, (accessToken, refreshToken, profile, next) => {
      console.log('verify');
      console.log(profile);
      assert.equal(accessToken, 'access_token');
      assert.equal(refreshToken, 'refresh_token');
      assert.typeOf(profile, 'object');
      assert.typeOf(next, 'function');
      return next(null, profile);
    });
  });

  it('Should properly parse v2.0 profile', done => {
    sinon.stub(strategy._oauth2, 'get').callsFake((url, accessToken, next) => next(null, fakeProfileString));

    strategy.userProfile('accessToken', (error, profile) => {
      assert.isNull(error);
      assert.equal(profile.provider, 'bitbucket');
      assert.equal(profile.id, 'unique-uuid');
      assert.equal(profile.username, 'john_doe');
      assert.equal(profile.display_name, 'John Doe');
      assert.equal(profile.avatar, 'https://bitbucket.org/account/john_doe/avatar/32/?ts=1492462087');
      assert.typeOf(profile._raw, 'string');
      assert.equal(profile._raw, fakeProfileString);
      assert.typeOf(profile._json, 'object');

      strategy._oauth2.get.restore();
      done();
    });
  });
});