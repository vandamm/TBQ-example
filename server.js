"use strict";

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('config');

const routes = require('./routes/quest');
const app = express();

app.set('trust proxy', 1);

app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/quest', routes);

app.use(function(req, res, next) {
  res.status(404).send('404');
});

const port = process.env.PORT || config.get('port') || 3000;
app.listen(port);
console.log('Listening on port ' + port);
