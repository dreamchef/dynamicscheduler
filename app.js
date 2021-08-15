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

/////////////////////////////
//      USER AUTH STATE    //
/////////////////////////////
let user = null; // for dev

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  // we will be saving our db as a file on this path
  storage: 'database.sqlite', // or ':memory:'
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
  end: DataTypes.STRING,
  user: DataTypes.STRING
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
  user: DataTypes.INTEGER
}, { sequelize, modelName: 'event' });

class WorkRange extends Model {}
WorkRange.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  startTime: DataTypes.STRING,
  endTime: DataTypes.STRING,
  user: DataTypes.STRING
}, { sequelize, modelName: 'workrange' });

class User extends Model {}
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  password: DataTypes.STRING,
  dailyVariety: DataTypes.INTEGER,
  sessionVariety: DataTypes.INTEGER,
  sessionLength: DataTypes.INTEGER
}, { sequelize, modelName: 'user' });

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
// PRIVACY AND TERMS ROUTE //
/////////////////////////////
app.get('/privacy', (req, res) => res.render('pages/privacy.ejs'));

/////////////////////////////
//      LOGIN ROUTES       //
/////////////////////////////
app.get('/', (req, res) => res.render('pages/login.ejs', {
  msg: ''
}));

app.post('/login', urlencodedParser, async function (req, res) {
  let msg = '';
  await sequelize.sync();
  let userQuery = await User.findAll({where: {name: req.body.username}});
  if(userQuery[0] != null){
    if(userQuery[0].password == req.body.password) {
      user = req.body.username;
      res.redirect('/tasks');
    }
    else {
      msg = 'incorrect password';
    }
  }
  else {
    msg = 'username does not exist';
  }

  res.render('pages/login.ejs', {
    msg: msg
  });

});

/////////////////////////////
//      LOGOUT ROUTE       //
/////////////////////////////
app.get('/logout', function (req, res) {
  user = null;
  res.redirect('/');
});


/////////////////////////////
//    REGISTER ROUTES      //
/////////////////////////////
app.get('/register', (req, res) => res.render('pages/register.ejs', {
  msg: ''
}));

app.post('/register', urlencodedParser, async function (req, res) {
  let msg = '';
  await sequelize.sync();
  let userQuery = await User.findAll({where: {name: req.body.username}});
  if(userQuery[0] == null) {
    if(req.body.password == req.body.confirmPassword) {
      let newUser = await User.create({
        name: req.body.username,
        password: req.body.password,
        dailyVariety: 50,
        sessionVariety: 50,
        sessionLength: 1
      });
      await WorkRange.create({
        startTime: '09:00',
        endTime: '17:00',
        user: req.body.username
      })
      user = req.body.username;
      res.redirect('/tasks');
    }
    else {
      msg = 'password does not match confirmation'
    }
  }
  else {
    msg = 'account already exists for this username';
  }

  res.render('pages/register.ejs', {
    msg: msg
  });
});

/////////////////////////////
//  PREFERENCES ROUTES     //
/////////////////////////////
app.get('/prefs', async function (req, res) {
  if(user != null) {

    await sequelize.sync();
    userPrefs = await User.findAll({where: {name: user}});
    userRanges = await WorkRange.findAll({where: {user: user}});
    console.log(userRanges);
    res.render('pages/prefs', {
      userPrefs: userPrefs,
      userRanges: JSON.stringify(userRanges)
    });
  }
  else {
    res.render('pages/login', {
      msg: 'please login to access the page'
    });
  }
});

app.post('/prefs/save', urlencodedParser, async function (req, res) {
  await sequelize.sync();
  await User.update({ 
    dailyVariety: req.body.dailyVar,
    sessionVariety: req.body.sessionVar,
    sessionLength: req.body.sessionLen
  },{where: {name: user} });

  console.log(numRanges = req.body);

  numRanges = ((Object.keys(req.body).length - 3)/2) - 1; // three non-working times fields, and two fields per work range
  await WorkRange.findAll({where: {user: user}})
  .then(result => {
    for (const row of result){
        // Make sure to wait on all your sequelize CRUD calls
        WorkRange.update({
          startTime: req.body['start'+numRanges.toString()],
          endTime: req.body['end'+numRanges.toString()],
        },{ where: { id: row.id }});
        console.log('range at index',numRanges,'updated');
        numRanges--;
    }
  });
  for(numRanges; numRanges >= 0; numRanges--){ // for new ranges, create new entries in database
    await WorkRange.create({
      startTime: req.body['start'+numRanges.toString()],
      endTime: req.body['end'+numRanges.toString()],
      user: user
    });
    console.log('range at index',numRanges,'updated');
  }
  console.log(userRanges = await WorkRange.findAll({where: {user: user}}));
  res.redirect('/prefs');
});

/////////////////////////////
//  TASKS VIEW ROUTES      //
/////////////////////////////
app.get('/tasks', urlencodedParser, async function(req, res) {
  if(user != null) {
    await sequelize.sync();
    const tasks = await Task.findAll({where: {user: user}});
    const types = await Type.findAll(); // for type dropdown (delayed feature)
    res.render('pages/tasks', {
      tasks: tasks,
      types: types
    });
  }
  else {
    res.render('pages/login', {
      msg: 'please login to access the page'
    });
  }
});

app.post('/tasks/create', urlencodedParser, async function(req, res) {
  if(user != null) {
    await Task.create({
      name: req.body.newTaskName,
      deadline: req.body.newTaskDeadline,
      deadlineTime: req.body.newTaskDeadlineTime,
      length: req.body.newTaskLength,
      type: req.body.newTaskType,
      start: null,
      end: null,
      user: user
    });
    res.redirect('/tasks');
  }
  else {
    res.render('pages/login', {
      msg: 'please login to access the page'
    });
  }
});


////////////////////////////
//  EVENTS VIEW ROUTES    //
////////////////////////////
app.get('/events', urlencodedParser, async function(req, res) {
  if(user != null) {
  await sequelize.sync();
    const events = await Event.findAll({where: {user: user}});
    res.render('pages/events', {
      events: events
    });
  }
  else {
    res.render('pages/login', {
      msg: 'please login to access the page'
    });
  }
});

app.post('/events/create', urlencodedParser, async function(req, res) {
  if(user != null) {
    await Event.create({
      name: req.body.newEventName,
      start: req.body.newEventStart,
      startTime: req.body.newEventStartTime,
      end: req.body.newEventEnd,
      endTime: req.body.newEventEndTime,
      user: user
    });
    res.redirect('/events');
  }
  else {
    res.render('pages/login', {
      msg: 'please login to access the page'
    });
  }
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