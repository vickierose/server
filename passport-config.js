const googleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "886894346654-eekbgqs2hps8v1tlj96u3m822f6gqmmb.apps.googleusercontent.com",
    clientSecret: 'u9jQW1C8Jfq-eMVVyIPH68qp',
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
))