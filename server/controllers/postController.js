import fs from 'fs'
import Post from '../models/Post.js'
import imagekit from '../configs/imageKit.js'
import User from '../models/User.js'


//add post
const addPost = async (req,res) =>{
    try {
        const {userId} = req.auth()
        const {content, post_type} = req.body
        const images = req.files

        let image_urls = []

        if(images.length){
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path)
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: `post_img_${userId}_${Date.now()}.jpg`,
                        folder: "tasnet/posts",
                    })
                
                    const url = imagekit.url({
                        path: response.filePath,
                        transformation: [
                            {width: '1280'},
                            {quality: '80'},
                            {format: 'webp'},
                        ]
                    })
                
                    return url
                })
            )
        }
        const newPost = await Post.create({
            user:userId,
            content,
            image_urls,
            post_type
        })
        res.json({success:true, newPost , message:"post created"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})

    }
}

//get posts
const getFeedPosts = async (req,res) =>{
    try {
        const {userId} = req.auth()
        const user = await User.findById(userId)

        const usersId = [userId, ...user.connections, ...user.following]
        const posts = await Post.find({user: {$in: usersId}}).populate('user').sort({createdAt:-1})
        
        res.json({success:true, posts})
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



export {addPost, getFeedPosts, likePost}