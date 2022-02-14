const express = require("express");

const { PORT, MONGODB_URL } = require("./config");

const app = express(); //Top level fucntion
const { connect } = require("mongoose");
const { engine } = require("express-handlebars");

const session = require("express-session");
const passport = require("passport");

// importing all router starts here
const EmployeeRoute = require("./Route/employee");
const { join } = require("path");
const Handlebars = require("handlebars");
var methodOverride = require("method-override");
const flash = require("connect-flash");
const AuthRoute = require("./Route/auth");
require("./middlewares/passport")(passport);

//!======================== DATABASE CONNECTION STARTS HERE=========================
let DataBaseConnection = async () => {
  await connect(MONGODB_URL);
  console.log("Database Connected");
};
DataBaseConnection();

//!======================== DATABASE CONNECTION ENDS HERE===========================

// ?=====================toDo TEMPLATE ENGINE MIDDLEWARE STARTS HERE===============
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
// ?=====================toDo TEMPLATE ENGINE MIDDLEWARE STARTS HERE===============

// !=================BuiltIn Middleware starts here=================
app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "node_modules")));
app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
// session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session()); // it will maanage sessions of server side

// connect flash middleware
app.use(flash());
// !=================BuiltIn Middleware ends here===================

// ?==============HANDLEBARS HELPER CLASSES STARTS HERE====================
Handlebars.registerHelper("trimString", function (passedString) {
  let theString = passedString.slice(6);
  return new Handlebars.SafeString(theString);
});
// ?==============HANDLEBARS HELPER CLASSES ENDS HERE======================

// =====================Set Global Variables===========================
app.use(function (req, res, next) {
  res.locals.SUCCESS_MESSAGE = req.flash("SUCCESS_MESSAGE");
  res.locals.ERROR_MESSAGE = req.flash("ERROR_MESSAGE");
  res.locals.errors = req.flash("errors");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  let userData = req.user || null;
  res.locals.finalData = Object.create(userData);
  res.locals.username = res.locals.finalData.username;
  next();
});
//!========= routing Paths for emplyoees starts here ==============
app.use("/employee", EmployeeRoute);
app.use("/auth", AuthRoute);
//!========= routing Paths for emplyoees ends here ==============

// Listen  a Port
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`App is running on Port number : ${PORT}`);
});
