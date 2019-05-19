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
                    comment.author.id = req.user._id;
                    comment.author.commentAuthor = req.user.username;
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


//Edit Comment Route
router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });     
});

//Save Edited Comment
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, commentUpdated){
        if(err){
            console.log(err);
            res.redirect("back");
            
        }else{
            res.redirect("/campgrounds/" + req.params.id);
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