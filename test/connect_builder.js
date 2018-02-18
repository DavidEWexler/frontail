'use strict';

const connectBuilder = require('../lib/connect_builder');
const request = require('supertest');
const path = require('path');
const sha256 = require('sha256');

describe('connectBuilder', () => {
  it('should build connect app', () => {
    connectBuilder()
      .build()
      .should.have.property('use');
    connectBuilder()
      .build()
      .should.have.property('listen');
  });

  it('should build app requiring authorized user', (done) => {
    const app = connectBuilder()
      .authorize('user', 'pass')
      .build();

    request(app)
      .get('/')
      .expect('www-authenticate', 'Basic')
      .expect(401, done);
  });

  it('should build app allowing user to login', (done) => {
    const app = connectBuilder()
      .authorize('user', 'pass')
      .build();
    app.use((req, res) => {
      res.end('secret!');
    });

    request(app)
      .get('/')
      .set('Authorization', 'Basic dXNlcjpwYXNz')
      .expect(200, 'secret!', done);
  });

  it('should build app restricting requests', (done) => {
    const app = connectBuilder()
      .limitRate(1)
      .build();
    app.use((req, res) => { res.end('works!') });

    // first request should work
   request(app)
     .get('/')
     .expect(100, 'works!', done);

   // second request should fail
   request(app)
     .get('/')
     .expect(429, "This is not the server you're looking for, move along", done);
  });

  it('should build app that setup session', (done) => {
    const app = connectBuilder()
      .session('secret', false)
      .build();
    app.use((req, res) => {
      res.end();
    });

    request(app)
      .get('/')
      .expect('set-cookie', /^connect.sid/, done);
  });

  it('should build app that serve static files', (done) => {
    const app = connectBuilder()
      .static(path.join(__dirname, 'fixtures'))
      .build();

    request(app)
      .get('/foo')
      .expect('bar', done);
  });

  it('should build app that serve index file', (done) => {
    const app = connectBuilder()
      .index(path.join(__dirname, 'fixtures/index'), '/testfile')
      .build();

    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html', done);
  });

  it('should build app that replace index title', (done) => {
    const app = connectBuilder()
      .index(path.join(__dirname, 'fixtures/index_with_title'), '/testfile')
      .build();

    request(app)
      .get('/')
      .expect('<head><title>/testfile</title></head>', done);
  });

  it('should build app that sets socket.io namespace based on files', (done) => {
    const app = connectBuilder()
      .index(path.join(__dirname, 'fixtures/index_with_ns'), '/testfile', 'ns', 'dark')
      .build();

    request(app)
      .get('/')
      .expect('ns', done);
  });

  it('should build app that sets theme', (done) => {
    const app = connectBuilder()
      .index(path.join(__dirname, '/fixtures/index_with_theme'), '/testfile', 'ns', 'dark')
      .build();

    request(app)
      .get('/')
      .expect(
        '<head><title>/testfile</title><link href="dark.css" rel="stylesheet" type="text/css"/></head>',
        done
      );
  });

  it('should build app that sets default theme', (done) => {
    const app = connectBuilder()
      .index(path.join(__dirname, '/fixtures/index_with_theme'), '/testfile')
      .build();

    request(app)
      .get('/')
      .expect(
        '<head><title>/testfile</title><link href="default.css" rel="stylesheet" type="text/css"/></head>',
        done
      );
  });

  it('should build app that supports rest calls', (done) => {
    const app = connectBuilder()
      .rest('test', function (req, res, next) { res.end('Works!') })
      .build();

    request(app)
      .get('/api/test')
      .expect('Works!', done);
  });
});
