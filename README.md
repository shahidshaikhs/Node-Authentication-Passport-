
# Node Authentication using Passport

### Steps to make this work
1. Download the repo to your local machine
2. In the root folder of the directory, run "npm init" which will install all the dependencies
3. Run the project by firing either "node app.js" OR "nodemon app.js"

### How does this work?
1. We create 5 GET routes out of which 4 render Home, Register, Login and Secret page. 1 of the route is only used for logout purposes.
2. We also have 2 post routes where we send the username and password. This is where the real magic happens.
3. Secret route is the route we hide from the users until and unless they are logged in. This is done using a middleware (isLoggedIn)
4. We use an NPM Package called passportLocalMongoose which adds a bunch of functions to the user schema and handles much of the storing credentials code for us. Refer: UserSchema.plugin(passportLocalMongoose); in User.js model

### More extra information

    app.use(
    require("express-session")({
    secret:  "This is an amazing secret and I hate this authentication code",
    resave:  false,
    saveUninitialized:  false
    })
    );

This code is used to call express-sessions takes in a secret, which can be anything.
Rest of the stuff in

#### Thank you!
