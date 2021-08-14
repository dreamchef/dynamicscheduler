/////////////////////////////
//      NODE MODULES       //
/////////////////////////////
const path = require('path');
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const { Sequelize, Model, DataTypes } = require('sequelize');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  // we will be saving our db as a file on this path
  storage: 'database3.sqlite', // or ':memory:'
});
module.exports = { 
  sequelize 
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


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
  deadline: DataTypes.STRING,
  deadlineTime: DataTypes.STRING,
  length: DataTypes.INTEGER,
  type: DataTypes.INTEGER,
  start: DataTypes.STRING,
  end: DataTypes.STRING
}, { sequelize, modelName: 'task' });

class Event extends Model {}
Event.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  start: DataTypes.STRING,
  startTime: DataTypes.STRING,
  end: DataTypes.STRING,
  endTime: DataTypes.STRING,
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
app.get('/tasks', urlencodedParser, async function(req, res) {
  await sequelize.sync();
  const tasks = await Task.findAll();
  const types = await Type.findAll();
  res.render('pages/tasks', {
    tasks: tasks,
    types: types
  });
});

app.post('/tasks/create', urlencodedParser, async function(req, res) {
  await Task.create({
    name: req.body.newTaskName,
    deadline: req.body.newTaskDeadline,
    deadlineTime: req.body.newTaskDeadlineTime,
    length: req.body.newTaskLength,
    type: req.body.newTaskType,
    start: null,
    end: null
  });
  res.redirect('/tasks');
});


////////////////////////////
//  EVENTS VIEW ROUTES    //
////////////////////////////
app.get('/events', urlencodedParser, async function(req, res) {
  await sequelize.sync();
  const events = await Event.findAll();
  res.render('pages/events', {
    events: events
  });
});

app.post('/events/create', urlencodedParser, async function(req, res) {
  await Event.create({
    name: req.body.newEventName,
    start: req.body.newEventStart,
    startTime: req.body.newEventStartTime,
    end: req.body.newEventEnd,
    endTime: req.body.newEventEndTime
  });
  res.redirect('/events');
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
      type: 0,
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