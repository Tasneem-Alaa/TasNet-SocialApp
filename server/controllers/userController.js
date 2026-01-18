// get user data using userId

import User from "../models/User.js"

const getUserData = async(req , res)=> {
    try {
        const {userId} = req.auth()
        const user = await User.findById(userId)
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
        const {username, bio , location, full_name} = req.body()


        const olduser = await User.findById(userId)
        
        !username && (username = olduser.username)

        if(olduser.username !== username){
            const user = User.findOne({username})
            if(user){
                // username already takes
                username = olduser.userame
            }
        }
        const updatedData = {
            username,
            bio,
            location,
            full_name
        }

    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export {getUserData, updateUserData}