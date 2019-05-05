const express = require("express");
let app =  express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let Campground= require("./models/campground");
let Comment = require("./models/comment");
// let User = require("./models/user");
let seedDb = require("./seeds");

seedDb();
mongoose.connect("mongodb://localhost:27017/yelpcamp-v4", {useNewUrlParser: true }); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public/image")); 
app.set("view engine", "ejs")
 


 
//ROUTE
app.get("/", function(req, res){
 res.render("landing");
});

//View all data in db
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
    let newCampgrounds = {name: name, image: image, description: description}
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
app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, getComment){
        if(err){
            console.log(err);
        }else{
        res.render("comments/new", {campground: getComment}); 
    }   
    });    
});

app.post("/campgrounds/:id/comments", function(req, res){
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

app.get("*", function(req, res){
    res.send("Ooops Something Went Wrong!!!");
});
let PORT= process.env.PORT || 9000;
app.listen(PORT, process.env.IP, function(){
    console.log(`Yelpcamp app is listening to Port ${PORT}`);
});