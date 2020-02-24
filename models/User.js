const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// This will add a bunch of functions to the user schema. Basically, this will handle how the password is stored on our DB. look at the /register POST route and you will notice that we send password as a 2nd parameter, where this "passportLocalMongoose" will come in.
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
