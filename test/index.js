const Lab = require('lab');
const Code = require('code');
const Seneca = require('seneca');
const entity = require('seneca-entity');
const mongoStore = require('seneca-mongo-store');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const ROLE = 'auth';

const opts = {
  mongo: {
    uri: process.env.URI || 'mongodb://127.0.0.1:27017/seneca-auth-test',
    options: {}
  }
};

function testSeneca (fin) {
  return Seneca({log: 'test'})
    .use(entity)
    .use(mongoStore, opts.mongo)
    .test(fin)
    .use(require('../lib/auth'));
}

describe('test AUTH', () => {
  it('create', (fin) => {
    const seneca = testSeneca(fin);

    const pattern = {
      role: ROLE,
      cmd: 'create',
      email: 'test@test.com',
      name: 'test',
      password: 'password123'
    };

    seneca
    .gate()
    .act(pattern, (ignore, result) => {
      expect(result.token).to.exist();
      expect(result.ok).to.equal(true);
    })
    .ready(fin);
  });

  it('login', (fin) => {
    const seneca = testSeneca(fin);

    const pattern = {
      role: ROLE,
      cmd: 'login',
      email: 'test@test.com',
      password: 'password123'
    };

    seneca
    .gate()
    .act(pattern, (ignore, result) => {
      expect(result.token).to.exist();
      expect(result.ok).to.equal(true);
    })
    .ready(fin);
  });

  it('e-mail invalid', (fin) => {
    const seneca = testSeneca(fin);

    const pattern = {
      role: ROLE,
      cmd: 'login',
      email: 'test_invalid@test.com',
      password: 'password123'
    };

    seneca
    .gate()
    .act(pattern, (ignore, result) => {
      expect(result.why).to.equal('Login or Password invalid');
      expect(result.ok).to.equal(false);
    })
    .ready(fin);
  });

  it('password invalid', (fin) => {
    const seneca = testSeneca(fin);

    const pattern = {
      role: ROLE,
      cmd: 'login',
      email: 'test@test.com',
      password: 'password_invalid'
    };

    seneca
    .gate()
    .act(pattern, (ignore, result) => {
      expect(result.why).to.equal('Login or Password invalid');
      expect(result.ok).to.equal(false);
    })
    .ready(fin);
  });
});
