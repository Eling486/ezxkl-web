var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var session = require('express-session');
var marked = require('marked')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
global.userdb = require('./database/users');
global.contributiondb = require('./database/contributions');
global.noticedb = require('./database/notices');
global.historydb = require('./database/history');
var app = express();
var cors = require('cors');
var fs = require('fs');
var moment = require('moment');
moment.locale('zh-cn');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  cookie: {
    maxAge: 1000 * 60 * 30
  }
}));

/*markdown公告读取-已弃用*/
/*app.get('/getnotices', urlencodedParser, function (req, res) {
  var filepath = './notices'
  var data = [];
  fs.readdir(filepath, function (err, files) {
    if (err) {
      console.log(err);
      res.send(500);
    } else {
      console.log(files);
      for (var i = 0; i < files.length; i++) {
        var filedir = filepath + "/" + files[i]
        var notice = fs.readFileSync(filedir, 'utf-8');
        data.push(JSON.stringify({body : marked(notice)}))
        console.log(data);
        //res.send(data);
          }
          res.send(data);
      }
    })
  })*/

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = "";
  if (err) {
    res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">' + err + '</div>';
  }
  next();
});

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 200
}))

app.use(indexRouter)

app.use('/', indexRouter);
app.use('/plan', indexRouter);
app.use('/history', indexRouter);
app.use('/contribution', indexRouter);
app.use('/register', indexRouter);
app.use('/login', indexRouter);
app.use('/adminlogin', indexRouter);
app.use('/administration', indexRouter);
app.use('/sendemail', indexRouter);
app.use('/users', usersRouter);
app.use('/logout', indexRouter);
app.use('/create', indexRouter);
app.use('/publish', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
