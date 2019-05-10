let express =  require("express");
let router = express.Router();
let Campground= require("../models/campground");

//Show all campgrounds
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campground: allCampgrounds});
        }
    });    
});
//Save new campground to the db
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
    res.render("campgrounds/new");
});
//Display  Campground by ID
router.get("/:id", function(req, res){
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

module.exports = router;