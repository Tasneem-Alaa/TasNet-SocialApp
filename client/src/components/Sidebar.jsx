import React from 'react'
import { assets, dummyUserData } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut } from 'lucide-react'
import {UserButton, useClerk} from '@clerk/clerk-react'
import { useSelector } from 'react-redux'

const Sidebar = ({sidebarOpen,setSidebarOpen}) => {

    const navigate = useNavigate()
    const user = useSelector((state)=>state.user.value)
    const {signOut} = useClerk()

  return (
    <div className={`w-60 xl:w-70 bg-white border-r border-gray-200 flex flex-col 
    justify-between items-center max-sm:absolute top-0 bottom-0 z-20 
    ${sidebarOpen? 'translate-x-0' : 'max-sm:-translate-x-full'} 
    transition-all duration-300 ease-in-out`}>
        <div className='w-full'>
            <div onClick={()=> navigate('/')} className='flex gap-2 items-center cursor-pointer'>
                <img src={assets.logo} className='w-9 ml-7 my-2'/>

                <h1 className="bg-linear-to-r from-purple-800 to-pink-400 bg-clip-text text-transparent text-3xl font-black pointer-events-none">
                    TasNet
                </h1>
            </div>
            <hr className='border-gray-300 mb-8'/>

            <MenuItems setSidebarOpen={setSidebarOpen}/>

            <Link to='/create-post' className='flex items-center justify-center gap-2
            py-2.5 mt-6 mx-6 rounded-lg bg-linear-to-r from-purple-800 to-pink-400 text-white font-bold 
            transition-all duration-300 ease-in-out
            hover:scale-105 hover:shadow-[0_0_20px_rgba(167,123,234,0.6)] 
            hover:from-purple-500 hover:to-pink-300 active:scale-95 cursor-pointer'>
                <CirclePlus className='w-5 h-5'/>
                Create Post
            </Link>
        </div>

        <div className='w-full border-t border-gray-200 
        p-4 px-7 flex items-center justify-between'>
            <div className='flex gap-2 items-center cursor-pointer'>
                <UserButton />
                <div>
                    <h1 className='text-sm font-medium'>{user.full_name}</h1>
                    <p className='text-xs text-gray-500'>@{user.username}</p>
                </div>
            </div>
            <LogOut onClick={signOut} className='w-4.5 text-gray-400 
            hover:text-gray-700 transition cursor-pointer'/>
        </div>
    </div>
  )
}

export default Sidebar