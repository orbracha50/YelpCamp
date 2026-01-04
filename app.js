if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const morgan = require('morgan')
const ExpressError = require('./utils/ExpressError')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoute = require('./routes/userRoutes.js')
const campgroundRoute = require('./routes/campgroundsRoutes.js')
const reviewRoute = require('./routes/reiviewRoutes.js');
const user = require('./models/user');

const dbUrl =
  process.env.MONGODB_URL ||
  'mongodb://127.0.0.1:27017/yelp-camp';

mongoose.connect(dbUrl);

mongoose.connection.on('error', console.error.bind(console, 'Mongo error:'));
mongoose.connection.once('open', () => {
  console.log('Database connected');
  console.log('Connected DB name:', mongoose.connection.name);
});
const app = express();

app.engine('ejs', engine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig))
app.use(flash())



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.loginUser = req.user;
  next();
})

app.use('/', userRoute)
app.use('/campgrounds', campgroundRoute)
app.use('/campgrounds/:id/reviews', reviewRoute)

app.get('/', (req, res) => {
  res.render('home', { loginUser: req.user });
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

console.log('DB URL exists:', !!process.env.MONGO_URL, !!process.env.MONGO_URI);
console.log('Connected DB:', mongoose.connection.name);

app.listen(3000, () => {
  console.log('Serving on port 3000')
})