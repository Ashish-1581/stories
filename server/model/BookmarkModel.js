const mongoose=require('mongoose')
const User=require('./User')
const bookmarkSchema=new mongoose.Schema({
        
    heading:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    mediaUrl:{
        type:String,
        required:true,
    },
    mediaType:{
        type:String,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true,
    }})
 

module.exports=mongoose.model('Bookmark',bookmarkSchema);

