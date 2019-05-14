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
router.post("/", isLoggedIn, function(req, res){
    // get data from form and add to campground db
    let name = req.body.name;
    let image =  req.body.image;
    let description = req.body.description;
    let date =  new Date().getHours(0).toString();  
    let author = {
        id: req.user._id,
        username: req.user.username,
        //date =  new Date("Y-m-d")
    }
    let newCampgrounds = [{name: name, image: image, description: description, author, date: date}]
    //Craete a new Campground and save to db
    Campground.create(newCampgrounds, function(err, saveData){
            if(err){
                console.log(err)
            } else{
                //redirect to campgrounds 
                console.log(saveData);
                res.redirect("/campgrounds");
            }
        }); 
});

//Display form to create new Campground
router.get("/new", isLoggedIn, function(req, res){
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
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;