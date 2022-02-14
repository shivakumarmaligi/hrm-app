const LocalStrategy = require("passport-local").Strategy;
const {compare} = require("bcryptjs");
const mongoose = require("mongoose");
const passport = require("passport");
const UserSchema = require("../Model/Auth");

module.exports = passport => {
  passport.use(
      new LocalStrategy({usernameField: "email" }, async (email, password, done) => {
      // Checking user exists or not
      let user = await UserSchema.findOne({ email });
      if (!user) {
        done(null, false, { message: "User not exists!" });
      }
      // match password
      compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
          return done(null, false, { message: "Password is not matching" });
        } else {
          return done(null, user);
        }
      });
    })
  );
  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    UserSchema.findById(id, function (err, user) {
      done(err, user);
    });
  });
};