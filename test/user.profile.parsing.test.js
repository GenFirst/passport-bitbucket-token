import chai, { assert } from 'chai';
import sinon from 'sinon';
import BitbucketTokenStrategy from '../src/index';

describe('BitbucketTokenStrategy:userProfile', () => {
  let strategy;

  // improve fake profile with more data
  const fakeProfile = {
    user: {
      username: 'john_doe',
      first_name: 'John',
      last_name: 'Doe',
      avatar: 'https://bitbucket.org/account/john_doe/avatar/32/?ts=1492462087'
    }
  };
  const fakeProfileString = JSON.stringify(fakeProfile);

  before(() => {
    strategy = new BitbucketTokenStrategy({
      clientID: '123',
      clientSecret: '123'
    }, (accessToken, refreshToken, profile, next) => {
      assert.equal(accessToken, 'access_token');
      assert.equal(refreshToken, 'refresh_token');
      assert.typeOf(profile, 'object');
      assert.typeOf(next, 'function');
      return next(null, profile);
    });
  });

  it('Should properly parse profile', done => {
    sinon.stub(strategy._oauth2, 'get').callsFake((url, accessToken, next) => next(null, fakeProfileString));

    strategy.userProfile('accessToken', (error, profile) => {
      assert.isNull(error);
      assert.equal(profile.provider, 'bitbucket');
      assert.equal(profile.id, 'john_doe');
      assert.equal(profile.username, 'john_doe');
      assert.equal(profile.name.first_name, 'John');
      assert.equal(profile.name.last_name, 'Doe');
      assert.equal(profile.avatar, 'https://bitbucket.org/account/john_doe/avatar/32/?ts=1492462087');
      assert.typeOf(profile._raw, 'string');
      assert.equal(profile._raw, fakeProfileString);
      assert.typeOf(profile._json, 'object');

      strategy._oauth2.get.restore();
      done();
    });
  });

  it('Should properly handle exception on profile parsing', done => {
    sinon.stub(strategy._oauth2, 'get').callsFake((url, accessToken, next) => next(null, 'not a JSON'));

    strategy.userProfile('accessToken', (error, profile) => {
      assert.instanceOf(error, SyntaxError);
      assert.isUndefined(profile);

      strategy._oauth2.get.restore();
      done();
    });
  });

  it('Should handle errors from _oauth2 get function', done => {
    sinon.stub(strategy._oauth2, 'get').callsFake((url, accessToken, next) => next('Fatal error'));

    strategy.userProfile('accessToken', (error, profile) => {
      assert.instanceOf(error, Error);
      assert.isUndefined(profile);

      strategy._oauth2.get.restore();
      done();
    });
  });
});