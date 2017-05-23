'use strict';

const bcrypt = require('bcrypt-nodejs');
const redis = require('./cache');

module.exports = function auth (options) {
  const seneca = this;
  const auth = seneca.make('auth');
  const ROLE = 'auth';

  seneca.add({role: ROLE, cmd: 'findById'}, findById);
  seneca.add({role: ROLE, cmd: 'create'}, create);
  seneca.add({role: ROLE, cmd: 'update'}, update);
  seneca.add({role: ROLE, cmd: 'login'}, login);
  seneca.add({role: ROLE, cmd: 'logout'}, logout);
  seneca.add({role: ROLE, cmd: 'setToken'}, setToken);
  seneca.add({role: ROLE, cmd: 'getToken'}, getToken);

  function findById (args, done) {
    return auth.load$({id: args.id}, (err, value) => {
      if (err) return done(err);
      if (!value) return done(null, {ok: false, why: 'ID not found'});
      return done(null, {ok: true, auth: seneca.util.clean(value)});
    });
  }

  function login (args, done) {
    return auth.load$({email: args.email}, (err, value) => {
      if (err) return done(err);
      if (!value) return done(null, {ok: false, why: 'Login or Password invalid'});
      if (!bcrypt.compareSync(args.password, value.password)) return done(null, {ok: false, why: 'Login or Password invalid'});
      return done(null, {ok: true, auth: seneca.util.clean(value)});
    });
  }

  function setToken (args, done) {
    if (!args.token) return done(null, {ok: false, why: 'Token invalid'});
    if (!args.id) return done(null, {ok: false, why: 'ID invalid'});
    redis.set(args.token, args.id);
    redis.expire(args.token, (60 * 60) * 24);
    return done(null, {ok: true});
  }

  function getToken (args, done) {
    if (!args.token) return done(null, {ok: false, why: 'Token invalid'});
    redis.get(args.token, (err, value) => {
      if (err) return done(err);
      if (!value) return done(null, {ok: false, why: 'Token not found'});
      return done(null, {ok: true, token: value});
    });
  }

  function logout (args, done) {
    if (!args.token) return done(null, {ok: false, why: 'Token invalid'});
    redis.del(args.token, (err, value) => {
      if (err) return done(err);
      return done(null, {ok: true});
    });
  }

  function create (args, done) {
    auth.email = args.email;
    auth.name = args.name;
    auth.password = bcrypt.hashSync(args.password, bcrypt.genSaltSync(8), null);

    return auth.save$((err, value) => {
      if (err) return done(err);
      return done(null, {ok: true, auth: seneca.util.clean(value)});
    });
  }

  function update (args, done) {
    return auth.load$({id: args.id}, (err, auth) => {
      if (err) return done(err);
      if (!auth) return done(null, {ok: false, why: 'ID not found'});

      if (args.email) {
        auth.email = args.email;
      }
      if (args.name) {
        auth.name = args.name;
      }
      if (args.password) {
        auth.password = bcrypt.hashSync(args.password, bcrypt.genSaltSync(8), null);
      }
      return auth.save$((err, auth) => {
        if (err) return done(err);
        return done(null, {ok: true, auth: seneca.util.clean(auth)});
      });
    });
  }
};
