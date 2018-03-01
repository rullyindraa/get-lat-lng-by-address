var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.get('/', (req, res) => 
    res.render('index.pug')
);

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyD0Ww3--cBIzTpsWAKfD1kW_3yTmfYUxQ4'
});

function getLatLong(address, res) {
  return new Promise(function(resolve, reject) {
    googleMapsClient.geocode({
      address: address
    }, function(err, response) {
      if (!err) {
        resolve(response.json.results[0].geometry.location.lat);
        resolve(response.json.results[0].geometry.location.lng);
        var latitude = response.json.results[0].geometry.location.lat;
        var longitude = response.json.results[0].geometry.location.lng;
        res.render('index', { locationInfo: 'Latitude: ' + latitude +
        '\nLongitude: ' + longitude, hasil: 'Location of ' + address});
      } else {
        reject(new Error('Could not find the location ' + address));
        //var error = new Error('Could not find the location ' + address;
        res.render('index', { locationInfo: 'Could not find the location' + address});
      }
    });
  });
}

app.post('/', function(req, res) {
  console.log(req.body.address);
  var address = req.body.address;
  getLatLong(address, res);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

