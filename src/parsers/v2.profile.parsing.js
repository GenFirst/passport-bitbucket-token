'use strict';

const v2parser = {

  profile: (bitbucketProfile, rawProfile) => {
    return {
      provider: 'bitbucket',
      id: bitbucketProfile.uuid,
      username: bitbucketProfile.username,
      display_name: bitbucketProfile.display_name,
      avatar:  bitbucketProfile.links.avatar.href,
      _raw: rawProfile,
      _json: bitbucketProfile
    };
  },

  emails: (body) => {
    return body.values.map(email => { return {value: email.email, primary: email.is_primary, verified: email.is_confirmed}; });
  }
};

export default v2parser;