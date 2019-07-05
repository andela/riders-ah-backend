import express from 'express';
import bodyParser from 'body-parser';
import errorhandler from 'errorhandler';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import routes from './routes';
import registerApiDocEndpoint from './config/swagger';
import pass from './config/passport/localstrategy';
import initEventListener from './helpers/utils/eventHandlers';

initEventListener();

const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();

app.use(cors());

app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
  })
);

// Normal express config defaults
app.use(bodyParser.urlencoded({ limit: '500mb', extended: false, parameterLimit: 500000 }));
app.use(bodyParser.json({ limit: '500mb' }));
app.use(passport.initialize());
pass(passport);
app.use('/html', express.static(`${__dirname}/html`));

if (!isProduction) {
  app.use(errorhandler());
}


registerApiDocEndpoint(app);
app.use(routes);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Handle application error
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  let error = {};
  if (!isProduction) {
    error = err;
  }
  res.status(err.status || 500);
  if (err.message === 'Validation error') {
    res.json({
      status: 409,
      errors: {
        body: error.errors[0].message
      }
    });
  }
  if (err.message === 'SequelizeDatabaseError') {
    res.json({
      status: 401,
      errors: {
        body: 'Unable to access database'
      }
    });
  }
  res.json({
    errors: {
      message: err.message,
      error
    }
  });
});


export default app;
