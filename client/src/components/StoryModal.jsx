import { ArrowLeft, Palette, Sparkle, TextIcon, Upload } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import {useAuth, useUser} from '@clerk/clerk-react'
import toast from 'react-hot-toast';
import api from '../api/axios';


function StoryModal({setShowModal,fetchStories}) {

    const { user } = useUser();
    const username = user.username || user.firstName || user.emailAddresses[0].emailAddress

    const bgColors = ["#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ca8a04",
    "#0d9488"]

    const [mode,setMode] = useState("text")
    const [background, setBackgraound] = useState(bgColors[0])

    const [text,setText] = useState("")
    const [media,setMedia] = useState(null)
    const [previewUrl,setPreviewUrl] = useState(null)

    const {getToken} = useAuth()

    const MAX_VIDEO_DURATION = 60
    const MAX_VIDEO_SIZE_MB = 50
    const handelMediaUpload = (e)=>{
        const file = e.target.files?.[0]
        if(file){
            if(file.type.startsWith('video')){
                if(file.size>MAX_VIDEO_SIZE_MB * 1024 * 1024){
                    toast.error(`Video size can not exceeed ${MAX_VIDEO_SIZE_MB} MB`)
                    setMedia(null)
                    setPreviewUrl(null)
                    return
                }
                const video = document.createElement('video')
                video.preload='metadata'
                video.onloadedmetadata = ()=>{
                    window.URL.revokeObjectURL(video.src)
                    if(video.duration>MAX_VIDEO_DURATION){
                        toast.error(`Video duration can not exceeed 1m`)
                        setMedia(null)
                        setPreviewUrl(null)
                        
                    }else{
                        setMedia(file)
                        setMode('media')
                        setPreviewUrl(URL.createObjectURL(file))
                        setText('')
                    }
                }
                
                video.src=URL.createObjectURL(file)
            }else if(file.type.startsWith('image')){
                setMedia(file)
                setMode('media')
                setPreviewUrl(URL.createObjectURL(file))
                setText('')
                
            }
        }
    }

    const handelCreateStory = async ()=>{
        const media_type = mode === 'media'? media?.type.startsWith('image') ? 'image' : 'video' : 'text'
        if(media_type==='text' && !text){
            throw new Error("Please enter some text");
            
        }
        let formData = new FormData()
        formData.append('content',text)
        formData.append('media_type',media_type)
        formData.append('media',media)
        formData.append('background_color',background)

        const token = await getToken()
        try {
            const {data} = await api.post('/api/story/create',formData,{
                headers:{Authorization:`Bearer ${token}`}
            })
            if(data.success){
                setShowModal(false)
                toast.success("Story created successfully")
                fetchStories()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }

    } 

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])


    return (
        <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur 
        text-white flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-4 flex items-center justify-between'>
                    <button onClick={()=> setShowModal(false)} className='text-white p-2 cursor-pointer'>
                        <ArrowLeft />
                    </button>
                    <h2 className='text-lg font-semibold'>Create Story</h2>
                    <span className='w-10'></span>
                </div>
                <div className='rounded-lg h-96 flex items-center justify-center
                relative' style={{backgroundColor: background}}>
                    {
                        mode === 'text' &&(
                            <textarea className='bg-transparent text-white w-full h-full
                            p-6 text-lg resize-none focus:outline-none' 
                            placeholder={`What's on your mind ${username}?`} 
                            onChange={(e)=>setText(e.target.value)} value={text} />
                        )
                    }
                    {
                        mode === 'media' && previewUrl && (
                            media?.type?.startsWith('image') ? (
                                <img src={previewUrl} alt="" className='object-contain
                                max-h-full'/>
                            ) : (
                                <video src={previewUrl} className='object-contain
                                max-h-full'/>
                            )
                        )
                    }

                </div>

                <div className='flex mt-4 gap-3'>
                    {bgColors.map((color)=>(
                        <button key={color} className='w-6 h-6 rounded-full
                        ring cursor-pointer' style={{backgroundColor: color}}
                        onClick={()=>setBackgraound(color)}/>
                    ))}
                    {/* Custom color picker */}
                    {/* <span className='w-6 h-6'></span> */}
                    <label
                        className=" ml-auto relative w-6.5 h-6.5 rounded-full cursor-pointer
                        bg-linear-to-tr from-pink-700 via-yellow-50 to-blue-700"
                        title="Custom color"
                        >
                        <input
                            type="color"
                            value={background}
                            onChange={(e) => setBackgraound(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </label>

                </div>

                <div className='flex gap-2 mt-4'>
                    <button onClick={()=>{setMode('text'); setMedia(null); setPreviewUrl(null)}} 
                    className={`flex-1 flex items-center justify-center gap-2 
                    p-2 rounded-xl cursor-pointer ${mode === 'text'? "bg-white text-black":"bg-zinc-800"}`}>
                        <TextIcon className='w-5 h-5'/>
                        Text
                    </button>
                    <label className={`flex-1 flex items-center justify-center gap-2 
                    p-3 rounded-xl cursor-pointer ${mode === 'media'? "bg-white text-black":"bg-zinc-800"}`}>
                        <input onChange={handelMediaUpload}
                        type="file" accept='image/*, video/*' className='hidden'/>
                        <Upload className='w-5 h-5'/>
                        Photo/Video
                    </label>
                </div>

                <button onClick={()=>toast.promise(handelCreateStory(),{
                    loading: 'Saving...',
                })} className='flex items-center justify-center gap-2 bg-linear-to-r 
                from-purple-900 to-pink-400 rounded-xl text-white font-bold 
                py-3 mt-4 w-full transition-all duration-300 ease-in-out
                hover:scale-105 hover:shadow-[0_0_20px_rgba(167,123,234,0.6)] 
                hover:from-purple-500 hover:to-pink-300 active:scale-95 cursor-pointer'>
                    <Sparkle size={18}/>Create Story
                </button>

            </div>
        </div>
    )
}

export default StoryModal