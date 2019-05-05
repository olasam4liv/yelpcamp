let mongoose = require("mongoose");
let commentSchema = new mongoose.Schema({
    commentText: String,
    commentAuthor: String,
    


});                         

module.exports=  mongoose.model("Comment", commentSchema);



