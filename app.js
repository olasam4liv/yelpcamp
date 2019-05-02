const express = require("express");
let app =  express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelpcamp-v2", {useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public/image")); 
app.set("view engine", "ejs")
 
//SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});                            //collection name                
let Campground =  mongoose.model("campground", campgroundSchema);

// Campground.create({    
//     name: " Sam", 
//     image: "samuel.jpg" 
// }, function(err, saveData){
//     if(err){
//         console.log(err)
//     } else{
//         console.log("Newly Created Campground", saveData)
//     }
// })

// let campgrounds =  [
//     {name: " Sam", image: "samuel.jpg" },
//     {name: " Adebimpe", image: "adebimpe.jpg" },
//     {name: " Samuel", image: "post.png" },
//     {name: " Sam", image: "post.png" },
//     {name: " Adebimpe", image: "post.png" },
//     {name: " Samuel", image: "post.png" }
// ]
 
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
   
app.post("/campgrounds", function(req, res){
    // get data from form
    let name = req.body.name;
    let image =  req.body.image;
    let newCampgrounds = {name: name, image: image}
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

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});





app.get("*", function(req, res){
    res.send("Ooops Something Went Wrong!!!");
   });
let PORT= process.env.PORT || 9000;
app.listen(PORT, process.env.IP, function(){
    console.log(`Yelpcamp app is listening to Port ${PORT}`);
});