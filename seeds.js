let mongoose =  require("mongoose");
let Campground = require("./models/campground");
var Comment =  require("./models/comment");


let data = [
    {
        name: "Samuel",
        image: "samuel.jpg",
        description: "This is samuel"
    },
    {
        name: "Adebimpe",
        image: "adebimpe.jpg",
        description: "This is Adebimpe"
    }
]

function seedDb(){
    Campground.deleteMany({}, function(err, res){
        if(err){
            console.log(err);
        }else{
            console.log("Data removed");
        }
        data.forEach(function(seed){
            Campground.create(seed, function(err, camp){
                if(err){
                    console.log(err);
                }else{
                    console.log("Data created");
                    console.log(camp);
                    Comment.create(
                        {
                        commentText: "This is comment",
                        commentAuthor: "This is the author"
                         }, function(err, com){                            
                            if(err){
                                console.log(err);
                            }else{
                                camp.comments.push(com);
                                camp.save();
                                console.log("Comment created");
                                console.log(com)
                            } 
                         });
                }
            });
        });
    });
}
module.exports = seedDb;