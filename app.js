require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const UserModel = require('./model/models');

const mongoAtlasUri = "mongodb+srv://" + process.env.MONGO_ATLAS_USER + ":" + process.env.MONGO_ATLAS_PWD + "@cluster0.anqmb.mongodb.net/passport-jwt?retryWrites=true&w=majority";

mongoose.connect(mongoAtlasUri,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

// require('./auth/auth');

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

// Handle errors.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(3000, () => {
  console.log('Server started.')
});
