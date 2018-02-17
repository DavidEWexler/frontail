'use strict';

const connect = require('connect');
const fs = require('fs');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const basicAuth = require('basic-auth-connect');

function ConnectBuilder() {
  this.app = connect();
}

ConnectBuilder.prototype.authorize = function authorize(user, pass) {
  this.app.use(basicAuth(user, pass));

  return this;
};

ConnectBuilder.prototype.build = function build() {
  return this.app;
};

ConnectBuilder.prototype.index = function index(path, files, filesNamespace, themeOpt) {
  const theme = themeOpt || 'default';

  this.app.use("/", (req, res) => {
    fs.readFile(path, (err, data) => {
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });
      res.end(
        data
          .toString('utf-8')
          .replace(/__TITLE__/g, files)
          .replace(/__THEME__/g, theme)
          .replace(/__NAMESPACE__/g, filesNamespace),
        'utf-8'
      );
    });
  });

  return this;
};

ConnectBuilder.prototype.session = function session(secret, key) {
  this.app.use(cookieParser());
  this.app.use(
    expressSession({
      "secret": secret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    })
  );
  return this;
};

ConnectBuilder.prototype.static = function staticf(path) {
  this.app.use(serveStatic(path));
  return this;
};

ConnectBuilder.prototype.restGet = function makeRest(url, asyncFunction) {
  this.app.use("/api/" + url, asyncFunction);
  return this;
}

module.exports = () => new ConnectBuilder();
