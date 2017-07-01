'use strict';

require('dotenv').load({silent: true});

const seneca = require('seneca')();
const entity = require('seneca-entity');
const mesh = require('seneca-mesh');
const consul = require('seneca-consul-registry');
const mongoStore = require('seneca-mongo-store');
const auth = require('./lib/auth');

const PINS = [
  'role:auth,cmd:*',
];

const opts = {
  mongo: {
    uri: process.env.URI || 'mongodb://127.0.0.1:27017/seneca-auth',
    options: {}
  },
  mesh: {
    tag: 'base',
    auto: true,
    host: process.env.ADDR || '127.0.0.1',
    listen: [{
      pin: PINS,
      host: process.env.ADDR || '127.0.0.1',
      port: process.env.PORT || 50000 + Math.floor((10000 * Math.random()))
    }],
    discover: {
      registry: {
        active: true
      },
      multicast: {
        active: false
      }
    }
  },
  consul: {
    host: process.env.CONSUL_ADDR || '127.0.0.1'
  }
};

seneca.use(entity);
seneca.use(mongoStore, opts.mongo);
seneca.use(auth);
seneca.listen({
  pin: 'role:auth,cmd:*',
  port: process.env.PORT || 9002
});
