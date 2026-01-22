// get user data using userId
import fs from 'fs'
import User from "../models/User.js"
import imagekit from '../configs/imageKit.js'
import Connection from '../models/Connections.js'
import Post from '../models/Post.js'

const getAllUsersData = async(req , res)=> {
    try {
        const users = await User.find()
        res.json({success: true, users})
        
    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const getUserData = async(req , res)=> {
    try {
        const {userId} = req.auth()
        const user = await User.findOne({ _id: userId });
        console.log("Clerk UserID:", userId); // شوفي القيمة اللي طالعة في الترمينال
        if(!user) {
            return res.json({success: false, message: "user not found"})
        }
        res.json({success: true, user})
        
    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// update user data
const updateUserData = async(req , res)=> {
    try {
        const {userId} = req.auth()
        let {username, bio , location, full_name} = req.body


        const olduser = await User.findById(userId)
        
        let finalUsername = username || olduser.username;

        if(username && olduser.username !== username){
            const userExists = await User.findOne({username})
            if(userExists){
                // username already takes
                finalUsername = olduser.username
            }
        }
        const updatedData = {
            username: finalUsername,
            bio,
            location,
            full_name
        }

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]

        if(profile){
            const buffer = fs.readFileSync(profile.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: `profile_${userId}_${Date.now()}.jpg`,
                folder: "tasnet/profiles",
            })

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {height: "512", width: "512", crop: "at_max"},
                    {quality: '80'},
                    {format: 'webp'},
                ]
            })

            updatedData.profile_picture = url;
            fs.unlinkSync(profile.path);
        }
        
        if(cover){
            const buffer = fs.readFileSync(cover.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: `cover_${userId}_${Date.now()}.jpg`,
                folder: "tasnet/covers",
            })
            
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {width: '1280', height: "720", crop: "maintain_ratio"},
                    {quality: '80'},
                    {format: 'webp'},
                ]
            })
            
            updatedData.cover_photo = url;
            fs.unlinkSync(cover.path);
        }
        
        const user = await User.findByIdAndUpdate(userId,updatedData,{new:true})

        res.json({success:true, user, message: 'Profile updated successfully'})

    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//find user using username, email, location, name
const discoverUser = async(req , res)=> {
    try {
        const {userId} = req.auth()
        const {input} = req.body

        const allUser = await User.find({
            $or:[
                {username: new RegExp(input, 'i')},
                {email: new RegExp(input, 'i')},
                {full_name: new RegExp(input, 'i')},
                {location: new RegExp(input, 'i')}
            ]
        })

        const fillteredUsers = allUser.filter(user=> user._id !== userId)

        res.json({success: true, users: fillteredUsers})

        
    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//follow user
const followUser = async(req , res)=> {
    try {
        const {userId} = req.auth()
        const {id} = req.body

        const user = await User.findById(userId)

        if(user.following.includes(id)){
            
            return res.json({success: false, message: 'You are already following this user'})
        }
        
        user.following.push(id);
        await user.save()
        
        const toUser = await User.findById(id)
        toUser.followers.push(userId);
        await toUser.save()

        res.json({success: true, message: 'Now you are following this user'})
        
    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//unfollow user
const unfollowUser = async(req , res)=> {
    try {
        const {userId} = req.auth()
        const {id} = req.body

        const user = await User.findById(userId)
        
        user.following = user.following.filter(user => user._id !== id)
        await user.save()
        
        const toUser = await User.findById(id)
        toUser.followers = toUser.followers.filter(user => user._id !== id)
        await toUser.save()


        res.json({success: true, message: 'You are no longer following this user'})
        
    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//send connection request
const sendConnectionRequest = async (req,res)=>{
    try{
        const {userId} = req.auth()
        const {id} = req.body
        
        // check if user has sent more than 20 connection requests in the last 24 hours
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const connectionRequests = await Connection.find({from_user_id:userId, createdAt:{$gt: last24Hours}})

        if(connectionRequests.length >= 20){
            return res.json({success:false, message: "You have sent more than 20 connection requests in the last 24 hours"})
        }
        
        //check if users are already connected
        const connection = await Connection.findOne({
            $or:[
                {from_user_id: userId, to_user_id: id},
                {from_user_id: id, to_user_id: userId},
            ]
        })
        
        if(!connection){
            await Connection.create({
                from_user_id:userId,
                to_user_id:id
            })
            return res.json({success:true, message: "Connection reques sent successfully"})
        }else if(connection && connection.status == 'accepted'){

            return res.json({success:false, message: "You have sent more than 20 connection requests in the last 24 hours"})
        }
        return res.json({success:false, message: "Connection request pending"})
        
    } catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//get user connection
const getUserConnections = async (req,res)=>{
    try{
        const {userId} = req.auth()
        const user = await User.findById(userId).populate('connections followers following')

        const connections = user.connections
        const followers = user.followers
        const following = user.following

        const pendingConnections = (await Connection.find({to_user_id:userId, status:'pending'}).populate('from_user_id')).map(conn=>conn.from_user_id)

        res.json({success:true, connections, followers, following, pendingConnections })
        
    } catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//get user connection
const acceptConnectionRequest = async (req,res)=>{
    try{
        const {userId} = req.auth()
        const {id} = req.body

        
        const connection = await Connection.find({to_user_id:id, to_user_id:userId})
        
        if(!connection){
            
            return res.json({success:false, message:"connection not found" })
        }
        
        const user = await User.findById(userId)
        user.connections.push(id)
        await user.save()
        
        const toUser = await User.findById(id)
        toUser.connections.push(userId)
        await toUser.save()

        connection.status = 'accepted'
        await connection.save()

        res.json({success:true, message:"Connection accepted successfully"})
        
    } catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//get user profile
const getUserProfiles = async (req , res) =>{
    try {
        const {profileId} = req.body
        const profile = await User.findById(profileId)
        if(!profile){
            return res.json({success:false, message: "profile not found"})
        }
        const posts = await Post.find({user: profileId}).populate('user')
        res.json({success:true , profile, posts})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
        
    }
}

export {
    getUserData, 
    updateUserData, 
    discoverUser, 
    unfollowUser, 
    followUser, 
    getAllUsersData, 
    sendConnectionRequest,
    getUserConnections, 
    acceptConnectionRequest, 
    getUserProfiles
}