const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  // Check if the user is authenticated:
  if (req.isAuthenticated()) {
    next()
    return
  }
  req.flash('error', 'You have to be logged in to do that.')
  res.redirect('/login')
};

exports.forgot = async (req, res) => {
  // See if an user with that email exists:
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('success', 'If there is an account with that email, a password reset link will have been sent.');
    return res.redirect('/login');
  }
  // Set reset tokens and expiry on their account:
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + (60 * 60 * 1000); // 1 hour from now
  await user.save();
  // Send them an email with the token:
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    user,
    filename: 'password-reset',
    subject: 'Password Reset',
    resetURL
  });
  req.flash('success', 'If there is an account with that email, a password reset link will have been sent.');
  // Redirect to login page:
  res.redirect('/login');
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  }); // Find a user with that token in a valid time period:
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }
  // If there is a user, show the rest password form:
  res.render('reset', { title: 'Reset your Password' });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm'] && req.body.password.length > 0) {
    next()
    return
  }
  req.flash('error', 'Passwords do not match!');
  res.redirect('back')
};

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user) // Promisifying methods from passport.
  await setPassword(req.body.password);
  // Unset reset token and time:
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser) // Again, passport methods.
  req.flash('success', 'Nice! Your password has been reset! You are now logged in!');
  res.redirect('/');
};
