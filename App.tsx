
import React, { useState, useCallback } from 'react';
import { AppState, AnalysisResult, Hairstyle } from './types';
import { HAIRSTYLES, ICONS } from './constants';
import CameraView from './components/CameraView';
import { analyzeFace, applyHairstyle } from './services/gemini';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.CAMERA);
  const [photo, setPhoto] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Hairstyle | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = async (base64: string) => {
    setPhoto(base64);
    setState(AppState.ANALYZING);
    setIsProcessing(true);
    
    try {
      const result = await analyzeFace(base64);
      setAnalysis(result);
      setState(AppState.STYLE_SELECTION);
    } catch (error) {
      console.error("Analysis failed", error);
      setState(AppState.CAMERA);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyStyle = async (style: Hairstyle) => {
    if (!photo) return;
    setSelectedStyle(style);
    setState(AppState.GENERATING);
    setIsProcessing(true);

    try {
      const generated = await applyHairstyle(photo, style.prompt);
      setResultImage(generated);
      setState(AppState.RESULT);
    } catch (error) {
      alert("Something went wrong while generating your hairstyle. Please try again.");
      setState(AppState.STYLE_SELECTION);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setState(AppState.CAMERA);
    setPhoto(null);
    setAnalysis(null);
    setSelectedStyle(null);
    setResultImage(null);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-black text-white relative overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Premium Header */}
      <header className="p-6 pb-2 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
           <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
             <ICONS.Sparkles />
           </div>
           <div>
             <h1 className="text-xl font-[900] tracking-tighter leading-none italic uppercase">Raza<span className="text-blue-500 not-italic">Saloon</span></h1>
             <p className="text-[9px] text-white/30 uppercase tracking-[0.25em] font-black mt-1.5 flex items-center gap-2">
               <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> AI Virtual Lab
             </p>
           </div>
        </div>
        {state !== AppState.CAMERA && (
          <button 
            onClick={reset}
            className="p-3 glass-card rounded-full hover:bg-white/10 active:scale-90 transition-all"
          >
            <ICONS.Refresh />
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 relative w-full h-full flex flex-col px-4 pb-4 overflow-hidden mt-2">
        
        {state === AppState.CAMERA && (
          <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-700">
            <div className="flex-1 relative rounded-[2.5rem] overflow-hidden group shadow-2xl">
              <CameraView isActive={true} onCapture={handleCapture} />
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-max max-w-[85%]">
                <div className="glass-card px-6 py-3.5 rounded-2xl border border-white/10 text-center shadow-2xl glow-blue">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">System Online