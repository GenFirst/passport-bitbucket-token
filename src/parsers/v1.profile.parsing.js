'use strict';

const v1parser = {

  profile: (bitbucketProfile, rawProfile) => {
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
  },

  emails: (body) => {
    return body.map(email => {return { value: email.email, primary: email.primary, verified: email.active }; });
  }
};

export default v1parser;