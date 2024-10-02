const mongoose=require('mongoose')
const User=require('./User')

const slideSchema=new mongoose.Schema({
    
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
        required:true,},

        likes:{
            type:Number,
            required:true,
            default:0,
        },
        likedBy: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [], 
        }],
        bookmarkedBy: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        }]
 
    })
    const storySchema=new mongoose.Schema({
        slides:[slideSchema],
        category:{
            type:String,
            required:true,
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:User,
            required:true,
        }
      
    })

module.exports=mongoose.model('Story',storySchema);

    

