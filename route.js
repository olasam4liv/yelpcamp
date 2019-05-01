const express = require("express");
let app =  express();


app.get("/campgrounds", function(req, res){
    res.render("index");
   });
   

app.export("app.js")