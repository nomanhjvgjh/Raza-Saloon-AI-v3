
import React, { useState } from 'react';
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
      alert("AI analysis failed. Let's try picking a style manually!");
      setAnalysis({
        faceShape: "Oval",
        recommendations: ["Textured Fringe", "Classic Side Part"],
        features: ["Standard Symmetry", "Clean Hairline"]
      });
      setState(AppState.STYLE_SELECTION);
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
      console.error("Generation failed", error);
      alert("The AI had trouble styling your photo. Please try a different angle or lighting.");
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
            className="p-3 glass-card rounded-full hover:bg-white/10 active:scale-90 transition-all border border-white/5"
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
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Scanner Ready</p>
                   <p className="text-[11px] text-white/60 leading-relaxed font-semibold">Align your face for pro-grade styling analysis</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === AppState.ANALYZING && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="relative w-72 h-[26rem]">
              <img 
                src={`data:image/jpeg;base64,${photo}`} 
                className="w-full h-full object-cover rounded-[2.5rem] grayscale brightness-50 opacity-30 border border-white/5"
              />
              <div className="scan-line" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                 <div className="text-center">
                   <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 animate-pulse">Deep Mapping</p>
                 </div>
              </div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-[900] italic tracking-tight uppercase">Scanning Mesh</h2>
              <p className="text-white/40 text-sm max-w-[260px] mx-auto font-medium leading-relaxed">Calculating facial geometry, symmetry, and hair density for the perfect match.</p>
            </div>
          </div>
        )}

        {state === AppState.STYLE_SELECTION && analysis && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600/10 to-indigo-900/10 border border-white/5 rounded-[2.5rem] p-7 mb-6 shadow-2xl glass-card">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <ICONS.Check />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Analysis Complete</h3>
                  <p className="text-2xl font-[900] italic uppercase">{analysis.faceShape} Type</p>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-5 font-medium">
                For an <span className="text-blue-400 font-black">{analysis.faceShape}</span> profile, we suggest styles that maximize volume and sharpen your jawline.
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.features.map((f, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-white/40 uppercase tracking-widest">{f}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-[900] uppercase tracking-tight italic">Trending Lenses</h3>
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Swipe Up</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pb-12 snap-scrollbar pr-1">
              {HAIRSTYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleApplyStyle(style)}
                  className="group relative flex flex-col p-6 glass-card rounded-[2rem] text-left transition-all hover:bg-white/[0.08] hover:border-blue-500/40 hover:-translate-y-1 active:scale-95 shadow-xl"
                >
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all border border-white/5 shadow-inner">
                    {style.icon}
                  </div>
                  <span className="font-black text-xs uppercase tracking-tight text-white/90">{style.name}</span>
                  <p className="text-[10px] text-white/30 mt-1.5 leading-snug line-clamp-2 font-semibold uppercase tracking-tight">{style.description}</p>
                  
                  <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-blue-600 p-2 rounded-full shadow-lg scale-75"><ICONS.Sparkles /></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {state === AppState.GENERATING && (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-12 animate-in fade-in duration-700">
            <div className="relative">
              <div className="w-48 h-48 border-[8px] border-blue-500/5 border-t-blue-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 glass-card rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                  <span className="text-6xl animate-pulse drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">{selectedStyle?.icon}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-[900] italic uppercase tracking-tight leading-none">Synthesizing<br/><span className="text-blue-500">New Look</span></h2>
              <p className="text-white/30 text-xs max-w-[240px] mx-auto font-black uppercase tracking-widest leading-relaxed">
                Raza Saloon AI is rendering realistic follicles & depth maps.
              </p>
            </div>
            <div className="w-full max-w-[240px] space-y-6">
              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full animate-[loading_5s_ease-in-out_infinite] shadow-[0_0_20px_rgba(37,99,235,0.6)]" style={{width: '80%'}} />
              </div>
              <div className="flex flex-col gap-2.5 text-[8px] text-white/15 uppercase tracking-[0.4em] font-black text-center">
                <p className="animate-pulse">Neural Style Transfer</p>
                <p className="animate-pulse" style={{animationDelay: '0.5s'}}>Hairline Segmentation</p>
                <p className="animate-pulse" style={{animationDelay: '1s'}}>Lighting Integration</p>
              </div>
            </div>
          </div>
        )}

        {state === AppState.RESULT && resultImage && (
          <div className="flex-1 flex flex-col animate-in zoom-in-95 duration-1000 overflow-hidden">
            <div className="flex-1 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] relative bg-neutral-950 border border-white/10 group">
              <img src={resultImage} className="w-full h-full object-cover" alt="Hairstyle result" />
              
              {/* Premium Result Overlays */}
              <div className="absolute top-8 left-8 space-y-3">
                 <div className="bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl flex items-center gap-2.5 border border-blue-400/30">
                    <ICONS.Sparkles /> Generated by Raza AI
                 </div>
                 <div className="bg-black/60 backdrop-blur-2xl text-white/70 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-xl">
                    {selectedStyle?.name} Lens
                 </div>
              </div>

              {/* Dynamic Watermark */}
              <div className="absolute bottom-8 left-8 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                 <p className="text-[11px] font-black italic tracking-[0.4em] uppercase text-white/50">Raza Saloon Lab // v2.5</p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={reset}
                className="flex-[0.4] py-6 glass-card rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95 border border-white/5"
              >
                <ICONS.ArrowLeft /> Retake
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = resultImage;
                  link.download = `raza-look-${selectedStyle?.id}.png`;
                  link.click();
                }}
                className="flex-1 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] active:scale-95 border border-blue-400/30"
              >
                <ICONS.Download /> Get the Look
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Premium Tab Navigation */}
      <footer className="px-10 py-8 border-t border-white/[0.04] flex justify-between items-center bg-black/95 backdrop-blur-3xl z-50">
         <button onClick={reset} className="flex flex-col items-center gap-2.5 opacity-30 hover:opacity-100 transition-all">
           <ICONS.Camera />
           <span className="text-[8px] uppercase font-[900] tracking-widest">Scanner</span>
         </button>
         <div className="relative group">
            <div className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            <button className="flex flex-col items-center gap-2.5 text-blue-500">
              <ICONS.Sparkles />
              <span className="text-[8px] uppercase font-[900] tracking-widest">Styles</span>
            </button>
         </div>
         <button className="flex flex-col items-center gap-2.5 opacity-30 hover:opacity-100 transition-all">
           <div className="w-5 h-5 border-[2px] border-white rounded-md flex items-center justify-center text-[7px] font-black">PRO</div>
           <span className="text-[8px] uppercase font-[900] tracking-widest">Catalog</span>
         </button>
      </footer>

      {/* Full-screen Loading for Critical States */}
      {isProcessing && (state === AppState.ANALYZING) && (
         <div className="fixed inset-0 z-[100] bg-black/10 backdrop-blur-[2px] pointer-events-none" />
      )}
    </div>
  );
};

export default App;
