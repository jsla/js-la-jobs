
/**
 * Module dependencies.
 */

var express = require('express')
  , jobs = require('./routes/jobs')
  , accounts = require('./routes/accounts')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , RedisStore = require('connect-redis')(express);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.session({
      secret: "the joined advice reads across whatever reserved"
    , store: new RedisStore
  }))
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var middleware = {
  auth: function(req, res, next) {
    if (req.session.currentUser) {
      next()  
    } else {
      req.session.desiredUrl = req.url
      res.redirect('/login')
    }
  }
}

accounts(app, middleware)
jobs(app, middleware)

app.get('/', function(req, res) { res.redirect('/jobs') })

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
