
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
    
    // Ordered list of constraints from most ideal to most basic
    const constraintOptions = [
      { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { facingMode: 'user' }, audio: false },
      { video: { width: { ideal: 640 } }, audio: false },
      { video: true, audio: false }
    ];

    let lastError: any = null;
    let stream: MediaStream | null = null;

    for (const constraints of constraintOptions) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (stream) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Camera attempt with constraints ${JSON.stringify(constraints)} failed:`, err.name);
      }
    }

    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      // Wait for metadata to be loaded to ensure video is ready
      videoRef.current.onloadedmetadata = () => {
        setLoading(false);
      };
    } else {
      setLoading(false);
      if (lastError?.name === 'NotFoundError' || lastError?.name === 'DevicesNotFoundError') {
        setError("No camera detected on this device. Please connect a camera or check your hardware.");
      } else if (lastError?.name === 'NotAllowedError' || lastError?.name === 'PermissionDeniedError') {
        setError("Camera access was denied. Please update your browser settings to allow camera use.");
      } else {
        setError("Could not start camera. Please ensure no other app is using it and refresh.");
      }
    }
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
        // Draw the current video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const base64 = dataUrl.split(',')[1];
        onCapture(base64);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/5">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/90 backdrop-blur-xl z-50">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
            <span className="text-3xl text-red-500">!</span>
          </div>
          <p className="font-black text-white uppercase tracking-widest mb-2">Device Error</p>
          <p className="text-white/50 text-xs leading-relaxed max-w-[200px] mb-8">{error}</p>
          <button 
            onClick={startCamera}
            className="px-8 py-3 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:bg-blue-500 active:scale-95 transition-all"
          >
            Reconnect Camera
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ transform: 'scaleX(-1)' }} // Mirror the preview for natural selfie feel
            className={`w-full h-full object-cover transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
              <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Initializing Lens</p>
            </div>
          )}

          {!loading && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-72 h-[28rem] flex items-center justify-center">
                {/* Face Area Guide */}
                <div className="absolute inset-0 border border-white/10 rounded-[50%_50%_45%_45%] shadow-[0_0_100px_rgba(37,99,235,0.05)] pulse-ring"></div>
                
                {/* Tech Corners */}
                <div className="absolute top-0 left-0 w-14 h-14 border-t-2 border-l-2 border-blue-500/40 rounded-tl-[3.5rem]"></div>
                <div className="absolute top-0 right-0 w-14 h-14 border-t-2 border-r-2 border-blue-500/40 rounded-tr-[3.5rem]"></div>
                <div className="absolute bottom-0 left-0 w-14 h-14 border-b-2 border-l-2 border-blue-500/40 rounded-bl-[3.5rem]"></div>
                <div className="absolute bottom-0 right-0 w-14 h-14 border-b-2 border-r-2 border-blue-500/40 rounded-br-[3.5rem]"></div>
                
                {/* Scanner Dots */}
                <div className="absolute top-1/4 left-10 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/4 right-10 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-700"></div>
                <div className="absolute bottom-1/4 left-10 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-1/4 right-10 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-500"></div>
              </div>
            </div>
          )}

          <div className="absolute bottom-12 left-0 right-0 flex justify-center px-4 z-20">
             <button
               onClick={captureFrame}
               disabled={loading}
               className="group relative w-24 h-24 flex items-center justify-center active:scale-90 transition-all disabled:opacity-0"
             >
               <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-2xl scale-125 group-hover:bg-blue-600/40 transition-all"></div>
               <div className="relative w-20 h-20 bg-white rounded-full border-[8px] border-black/10 shadow-2xl flex items-center justify-center p-1">
                 <div className="w-full h-full rounded-full bg-gradient-to-tr from-neutral-100 to-white flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-2 border-black/5" />
                 </div>
               </div>
             </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraView;
