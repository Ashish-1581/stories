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
        required:true,}
 
    })
    const storySchema=new mongoose.Schema({
        slides:[slideSchema],
        category:{
            type:String,
            required:true,
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        }
      
    })

module.exports=mongoose.model('Story',storySchema);

    

