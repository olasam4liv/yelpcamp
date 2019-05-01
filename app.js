const express = require("express");
let app =  express();
let bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public/image")); 
app.set("view engine", "ejs")
 

let campgrounds =  [
    {name: " Sam", image: "samuel.jpg" },
    {name: " Adebimpe", image: "adebimpe.jpg" },
    {name: " Samuel", image: "post.png" },
    {name: " Sam", image: "post.png" },
    {name: " Adebimpe", image: "post.png" },
    {name: " Samuel", image: "post.png" }
]
 
//ROUTE
app.get("/", function(req, res){
 res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("index", {campground: campgrounds});
   });
   
app.post("/campgrounds", function(req, res){
    // get data from form
    let name = req.body.name;
    let image =  req.body.image;
    let newCampgroungds = {name: name, image: image}
    campgrounds.push(newCampgroungds);
    res.redirect("/campgrounds");

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