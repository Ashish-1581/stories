const Story =require ('../model/StoryModel.js')
const User=require('../model/User.js')

const createLike = async (req, res) => {
  const { storyId, slideId } = req.body;
  const userId = req.userId;

  try {
      const story = await Story.findById(storyId);
      const slide = story.slides.id(slideId);
      
      if (slide.likedBy.includes(userId)) {
         
          slide.likes -= 1;
          slide.likedBy = slide.likedBy.filter(id => id.toString() !== userId);
          await story.save();
          return res.status(200).json({ message: "Unliked successfully", story });
      } else {
          
          slide.likes += 1;
          slide.likedBy.push(userId);
          await story.save();
          return res.status(200).json({ message: "Liked successfully", story });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update like status" });
  }
};
  

const createBookmark=async (req, res) => {
  const { storyId, slideId } = req.body;
  const userId = req.userId;

  try {
      const story = await Story.findById(storyId);
      const slide = story.slides.id(slideId);

     
      const alreadyBookmarked = slide.bookmarkedBy.includes(userId);

      if (alreadyBookmarked) {
         
          slide.bookmarkedBy.pull(userId);
      } else {
         
          slide.bookmarkedBy.push(userId);
      }

      await story.save();
      res.status(200).json({ message: alreadyBookmarked ? "Unbookmarked successfully" : "Bookmarked successfully", slide });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

const getBookmarks = async (req, res) => {
    const userId = req.userId;

    try {
       
        const stories = await Story.find({
            "slides.bookmarkedBy": userId
        });

       
        const bookmarkedSlides = stories.flatMap(story => 
            story.slides
                .map((slide, index) => {
                    if (slide.bookmarkedBy.includes(userId)) {
                        return {
                            ...slide.toObject(),  // Convert Mongoose document to plain object
                            storyId: story._id,    // Add the storyId to the slide
                            slideIndex: index       // Add the index of the slide
                        };
                    }
                    return null; 
                })
                .filter(slide => slide !== null) // Filter out nulls
        );

        res.status(200).json(bookmarkedSlides);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




 
module.exports={createLike,createBookmark,getBookmarks}
 


    

        