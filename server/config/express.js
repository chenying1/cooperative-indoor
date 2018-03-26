'use strict';

var express = require('express'),
    path = require('path'),
    config = require('./config');

/**
 * Express configuration
 */
module.exports = function(app) {
  if(app.get('env') === 'development') {
    app.use(require('connect-livereload')({
      // livereload is incompatible with the current method
      // of streaming data from the API for some maps.
      // see https://github.com/mscdex/busboy/issues/79#issuecomment-108684031
      ignore: [/api/],
    }));

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });
    app.use(express.compress());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'app')));
    app.use(express.errorHandler());
    app.set('views', config.root + '/app/views');
  }

  if(app.get('env') === 'production'){
    app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.compress());
    app.use(express.static(path.join(config.root, 'public')));
    app.set('views', config.root + '/views');
  }

  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  // Router needs to be last
  app.use(app.router);

};

