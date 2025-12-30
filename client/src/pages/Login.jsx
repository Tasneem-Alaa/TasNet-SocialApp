import React, { useState, useEffect, useRef } from 'react';
import GLOBE from 'vanta/dist/vanta.globe.min';
import * as THREE from 'three';
import {assets} from '../assets/assets'
import {Star} from 'lucide-react'
import TypingWords from "../components/ui/flip-words";
import { SignIn } from '@clerk/clerk-react';
import { dark } from "@clerk/themes";

const Login = () => {
  const myRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const words = ["matter", "last", "inspire", "connect", "grow"]
  const [showSingin,onShowSignin] = useState(false)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        GLOBE({
          el: myRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xab7bea,
          color2: 0xffffff,
          backgroundColor: 0x0,
          size:0.8,
          maxDistance:15,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div 
      ref={myRef} 
      className="relative min-h-screen w-screen flex flex-col md:flex-row bg-[linear-gradient(to_bottom,#000000,#1a0b2e,#000000)]"
    >
      <style>{`
        canvas { 
          opacity: 0.8 !important;
          mix-blend-mode: screen;
        }
      `}</style>

      <div className='flex flex-1 flex-col items-start justify-between p-6 md:p-10 lg:pl-20'>
        <div className='flex gap-2 items-center'>
          <img src={assets.logo} alt="" className='h-7 object-contain'/>
          <h1 className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-3xl font-black pointer-events-none">
            TasNet
          </h1>
        </div>
        <div className='flex flex-col gap-7 '>
          <div className='flex items-center gap-3 max-md:mt-10'>
            <img src={assets.group_users} alt="" className='h-6 md:h-8'/>
            <div>
              <div className='flex'>
                {Array(5).fill(0)
                .map((_,i)=>(<Star key={i} className='size-4 md:size-4 text-transparent fill-amber-400'/>))
                }
              </div>
              <p className='text-white pointer-events-none text-sm'>Used by 12K+ developers</p>
            </div>
          </div>
          <p className="text-white text-4xl md:text-5xl md:pb-2 font-bold tracking-widest pointer-events-none bg-clip-text">
            More than friends.<br/> Real connections<br/> that{" "}
            <TypingWords
              words={words}
              className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            />
          </p>
          <p className="text-white text-2xl tracking-widest pointer-events-none ">
            Connect with people, share moments, and build your community on{" "}
            <span className="text-white font-bold">TasNet</span>.
          </p>
          <button className="bg-linear-to-r from-purple-600 to-pink-400 w-50 h-10 rounded-3xl text-white font-bold 
                            transition-all duration-300 ease-in-out
                            hover:scale-105 hover:shadow-[0_0_20px_rgba(167,123,234,0.6)] 
                            hover:from-purple-500 hover:to-pink-300 active:scale-95 cursor-pointer"
                  onClick={onShowSignin}>
            Let's Go
          </button>
        </div>
        <span className='h-10'></span>
      </div>
      <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
        { showSingin && <SignIn 
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#ab7bea",
            colorText: "white",
            colorBackground: "transparent",
          },
          elements: {
            card: {
              backgroundColor: "rgba(0, 0, 0, 0.5)", 
              backdropFilter: "blur(12px)", 
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)",
            },
            footer: {
              backdropFilter: "blur(16px)", 
              backgroundColor: "rgba(0, 0, 0, 0.5)", 
              background: "rgba(0, 0, 0, 0.5)",
            },
            headerTitle: "text-white font-bold italic",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 transition-all",
            formButtonPrimary: "bg-[#ab7bea] hover:bg-[#9359e0] border-0",
            footerActionLink: "text-[#ab7bea] hover:text-[#c4a1f3]",
            dividerLine: "bg-white/10",
            dividerText: "text-gray-500"
          }
        }}
        /> }
      </div>
    </div>
  );
};

export default Login;