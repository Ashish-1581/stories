const Story =require ('../model/StoryModel.js')

const createStory=async(req,res)=>{
    const {slides,category}=req.body;
    const newStory=new Story({
        slides,
        category,
        userId:req.userId,
        
    })
    try{
        await newStory.save();
        res.status(200).json(newStory);
    }catch(err){
        res.status(500).json(err);
    }
}

const updateStory=async(req,res)=>{
    const {storyId}=req.params;
    const {slides,category}=req.body;
    try{
        const updatedStory=await Story.findByIdAndUpdate(storyId,{
            slides,
            category,

        },{new:true});
        res.status(200).json(updatedStory);
    }catch(err){
        res.status(500).json(err);
    }
}

const getStoryById=async(req,res)=>{

    const {storyId}=req.params;
    try{
        const story=await Story.findById(storyId);
        res.status(200).json(story);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getStories=async(req,res)=>{
const {cat}=req.query;
 let filter={};
if(cat&&cat.length>0){
    const categoryList = cat.split(",");

 filter.category = { $in: categoryList };
}
    try{
        const stories=await Story.find(filter);
        res.status(200).json(stories);
    }
    catch(err){
        res.status(500).json(err);
    }


}
const getUserStories=async(req,res)=>{

    try{
        const stories=await Story.find({userId:req.userId});
        res.status(200).json(stories);
    }
    catch(err){
        res.status(500).json(err);
    }

}



            

module.exports={createStory,updateStory, getStoryById,getStories,getUserStories};