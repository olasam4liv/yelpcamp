const express = require("express");
let app =  express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelpcamp-v2", {useNewUrlParser: true } );
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public/image")); 
app.set("view engine", "ejs")
 
//SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});                            //collection name                
let Campground =  mongoose.model("campground", campgroundSchema);

 
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
            res.render("index", {campground: allCampgrounds});
        }
    });
    //
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
    res.render("new");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, getEachCampground){
        if(err){
            //display error if not found
            console.log(err)
        }else{
            //Display the found data from the db
            res.render("show", {campground: getEachCampground});
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