const express = require("express");
let app =  express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let passport = require("passport");
let LocalStrategy = require("passport-local");
let User = require("./models/user");
let commentRoutes = require("./routes/comments");
let campgroundRoutes = require("./routes/campgrounds");
let indexRoutes = require("./routes/index");
let methodOverride = require("method-override");

mongoose.connect("mongodb://localhost:27017/yelpcamp-v10", {useNewUrlParser: true }); 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"))
mongoose.set('useFindAndModify', false);

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Sam is good at what he does",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());

app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
//Requiring Routes
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);

let PORT= process.env.PORT || 9000;
app.listen(PORT, process.env.IP, function(){
    console.log(`Yelpcamp app is listening to Port ${PORT}`);
});