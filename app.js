const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/User");

// Connect to the MongoDB
mongoose.connect("mongodb://localhost/snow", { useNewUrlParser: true, useUnifiedTopology: true });

// Initialize Express
const app = express();

// Middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Call express sessions
app.use(
  require("express-session")({
    secret: "This is an amazing secret and I hate this authentication code",
    resave: false,
    saveUninitialized: false
  })
);

// Tell express to use passport
app.use(passport.initialize());
app.use(passport.session());

// This below line is where we are telling Passport to create a new LocalStrategy using the User.authenticate() method that is coming from passportLocalMongoose (User.js);
passport.use(new LocalStrategy(User.authenticate()));

// These 2 lines are responsible for reading the session and uncoding the same.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This is our custom function to determine if a user is authenticated or not.
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// ************************************************************************
// ************************************************************************
// ************************** ROUTES ***************************************
// ************************************************************************
// ************************************************************************

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => res.render("login"));

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// This is where we receive the request to signup the user
app.post("/register", (req, res) => {
  // Here we are only sending the username to the database and not password.
  // We pass password to the register method as 2nd parameter & the register method will hash the password.
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.render("register");
    }
    // If there is no error then the below code will run, which will show the secret route
    // We are also specifying that we want to use the local strategy (email & password). In future, we can use other strategies like Google, Twitter, Facebook, etc.
    passport.authenticate("local")(req, res, () => {
      res.redirect("/secret");
    });
  });
});

// This is where we receive the request to already exisitng accounts.
// Now, here we use passport.authenticate the same way we used in the register route, but this time we pass it as a middleware.
// Middleware is the code that run before any callback.
app.post("/login", passport.authenticate("local", { successRedirect: "/secret", failureRedirect: "/login" }), (req, res) => {});

// *** This route needs to be secured ***
app.get("/secret", isLoggedIn, (req, res) => {
  res.render("secret");
});

// Listen to the requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening to port: ${PORT}`);
});
