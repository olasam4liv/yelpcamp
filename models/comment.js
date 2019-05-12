let mongoose = require("mongoose");
let commentSchema = new mongoose.Schema({
    commentText: String,
    Author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        commentAuthor: String 
    },
    date: String
    


});                         

module.exports=  mongoose.model("Comment", commentSchema);



