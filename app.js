const express = require("express");
let app =  express();
const bodyParser = ("body-parser");


app.get("/", function(req, res){
 res.send("Welcome to landing page");
});



app.get("*", function(req, res){
    res.send("Ooops Somthing Went Wrong!!!");
   });
let PORT= process.env.PORT || 9000;
app.listen(PORT, process.env.IP, function(){
    console.log(`Yelcamp app is listening to Port ${PORT}`);
});