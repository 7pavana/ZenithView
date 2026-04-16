import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BarChart3, Clock, ArrowLeft, Brain, ShieldCheck, Activity, Target } from 'lucide-react';

const emotionMetrics = {
  'Sad': { label: 'Gravitas / Depth', color: 'bg-indigo-500', glow: 'shadow-indigo-500/20', icon: '😟' },
  'Disgust': { label: 'Intense Focus', color: 'bg-orange-500', glow: 'shadow-orange-500/20', icon: '🤢' },
  'Angry': { label: 'Aggressive / Passion', color: 'bg-red-500', glow: 'shadow-red-500/20', icon: '😠' },
  'Happy': { label: 'Positive Engagement', color: 'bg-emerald-500', glow: 'shadow-emerald-500/20', icon: '😊' },
  'Fear': { label: 'High Alertness', color: 'bg-yellow-500', glow: 'shadow-yellow-500/20', icon: '😨' },
  'Neutral': { label: 'Balanced / Calm', color: 'bg-slate-500', glow: 'shadow-slate-500/20', icon: '😐' },
  'Surprise': { label: 'Dynamic Pivot', color: 'bg-pink-500', glow: 'shadow-pink-500/20', icon: '😲' },
  'N/A': { label: 'Analyzing...', color: 'bg-slate-700', glow: 'shadow-slate-700/20', icon: '⚙️' }
};

export default function Results() {
  const location = useLocation();
  const { dominant_emotion, timeline, ai_feedback } = location.state || { 
    timeline: [], 
    dominant_emotion: "N/A", 
    ai_feedback: "Neural analysis complete. Awaiting feedback stream..." 
  };

  const getFriendlyName = (emo) => emotionMetrics[emo]?.label || emo;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden pb-20">
      {/* Background Glows to match Home Page */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link to="/" className="group flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-4">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
              <span className="text-sm font-medium tracking-wide">New Session</span>
            </Link>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
              Session Intelligence
            </h1>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-xl">
             <Activity className="text-emerald-400 animate-pulse" size={20} />
             <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Analysis Status: Finalized</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Summary Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 backdrop-blur-3xl rounded-[2.5rem] p-10 flex flex-col items-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-50" />
              <div className="p-5 bg-blue-500/10 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-500">
                <Target className="text-blue-400" size={40} />
              </div>
              <p className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold mb-2">Dominant Trait</p>
              <h2 className="text-3xl font-black text-white text-center leading-tight">
                {getFriendlyName(dominant_emotion)}
              </h2>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-8">
                <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-500" /> Data Integrity
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    This analysis is based on {timeline.length} facial landmark samples processed via CNN-inference. Multimodal late fusion has been applied to normalize emotional spikes.
                </p>
            </div>
          </div>

          {/* Right Column: Timeline & AI Feedback */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Timeline Section */}
            <div className="bg-slate-900/60 border border-slate-800 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-2xl max-h-[500px] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Clock className="text-blue-400" size={22} />
                    <h3 className="text-xl font-bold">Temporal Markers</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-800 px-3 py-1 rounded-full uppercase">Real-time Stream</span>
              </div>
              
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {timeline.map((item, index) => {
                  const config = emotionMetrics[item.emotion] || emotionMetrics['Neutral'];
                  const confidence = (item.confidence || 0.85) * 100;
                  return (
                    <div key={index} className="group flex items-center gap-6 p-5 bg-slate-950/50 rounded-3xl border border-slate-800/50 hover:border-blue-500/30 transition-all hover:bg-slate-900/50">
                      <div className="text-center min-w-[50px]">
                        <span className="text-sm font-mono font-bold text-blue-500">{item.timestamp}s</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                            <span className="text-lg">{config.icon}</span> {config.label}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">CONF: {confidence.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-700 ${config.color} ${config.glow} shadow-lg`} 
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Coaching Section */}
            <div className="relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition" />
               <div className="relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl">
                        <Brain className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-extrabold tracking-tight uppercase text-slate-200">
                      Expert Feedback
                    </h3>
                  </div>
                  <div className="text-slate-300 leading-relaxed text-lg font-medium italic border-l-2 border-slate-800 pl-8">
                    "{ai_feedback}"
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-800/50 flex items-center gap-2">
                     <BarChart3 className="text-blue-500" size={16} />
                     <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Powered by ZenithView Temporal Logic v2.0</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}