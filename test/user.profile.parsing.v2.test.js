'use strict';

import chai, { assert } from 'chai';
import sinon from 'sinon';
import BitbucketTokenStrategy from '../src/index';

describe('BitbucketTokenStrategy:userProfile v2', () => {

  let strategy;

  // improve fake profile with more data
  const fakeProfile = {
    username: 'john_doe',
    website: '',
    display_name: 'John Doe',
    account_id: '357258:48d78116-4c6d-4910-aad3-76d16406a4c7',
    links: {
      hooks: {
        href: 'https://api.bitbucket.org/2.0/users/john_doe/hooks'
      },
      avatar: {
        href: 'https://bitbucket.org/account/john_doe/avatar/32/?ts=1492462087'
      },
      self: {
        href: 'https://api.bitbucket.org/2.0/users/john_doe'
      },
      repositories: {
        href: 'https://api.bitbucket.org/2.0/repositories/robince'
      },
      html: {
        href: 'https://bitbucket.org/robince/'
      },
      followers: {
        href: 'https://api.bitbucket.org/2.0/users/robince/followers'
      },
      following: {
        href: 'https://api.bitbucket.org/2.0/users/robince/following'
      },
      snippets: {
        href: 'https://api.bitbucket.org/2.0/snippets/robince'
      }
    },
    created_on: '2014-03-30T13:01:36.137050+00:00',
    is_staff: false,
    location: null,
    type: 'user',
    uuid: '{460bb15c-1f2b-4734-bb43-be6a720dc7d6}'
  };

  const fakeProfileString = JSON.stringify(fakeProfile);

  before(() => {
    strategy = new BitbucketTokenStrategy({
      clientID: '123',
      clientSecret: '123',
      apiVersion: '2.0'
    }, (accessToken, refreshToken, profile, next) => {
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
      assert.equal(profile.id, '{460bb15c-1f2b-4734-bb43-be6a720dc7d6}');
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