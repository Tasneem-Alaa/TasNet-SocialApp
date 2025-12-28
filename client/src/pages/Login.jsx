import React, { useState, useEffect, useRef } from 'react';
import GLOBE from 'vanta/dist/vanta.globe.min';
import * as THREE from 'three';

const Login = () => {
  const myRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

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
          // التريك هنا:
          backgroundColor: 0x0, // خليه أسود
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
      style={{ 
        height: '100vh', 
        width: '100%',
        // إضافة التدريج هنا (مثلاً من الأسود للبربل الغامق جداً)
        background: 'linear-gradient(to bottom, #000000, #1a0b2e, #000000)',
        position: 'relative'
      }}
    >
      {/* تأكدي إن أي canvas جوه الـ div ده واخد شفافية */}
      <style>{`
        canvas { 
          opacity: 0.8 !important; /* دي بتخلي الـ Globe نفسه شفاف شوية فيبان اللي وراه */
          mix-blend-mode: screen; /* تريك بصري بيخلي الألوان تندمج مع الخلفية بشكل رائع */
        }
      `}</style>
        <img src="/TasNet-logo.png" alt="" className='size-8 absolute top-1/12 left-1/24'/>
      <h1 className="absolute top-1/10 left-1/9 -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-black tracking-widest pointer-events-none opacity-100">
        TaSNeT
      </h1>
      <h1 className="absolute top-1/2 left-1/2 -translate-x-6/7 -translate-y-1/2 text-white text-5xl font-black tracking-widest pointer-events-none opacity-100">
        More than just friends truly connect
      </h1>
      <h1 className="absolute top-3/5 left-1/2 -translate-x-10/11 -translate-y-1/2 text-white text-3xl tracking-widest pointer-events-none opacity-100">
        connect with global communityon pingup
      </h1>
    </div>
  );
};

export default Login;