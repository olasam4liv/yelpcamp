const express = require("express");
let app =  express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let Campground= require("./models/campground");
let Comment = require("./models/comment");
let passport = require("passport");
let LocalStrategy = require("passport-local");
let User = require("./models/user");
let seedDb = require("./seeds");

seedDb();
mongoose.connect("mongodb://localhost:27017/yelpcamp-v6", {useNewUrlParser: true }); 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public")); 


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
//ROUTE
app.get("/", function(req, res){
 res.render("landing");
});

//Show all campground
app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campground: allCampgrounds});
        }
    });    
});
//Save new campground to the db
app.post("/campgrounds", function(req, res){
    // get data from form
    let name = req.body.name;
    let image =  req.body.image;
    let description = req.body.description;
    let date = new Date().toDateString;
    let newCampgrounds = {name: name, image: image, description: description, date: date}
    //Craete a new Campground and save to db
    Campground.create(newCampgrounds, function(err, saveData){
            if(err){
                console.log(err)
            } else{
                //redirect to campgrounds 
                res.redirect("/campgrounds");
            }
        }); 
});
//Display form to create new Campground
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, getEachCampground){
        if(err){
            //display error if not found
            console.log(err)
        }else{
            //Display the found data from the db
            res.render("campgrounds/show", {campground: getEachCampground});
        }
    });    
});



//COMMENTS ROUTE
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, getComment){
        if(err){
            console.log(err);
        }else{
        res.render("comments/new", {campground: getComment}); 
    }   
    });    
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, getComment){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    getComment.comments.push(comment);
                    getComment.save();
                    res.redirect('/campgrounds/' + getComment._id); 
                }
            })
        
    }   
    });    
});
// ====================
//    REGISTER ROUTE
// ====================

//Show register form
app.get("/register", function(req, res){
    res.render("register");
});
//Handle Sign Up Logic
app.post("/register", function(req, res){
    let newUser= new User({username: req.body.username, email: req.body.email });     
    User.register(newUser,  req.body.password, function(err, success){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds")
        });         
    });     
});

//Show Login form
app.get("/login", function(req, res){
    res.render("login");
});

//Handle Login Logic
//app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local",
        {   successRedirect: "/campgrounds",
            failureRedirect: "/login"    
        }), function(req, res){

});

//log out logic
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.get("*", function(req, res){
    res.send("Ooops Something Went Wrong!!!");
});
let PORT= process.env.PORT || 9000;
app.listen(PORT, process.env.IP, function(){
    console.log(`Yelpcamp app is listening to Port ${PORT}`);
});