import React, { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Video as VideoIcon, StopCircle, RefreshCw, Play, Brain, Loader2, ArrowLeft } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const VideoPreview = ({ stream }) => {
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />;
};

export default function VideoRecorder() {
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } = 
    useReactMediaRecorder({ video: true });
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mediaBlobUrl) return toast.error("No recording to analyze!");

    setIsLoading(true); 
    const loadingToast = toast.info("Processing neural markers...", { autoClose: false });

    try {
      const responseBlob = await fetch(mediaBlobUrl);
      const videoBlob = await responseBlob.blob();
      const formData = new FormData();
      formData.append('video', videoBlob, 'recorded_session.webm');
      
      const result = await axios.post('http://localhost:5000/predict', formData);
      const { dominant_emotion, timeline, ai_feedback } = result.data;
      toast.dismiss(loadingToast);
      navigate("/results", { state: { dominant_emotion, timeline, ai_feedback } });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Backend analysis failed.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden flex flex-col items-center">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      <ToastContainer theme="dark" position="bottom-right" />
      <div className="relative z-10 w-full max-w-7xl px-8 py-10 flex justify-between items-center">
        <Link to="/" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700 backdrop-blur-md shadow-inner">
          <div className={`w-2 h-2 rounded-full ${status === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-300">
            {status} mode
          </span>
        </div>
      </div>

      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center space-y-10 px-4">
        
        {/* Recording Viewport */}
        <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
          {/* Viewfinder Corners */}
          <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-blue-500/30 rounded-tl-xl z-20" />
          <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-blue-500/30 rounded-tr-xl z-20" />
          <div className="absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-xl z-20" />
          <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-emerald-500/30 rounded-br-xl z-20" />
          
          {status === 'recording' ? (
            <VideoPreview stream={previewStream} />
          ) : mediaBlobUrl ? (
            <video src={mediaBlobUrl} controls className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
              <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-4 shadow-xl border border-slate-700">
                <VideoIcon size={32} className="text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">Ready to record session</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="flex items-center gap-6 p-3 bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-[2rem] shadow-2xl">
            {status !== 'recording' ? (
              <button
                onClick={startRecording}
                disabled={isLoading}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/40 disabled:opacity-50"
              >
                <Play size={20} fill="currentColor" />
                Capture Session
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-3 bg-red-500 hover:bg-red-400 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-red-900/40"
              >
                <StopCircle size={20} fill="currentColor" className="animate-pulse" />
                Finalize Recording
              </button>
            )}

            {mediaBlobUrl && (
              <button 
                onClick={() => window.location.reload()} 
                disabled={isLoading}
                className="p-4 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-700"
                title="Reset Camera"
              >
                <RefreshCw size={24} />
              </button>
            )}
          </div>

          {/* Analysis Button */}
          <button 
            onClick={handleSubmit} 
            disabled={isLoading || !mediaBlobUrl || status === 'recording'}
            className={`w-full max-w-sm font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 text-lg ${
              isLoading || !mediaBlobUrl || status === 'recording'
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                : 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:brightness-110 shadow-blue-500/20'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                Running Neural Inference...
              </>
            ) : (
              <>
                <Brain size={24} />
                Analyze Performance
              </>
            )}
          </button>
        </div>
      </main>

      {/* Tip of the day */}
      <footer className="relative z-10 mt-auto py-10 px-4">
        <p className="text-slate-600 text-sm font-mono flex items-center gap-2">
          <span className="w-1 h-1 bg-blue-500 rounded-full" />
          Tip: Ensure your face is well-lit for optimal CNN feature extraction.
        </p>
      </footer>
    </div>
  );
}