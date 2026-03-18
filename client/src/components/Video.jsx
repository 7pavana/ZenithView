import React, { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Video as VideoIcon, StopCircle, RefreshCw, Play, Brain, Loader2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function VideoRecorder() {
  const { status, startRecording, stopRecording, mediaBlobUrl } = 
    useReactMediaRecorder({ video: true });
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mediaBlobUrl) return toast.error("No recording to analyze!");

    setIsLoading(true); 

    try {
      const responseBlob = await fetch(mediaBlobUrl);
      const videoBlob = await responseBlob.blob();
      const formData = new FormData();
      formData.append('video', videoBlob, 'recorded_session.webm');
      const result = await axios.post('http://localhost:5000/predict', formData);

      toast.success(`ZenithView detected: ${result.data.emotion}`);

      setTimeout(() => {
        navigate("/", { state: { result: result.data } });
      }, 2000);
    } catch (error) {
      console.error("Analysis Error:", error);
      toast.error("Backend analysis failed.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <ToastContainer />
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 shadow-inner">
        <div className={`w-2 h-2 rounded-full ${status === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
          System: {status}
        </span>
      </div>

      <div className="relative w-full max-w-2xl aspect-video rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl group">
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500/50 rounded-tl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-500/50 rounded-br-lg" />
        
        {mediaBlobUrl ? (
          <video 
            src={mediaBlobUrl} 
            controls 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <VideoIcon size={48} className="text-slate-700 mb-4" />
            <p className="text-slate-500 text-sm font-medium">Camera Feed Offline</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 p-2 bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-2xl">
        {status !== 'recording' ? (
          <button
            onClick={startRecording}
            disabled={isLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            <Play size={18} />
            Start Session
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 animate-pulse"
          >
            <StopCircle size={18} />
            Stop Recording
          </button>
        )}

        {mediaBlobUrl && (
          <button 
            onClick={() => window.location.reload()} 
            disabled={isLoading}
            className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
            title="Reset"
          >
            <RefreshCw size={20} />
          </button>
        )}
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={isLoading || !mediaBlobUrl || status === 'recording'}
        className={`w-[280px] font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
          isLoading 
            ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
            : 'bg-blue-600 hover:bg-blue-500 text-white'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Waiting for Results...
          </>
        ) : (
          <>
            <Brain size={20} />
            Analyze Emotion
          </>
        )}
      </button>
    </div>
  );
}