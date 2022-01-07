// 3rd party imports
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const { environment } = require('./config');
const isProduction = environment === 'production';

// initialize express application
const app = express();

// Connect morgan middleware for logging information about
// requests and responses
app.use(morgan('dev'));

// Cookie parser middleware for parsing cookies
app.use(cookieParser());
// express.json middleware for parsing JSON bodies of requests
// with Content-Type of 'application/json'
app.use(express.json());


app.use(routes);

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }
  // helmet helps set a variety of headers to better secure your app
  app.use(helmet({
    contentSecurityPolicy: false
  }));

  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true,
      },
    })
  );

module.exports = app;
