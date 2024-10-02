const {createLike,createBookmark,getBookmarks} = require('../controllers/Slide');
const authMiddleware=require("../middleware/authMiddleware")

const router = require('express').Router();

router.post('/createLike',authMiddleware,createLike);
router.post('/createBookmark',authMiddleware,createBookmark);
router.get('/getBookmarks/',authMiddleware,getBookmarks);



module.exports=router;