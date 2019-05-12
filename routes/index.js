let express =  require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user")

//Root Route
router.get("/", function(req, res){
    res.render("landing");
   });
   
   // ====================
   //    REGISTER ROUTE
   // ====================
   
   //Show register form
   router.get("/register", function(req, res){
       res.render("register");
   });
   //Handle Sign Up Logic
   router.post("/register", function(req, res){
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
   router.get("/login", function(req, res){
       res.render("login");
   });
   
   //Handle Login Logic
   //app.post("/login", middleware, callback)
   router.post("/login", passport.authenticate("local",
           {   successRedirect: "/campgrounds",
               failureRedirect: "/login"    
           }), function(req, res){
   
   });
   
   //Log out logic
   router.get("/logout", function(req, res){
       req.logout();
       res.redirect("/");
   })
   
//Page not found handler
   router.get("*", function(req, res){
       res.send("Ooops Something Went Wrong!!!");
   });

   module.exports = router;