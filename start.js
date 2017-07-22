const mongoose = require('mongoose');

// Import environmental variables from our .env file
require('dotenv').config();

// Connect to our Database and handle bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`There was a movida: ${err.message}`);
});

// Import all of our models
//require('./models/Achievement');
//require('./models/User');


// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running on PORT ${server.address().port}`);
});
