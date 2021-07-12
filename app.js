//444e41b4c607c715f0fefb834226a2c
//http://openweathermap.org/img/wn/10d@2x.png
const express = require('express');
const https = require('https');
const bodyP = require('body-parser');
const app = express();
var _ = require('lodash');
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(bodyP.urlencoded({ extended: true }));
var temp = '';
var min = '';
var max = '';
var name = '';
var img = '';
var description = '';

app.get('/', function (req, res) {
  // body...
  res.sendFile(__dirname + '/index.html');
});

app.get('/failure', function (req, res) {
  res.sendFile(__dirname + '/failure.html');
});

app.post('/', function (request, response) {
  const key = '7444e41b4c607c715f0fefb834226a2c';
  name = _.capitalize(request.body.val);
  console.log(name);
  const url =
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    name +
    '&appid=' +
    key +
    '&units=metric';
  https.get(url, function (res) {
    res.on('data', function (data) {
      const weather = JSON.parse(data);
      console.log(weather);

      console.log(res.statusCode);

      if (res.statusCode === 404) {
        console.log(true);
        return response.redirect('/failure');
      }

      temp = weather.main.temp;
      console.log(temp);
      console.log('status', res.statusCode);

      min = weather.main.temp_min;
      max = weather.main.temp_max;
      description = weather.weather[0].description;
      icon = weather.weather[0].icon;
      img = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
      console.log(min, max);
      if (response.statusCode === 200) {
        response.redirect('/temperature');
      }
    });
  });

  console.log(response.statusCode);
});
console.log(temp);

app.get('/temperature', function (req, res) {
  res.render('list', {
    city: name,
    temperature: temp,
    minimum: min,
    maximum: max,
    des: description,
    image: img,
  });
});
app.get('/failure', function (req, res) {
  res.render('failure');
});

app.listen(3000, function (req, res) {
  console.log('server started');
});
