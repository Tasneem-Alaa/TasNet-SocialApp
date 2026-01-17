import React, { useEffect, useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { ImageIcon, X } from 'lucide-react'
import toast from 'react-hot-toast'

const CreatePost = () => {

  const [content,setContent] = useState('')
  const [images,setImages] = useState([])
  const [loading,setLoading] = useState(false)

  const user = dummyUserData

  const handleSubmit = async ()=> {

  }


  return (
    <div className='min-h-screen bg-linear-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create Post</h1>
          <p className='text-slate-600'>Share your thoughts with the world</p>
        </div>

        {/* form */}
        <div className='max-w-xl bg-white p-4 sm:p-8 rounded-xl
        shadow-md space-y-4'>
          {/* Header */}
          <div className='flex items-center gap-3'>
            <img src={user.profile_picture} className='rounded-full shadow w-12 h-12' alt="" />
            <div>
              <h2 className='font-semibold'>{user.full_name}</h2>
              <p className='text-sm text-gray-500'>@{user.username}</p>
            </div>
          </div>

          {/* Text area */}
          <textarea className='w-full resize-none max-h-20 mt-4
          outline-none placeholder-gray-400' placeholder="What's happening?" 
          onChange={(e)=>setContent(e.target.value)} value={content}/>

          {/* images */}
          {
            images.length > 0 && 
            <div className='flex flex-wrap gap-2 mt-4'>
              {images.map((img,i)=>(
                <div key={i} className=' relative group'>
                  <img src={URL.createObjectURL(img)} className='h-40 rounded-md'/>
                  <div onClick={()=>setImages(images.filter((_,index)=>index!==i))} className=' absolute hidden group-hover:flex justify-center
                  items-center top-0 bottom-0 left-0 right-0 bg-black/40
                  rounded-md cursor-pointer'>
                    <X className='w-6 h-6 text-white'/>
                  </div>
                </div>
              ))}
            </div>
          }
          {/* bottom bar */}
          <div className='flex items-center justify-between pt-3 border-t
          border-gray-300'>
            <label htmlFor="images" className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer'>
              <ImageIcon className='size-6' />
            </label>

            <input type="file" id='images' accept='image/*'  hidden multiple 
            onChange={(e)=>setImages([...images, ...e.target.files])}/>

            <button disabled={loading} onClick={()=>toast.promise(
              handleSubmit(),
              {
                loading: 'uploading ...',
                success: <p>Post Added</p>,
                error: <p>Post Not Added</p>
              }
            )} className='py-2 px-8 mt-6 mx-6 rounded-lg bg-linear-to-r from-purple-800 to-pink-400 text-white font-bold 
            transition-all duration-300 ease-in-out text-sm
            hover:scale-105 hover:shadow-[0_0_20px_rgba(167,123,234,0.6)] 
            hover:from-purple-500 hover:to-pink-300 active:scale-95 cursor-pointer'>
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost