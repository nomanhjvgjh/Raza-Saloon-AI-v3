
import React, { useRef, useEffect, useState } from 'react';
import { ICONS } from '../constants';

interface CameraViewProps {
  onCapture: (base64: string) => void;
  isActive: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isActive]);

  const startCamera = async () => {
    setLoading(true);
    setError(null);
    
    // Try multiple configurations in order of preference
    const constraints = [
      {
        video: { 
          facingMode: 'user',
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        },
        audio: false
      },
      {
        video: { facingMode: 'user' },
        audio: false
      },
      {
        video: true,
        audio: false
      }
    ];

    let success = false;
    for (const constraint of constraints) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraint);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          success = true;
          break;
        }
      } catch (err) {
        console.warn("Camera constraint failed, trying fallback...", err);
      }
    }

    if (!success) {
      setError("No camera found or access denied. Please check your permissions.");
    }
    setLoading(false);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const base64 = dataUrl.split(',')[1];
        onCapture(base64);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/5">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/90 backdrop-blur-xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
            <span className="text-2xl text-red-500">!</span>
          </div>
          <p className="font-bold text-red-400 mb-2">Camera Error</p>
          <p className="text-white/60 text-sm leading-relaxed">{error}</p>
          <button 
            onClick={startCamera}
            className="mt-6 px-6 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
          >
            Retry Access
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ transform: 'scaleX(-1)' }} // Mirror the preview
            className={`w-full h-full object-cover transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}

          {/* Premium AR Guides */}
          {!loading && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-72 h-[26rem] flex items-center justify-center">
                {/* Face Area Highlight */}
                <div className="absolute inset-0 border-[1px] border-white/10 rounded-[50%_50%_45%_45%] shadow-[0_0_80px_rgba(255,255,255,0.03)] pulse-ring"></div>
                
                {/* Minimalist Tech Borders */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-blue-500/40 rounded-tl-[3rem]"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-blue-500/40 rounded-tr-[3rem]"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-blue-500/40 rounded-bl-[3rem]"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-blue-500/40 rounded-br-[3rem]"></div>
              </div>
            </div>
          )}

          <div className="absolute bottom-12 left-0 right-0 flex justify-center px-4">
             <button
               onClick={captureFrame}
               disabled={loading}
               className="group relative w-20 h-20 flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50 disabled:scale-90"
             >
               <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl scale-125 group-hover:bg-blue-500/40 transition-all"></div>
               <div className="relative w-16 h-16 bg-white rounded-full border-[6px] border-black/5 shadow-2xl flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full bg-gradient-to-tr from-white via-white to-neutral-200" />
                 <div className="absolute inset-[3px] rounded-full border border-black/5" />
               </div>
             </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraView;
