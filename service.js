'use strict';

const seneca = require('seneca')();
const entity = require('seneca-entity');
const mongoStore = require('seneca-mongo-store');
const dotenv = require('dotenv');
const auth = require('./lib/auth');

dotenv.load({silent: true});

const opts = {
  mongo: {
    uri: process.env.URI || 'mongodb://127.0.0.1:27017/seneca-auth',
    options: {}
  }
};

seneca.use(entity);
seneca.use(mongoStore, opts.mongo);
seneca.use(auth);
seneca.listen({
  pin: 'role:auth,cmd:*',
  port: process.env.PORT || 9002
});
