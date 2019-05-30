let express =  require("express");
let router = express.Router({mergeParams: true});
let Campground= require("../models/campground");
let Comment= require("../models/comment");
let middleware = require("../middleware/index");

//Comment New
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, getComment){
        if(err){
            req.flash("error", "Campground not found");
            console.log(err);
        }else{
        res.render("comments/new", {campground: getComment}); 
    }   
    });    
});

//Comment Save
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, getComment){
        if(err){
            req.flash("error", "Campground not found")
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong")
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.commentAuthor = req.user.username;
                    comment.save();
                    getComment.comments.push(comment);
                    getComment.save();
                    req.flash("success", `${comment.author.commentAuthor.toUpperCase()} Succesfully created comment`)
                    console.log(comment);
                    res.redirect('/campgrounds/' + getComment._id); 
                }
            });
    }   
    });    
});

//Edit Comment Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error", "Comment not found");
            console.log(err);
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });     
});

//Save Edited Comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, commentUpdated){
        if(err){
            req.flash("error", "Comment not found");
            console.log(err);
            res.redirect("back");
            
        }else{
            req.flash("success", "Comment updated successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });      
});

//Destroy Comment Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, success){
        if(err){
            req.flash("error", "Comment not found");
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted successfully");
            console.log("Comment Successfully Removed");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;