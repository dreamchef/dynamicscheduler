// --------------------------------
//          CONFIGURATION
/// --------------------------------
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
const app = express();
const fs = require('fs');
const https = require("https");
const axios = require('axios');

app
  .use(express.static(path.join(__dirname)))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.get('/', (req, res) => res.render('pages/index.ejs'));


// --------------------------------
//          PREFERENCES VIEW ROUTES
/// --------------------------------
app.get('/prefs', (req, res) => res.render('pages/prefs', {
  numRanges: 1
}));

app.get('/prefs/:ranges', (req, res) => res.render('pages/prefs', {
  numRanges: req.params['ranges']
}));


// --------------------------------
//          TASKS VIEW ROUTES
/// --------------------------------
app.get('/tasks', (req, res) => res.render('pages/tasks'));


// --------------------------------
//          EVENTS VIEW ROUTES
/// --------------------------------
app.get('/events', (req, res) => res.render('pages/events'));


// --------------------------------
//          SCHEDULE VIEW ROUTES
/// --------------------------------
app.get('/schedule', (req, res) => res.render('pages/schedule'));