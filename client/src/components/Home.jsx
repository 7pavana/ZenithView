import React, { useRef, useState } from 'react';
import { Upload, Brain, Video, X, Loader2, BarChart3, Shield, Zap } from 'lucide-react'; 
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) return toast.error("Please select a video first!");

    setIsLoading(true);
    const formData = new FormData();
    formData.append('video', file);
    try {
      const response = await axios.post('http://localhost:5000/predict', formData);
      const { dominant_emotion, timeline, ai_feedback } = response.data;
      navigate('/results', { state: { dominant_emotion, timeline, ai_feedback } });
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Server connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      <ToastContainer theme="dark" position="bottom-right" />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />

      {/* Navigation Header */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-emerald-500 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Brain size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ZenithView</span>
        </div>
      </nav>
      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Zap size={14} /> AI-Powered Presentation Coach
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
            Elevate your <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Stage Presence
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
            Upload or record your speech to get deep multimodal emotion analytics. 
            Refine your delivery with AI-generated coaching insights.
          </p>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
          
          <div className="relative bg-slate-900/60 border border-slate-800/50 backdrop-blur-3xl rounded-[2rem] p-8 shadow-2xl">
            {!videoPreview ? (
              <div 
                className="group/drop relative border-2 border-dashed border-slate-700 rounded-3xl p-12 transition-all hover:border-blue-500/50 hover:bg-blue-500/5 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover/drop:rotate-12 transition-transform shadow-xl">
                  <Upload className="text-blue-400" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Speech</h3>
                <p className="text-slate-500 text-center text-sm">
                  Drag and drop or <span className="text-blue-400 font-bold underline">browse files</span>
                </p>
                
                <div className="mt-8 flex items-center gap-4 w-full px-4">
                  <div className="h-px flex-1 bg-slate-800" />
                  <span className="text-xs text-slate-600 font-bold">OR</span>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>

                <Link to="/Video" onClick={(e) => e.stopPropagation()}>
                  <button className='mt-8 px-6 py-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg'>
                    <Video size={18} className="text-emerald-400" /> Record Live
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video group/vid">
                  <button 
                    onClick={() => setVideoPreview(null)} 
                    className="absolute top-4 right-4 z-10 p-2 bg-red-500/90 hover:bg-red-500 rounded-full opacity-0 group-hover/vid:opacity-100 transition-all shadow-xl"
                    disabled={isLoading} 
                  >
                    <X size={18} />
                  </button>
                  <video src={videoPreview} controls className="w-full h-full object-contain" />
                </div>
                
                <button 
                  onClick={handleSubmit} 
                  disabled={isLoading} 
                  className={`w-full font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 text-lg ${
                    isLoading ? 'bg-slate-800 text-slate-500' : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:brightness-110 shadow-blue-500/20'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" /> Neural Analysis in Progress...
                    </>
                  ) : (
                    <>
                      <Brain size={22} /> Run Zenith Analysis
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <section className="relative z-10 max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-8 pb-20">
        {[
          { icon: <Shield className="text-blue-400" />, title: "Privacy First", desc: "Processing is session-based. Your videos aren't used for training." },
          { icon: <BarChart3 className="text-emerald-400" />, title: "Metric Fusion", desc: "Combining CNN facial landmarks with 1D-CNN audio tonal analysis." },
          { icon: <Zap className="text-purple-400" />, title: "Instant Feedback", desc: "Gemini-powered coaching reports generated in seconds." }
        ].map((feat, i) => (
          <div key={i} className="group p-6 bg-slate-900/40 border border-slate-800/50 rounded-3xl hover:border-slate-700 transition-all">
            <div className="mb-4 bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">{feat.icon}</div>
            <h4 className="text-lg font-bold mb-2 text-slate-200">{feat.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}