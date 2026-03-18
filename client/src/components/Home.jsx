import React, { useRef, useState } from 'react';
import { Upload, Brain, Video, X, Loader2 } from 'lucide-react'; 
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
export default function Home() {
  const navigate=useNavigate();
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
    if (!file) {
      return toast.error("Please select a video first!");
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('video', file);
    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { dominant_emotion, timeline } = response.data;
      console.log("dominant emtion:",dominant_emotion)
      navigate('/results', { state: { dominant_emotion, timeline } });
      setVideoPreview(null);
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Server connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <ToastContainer />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
      
      <h1 className="pt-10 text-center text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
        ZenithView
      </h1>

      <div className="flex flex-col items-center justify-center mt-10 px-4">
        <div className="w-full max-w-md bg-slate-800/50 border border-slate-700 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          
          {!videoPreview ? (
            <div className="group relative border-2 border-dashed border-slate-600 rounded-2xl p-10 transition-all hover:border-blue-500 hover:bg-slate-700/30 flex flex-col items-center justify-center">
              <Upload className="w-12 h-12 text-slate-400 group-hover:text-blue-400 mb-4 transition-colors" />
              <p className="text-slate-300 text-center font-medium">
                Drop or <span className="text-blue-400 underline cursor-pointer" onClick={() => fileInputRef.current.click()}>browse</span> your Video here
              </p>
              <p className="text-[20px] text-center font-medium my-2">or</p>
              <Link to="/Video">
                <button className='bg-blue-500 rounded-[10px] p-2 font-bold flex items-center gap-2'>
                  <Video size={20}/>Record Video
                </button>
              </Link>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-600 bg-black aspect-video">
              <button 
                onClick={() => setVideoPreview(null)} 
                className="absolute top-2 right-2 z-10 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                disabled={isLoading} 
              >
                <X size={16} />
              </button>
              <video src={videoPreview} controls className="w-full h-full" />
            </div>
          )}

          <div className="mt-8">
            <button 
              onClick={handleSubmit} 
              disabled={isLoading} 
              className={`w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isLoading ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
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
        </div>
      </div>
    </div>
  );
}