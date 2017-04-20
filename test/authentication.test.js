import chai, { assert } from 'chai';
import sinon from 'sinon';
import BitbucketTokenStrategy from '../src/index';


describe('BitbucketTokenStrategy:authenticate', () => {
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

    sinon.stub(strategy._oauth2, 'get', (url, accessToken, next) => next(null, fakeProfileString, null));
  });

  after(() => strategy._oauth2.get.restore());

  it('Should properly parse access_token from body', done => {
    chai
      .passport
      .use(strategy)
      .success(user => {
        assert.typeOf(user, 'object');
        done();
      })
      .req(req => {
        req.body = {
          access_token: 'access_token',
          refresh_token: 'refresh_token'
        }
      })
      .authenticate({});
  });

  it('Should properly parse access_token from query', done => {
    chai
      .passport
      .use(strategy)
      .success(user => {
        assert.typeOf(user, 'object');
        done();
      })
      .req(req => {
        req.query = {
          access_token: 'access_token',
          refresh_token: 'refresh_token'
        }
      })
      .authenticate({});
  });

  it('Should properly parse access token from OAuth2 bearer header', done => {
    chai
      .passport
      .use(strategy)
      .success(user => {
        assert.typeOf(user, 'object');
        done();
      })
      .req(req => {
        req.headers = {
          Authorization: 'Bearer access_token',
          refresh_token: 'refresh_token'
        }
      })
      .authenticate({});
  });

  it('Should properly parse access token from OAuth2 bearer header as lowercase', done => {
    chai
      .passport
      .use(strategy)
      .success(user => {
        assert.typeOf(user, 'object');
        done();
      })
      .req(req => {
        req.headers = {
          authorization: 'Bearer access_token',
          refresh_token: 'refresh_token'
        }
      })
      .authenticate({});
  });

  it('Should properly parse access token from access_token header', done => {
    chai
      .passport
      .use(strategy)
      .success(user => {
        assert.typeOf(user, 'object');
        done();
      })
      .req(req => {
        req.headers = {
          access_token: 'access_token',
          refresh_token: 'refresh_token'
        }
      })
      .authenticate({});
  });

  it('Should fail if access_token is missing', done => {
    chai
      .passport
      .use(strategy)
      .fail(error => {
        assert.typeOf(error, 'object');
        assert.typeOf(error.message, 'string');
        assert.deepEqual(error, { message: 'You should provide access_token' });
        done();
      })
      .authenticate({});
  });
});