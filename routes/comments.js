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
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });     
});

//Save Edited Comment
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, commentUpdated){
        if(err){
            console.log(err);
            res.redirect("back");
            
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });      
});

//Destroy Comment Route
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, success){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            console.log("Comment Successfully Removed");
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
function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("back");
                }else{
                    //does user own the Comment?
                    console.log(req.params.comment_id)
                    if(foundComment.author.id.equals(req.user._id)){
                        next();                       
                    }
                    else{
                        res.redirect("back");
                    }
                }         
            });  
    } else{
        res.redirect("back");
    }
}
module.exports = router;