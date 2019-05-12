let express =  require("express");
let router = express.Router({mergeParams: true});
let Campground= require("../models/campground");
let Comment= require("../models/comment");

//Comment New
router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, getComment){
        if(err){
            console.log(err);
        }else{
        res.render("comments/new", {campground: getComment}); 
    }   
    });    
});

//Comment Save
router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, getComment){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    comment.Author.id = req.user._id;
                    comment.Author.commentAuthor = req.user.username;
                    comment.save();
                    getComment.comments.push(comment);
                    getComment.save();
                    console.log(comment);
                    res.redirect('/campgrounds/' + getComment._id); 
                }
            });
    }   
    });    
});

//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;