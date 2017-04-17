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
  });
});