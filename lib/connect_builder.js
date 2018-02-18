'use strict';

const express = require('express');
const fs = require('fs');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');
const helmet = require('helmet');

function ConnectBuilder() {
  this.app = express();
  this.app.use(bodyParser.urlencoded({ extended: false }));
  this.app.use(bodyParser.json());
  this.app.use(helmet());
}

ConnectBuilder.prototype.authorize = function authorize(user, pass) {
  this.app.use(basicAuth(
    {
      authorizer: (inUser, inPass) => inUser === user && inPass === pass,
      challenge: true
    }
  ));

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

ConnectBuilder.prototype.session = function session(secret, doSecure) {
  this.app.use(cookieParser());
  this.app.use(
    expressSession({
      "secret": secret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: doSecure }
    })
  );
  return this;
};

ConnectBuilder.prototype.static = function staticf(path) {
  this.app.use(serveStatic(path));
  return this;
};

ConnectBuilder.prototype.rest = function makeRest(url, asyncFunction) {
  this.app.use("/api/" + url, asyncFunction);
  return this;
}

ConnectBuilder.prototype.limitRate = function makeLimitRate(rate) {
  var limiter = new RateLimit({
    windowMs: 15*60*1000,
    max: rate,
    delayAfter: rate/5,
    delayMs: 5000,
    message: "This is not the server you're looking for, move along"
  });
  this.app.use(limiter);
  return this;
}

module.exports = () => new ConnectBuilder();
