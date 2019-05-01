const express = require("express");
let app =  express();
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public/image"));
 
app.set("view engine", "ejs")
 
app.get("/", function(req, res){
 res.render("landing");
});

let campgrounds =  [
    {name: " Sam", image: "samuel.jpg" },
    {name: " Adebimpe", image: "adebimpe.jpg" }
]

app.get("/campgrounds", function(req, res){
    res.render("index", {campground: campgrounds});
   });
   


app.get("*", function(req, res){
    res.send("Ooops Somthing Went Wrong!!!");
   });
let PORT= process.env.PORT || 9000;
app.listen(PORT, process.env.IP, function(){
    console.log(`Yelpcamp app is listening to Port ${PORT}`);
});