const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require("passport");
const mongoose = require("mongoose");
const logger = require('morgan');
const cors = require("cors");
const config = require("./config/index");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const lineMessageRouter = require('./routes/lineMessageAPI');
const customerRouter = require('./routes/customer');
const roomRouter = require('./routes/room');
const bookingRouter = require('./routes/booking');
const messageRouter = require('./routes/message');


//import middleware
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());

//init passport
app.use(passport.initialize());

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(logger('dev'));
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/lineMessage", lineMessageRouter);
app.use("/customer", customerRouter);
app.use("/room", roomRouter);
app.use("/booking", bookingRouter);
app.use("/message", messageRouter);

app.use(errorHandler);
module.exports = app;
