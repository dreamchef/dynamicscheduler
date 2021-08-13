/////////////////////////////
//      NODE MODULES       //
/////////////////////////////
const path = require('path');
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');


/////////////////////////////
//     DATABASE MODELS     //
/////////////////////////////
class Task extends Model {}
Task.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  deadline: DataTypes.DATE,
  length: DataTypes.INTEGER,
  type_id: DataTypes.INTEGER,
  start: DataTypes.DATE,
  end: DataTypes.DATE
}, { sequelize, modelName: 'task' });

class Event extends Model {}
Event.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  start: DataTypes.DATE,
  end: DataTypes.DATE
}, { sequelize, modelName: 'event' });

class Pref extends Model {}
Pref.init({
  name: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  setting: DataTypes.INTEGER
}, { sequelize, modelName: 'pref' });

class Type extends Model {}
Type.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING
}, { sequelize, modelName: 'type' });


/////////////////////////////
//   APP CONFIGURATION     //
/////////////////////////////
app
  .use(express.static(path.join(__dirname)))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


/////////////////////////////
//    HOMEPAGE ROUTES      //
/////////////////////////////
app.get('/', (req, res) => res.render('pages/index.ejs'));


/////////////////////////////
//  PREFERENCES ROUTES     //
/////////////////////////////
app.get('/prefs', (req, res) => res.render('pages/prefs', {
  numRanges: 1,
  ranges: [{start: '00:00:00', end: '10:00:00'}],
  dailyVar: 0,
  sessionVar: 0,
  sessionLen: 10
}));

app.get('/prefs/:ranges', (req, res) => res.render('pages/prefs', {
  numRanges: req.params['ranges']
}));


/////////////////////////////
//  TASKS VIEW ROUTES      //
/////////////////////////////
app.get('/tasks', function(req, res) {
  var tasks = [
    {

      id: 0,
      name: 'example task',
      deadline: new Date(),
      length: 1.5,
      type_id: 0,
      start: new Date(),
      end: new Date()
    }
  ];
  var types = [
    {
      id: 0,
      name: 'example type'
    }
  ]
  res.render('pages/tasks', {
    tasks: tasks,
    types: types
  });
});


////////////////////////////
//  EVENTS VIEW ROUTES    //
////////////////////////////
app.get('/events', function(req, res) {
  var events = [
    {

      id: 0,
      name: 'example event',
      start: new Date(),
      end: new Date()
    }
  ];
  res.render('pages/events', {
    events: events
  });
});


/////////////////////////////
//  SCHEDULE VIEW ROUTES   //
/////////////////////////////
app.get('/schedule', function(req, res) {
  let events = [
    {

      id: 0,
      name: 'example event',
      start: new Date(),
      end: new Date()
    }
  ];
  let tasks = [
    {

      id: 0,
      name: 'example task',
      deadline: new Date(),
      length: 1.5,
      type_id: 0,
      start: new Date(),
      end: new Date()
    }
  ];
  let types = [
    {
      id: 0,
      name: 'example type'
    }
  ]
  let prefs;
  res.render('pages/schedule', {
    tasks: tasks,
    types: types,
    events: events,
    prefs: prefs
  });
});