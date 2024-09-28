const Story =require ('../model/StoryModel.js')
const BookmarkModel=require('../model/BookmarkModel.js')
const User=require('../model/User.js')

const createLike=async(req,res)=>{
    const {storyId,slideId}=req.body;


    try{
        const story=await Story.findById(storyId);
        const slide=story.slides.id(slideId);
        slide.likes=slide.likes+1;
        await story.save();
        res.status(200).json(story);
    }
    catch(err){
        res.status(500).json(err);
    }   
}

const createBookmark=async(req,res)=>{
    const {heading,description,mediaUrl,mediaType}=req.body;
    const userId=req.userId;
    const bookmark=new BookmarkModel({
        heading,
        description,
        mediaUrl,
        mediaType,
        userId,
    })
    try{
        await bookmark.save();
        res.status(200).json(bookmark);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getBookmarks=async(req,res)=>{
    const userId=req.userId;
    try{
        const bookmarks=await BookmarkModel.find({userId});
        res.status(200).json(bookmarks);
    }
    catch(err){
        res.status(500).json(err);
    }
}


 
module.exports={createLike,createBookmark,getBookmarks}
 


    

        