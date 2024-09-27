const express=require("express")
const router=express.Router()
const authMiddleware=require("../middleware/authMiddleware")

const { createStory, updateStory, getStoryById,getStories,getUserStories } =require("../controllers/Story")

router.post('/create',authMiddleware,createStory);

router.patch('/update/:storyId',authMiddleware,updateStory);

router.get('/get/:storyId',getStoryById);

router.get('/get',getStories);

router.get('/getUserStories',authMiddleware,getUserStories);

module.exports=router;