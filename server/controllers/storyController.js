import fs from 'fs'
import imagekit from '../configs/imageKit.js'
import User from '../models/User.js'
import Story from '../models/Story.js'
import { inngest } from '../inngest/index.js'


//add story
const addStory = async (req,res) =>{
    try {
        const {userId} = req.auth()
        const {content, media_type, background_color} = req.body
        const media = req.file

        let media_url = ''

        if(media_type==='image' || media_type==='video'){
            const fileBuffer = fs.readFileSync(media.path)
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: `story_media_${userId}_${Date.now()}.jpg`,
                folder: "tasnet/posts",
            })
            media_url = response.url
                
        }

        const newStory = await Story.create({
            user:userId,
            content,
            media_url,
            media_type,
            background_color
        })

        //schedule story deletion after 24 hours
        await inngest.send({
            name: 'app/story.delete',
            data: {stoyId: newStory._id}
        })

        res.json({success:true, newStory , message:"story created"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

//get stories
const getStories = async (req,res) =>{
    try {
        const {userId} = req.auth()
        const user = await User.findById(userId)

        const usersId = [userId, ...user.connections, ...user.following]
        const stories = await Story.find({user: {$in: usersId}}).populate('user').sort({createdAt:-1})
        
        res.json({success:true, stories})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})

    }
}

//like post
const likePost = async (req,res) =>{
    try {
        const {userId} = req.auth()
        const {postId} = req.body

        const post = await Post.findById(postId)
        const user = await User.findById(userId)

        if(post.likes_count.includes(userId)){
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            res.json({success:true, message: 'Post unliked'})
        }else{
            post.likes_count.push(userId)
            await post.save()
            res.json({success:true, message: 'Post liked'})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})

    }
}



export {addStory, getStories,}