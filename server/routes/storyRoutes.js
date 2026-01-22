import express from 'express'
import {addStory, getStories} from '../controllers/storyController.js'
import { protect } from '../middlewares/auth.js'
import { upload } from '../configs/multer.js'

const storyRouter = express.Router()

storyRouter.post('/create', upload.single('media') ,protect, addStory)
storyRouter.get('/get', protect, getStories)

export default storyRouter