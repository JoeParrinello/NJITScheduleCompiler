var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var courses = require('./routes/courses');
var sections = require('./routes/sections');

var course = require('./models/course');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

exports.scraperSemaphore = false;

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/',express.static(path.join(__dirname, 'public')));

//find the semester for the request we are handling.
app.use(function(req,res, next){
    if (!req.query.term){
        req.query.term = course.currentSemester;
        next();
    } else {
        next();
    }
    console.log("Semester Being Used "+req.query.term);
});



app.use('/courses', courses);

app.use('/sections', sections);

app.use('/', routes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

mongoose.connect('mongodb://localhost/courseScraper', function (err) {
    if (err) {
        console.log('Unable to connect to: ' + 'mongodb://localhost/courseScraper' + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + 'mongodb://localhost/courseScraper');
    }
});

course.findCurrentSemester();

module.exports = app;

app.listen(3000);