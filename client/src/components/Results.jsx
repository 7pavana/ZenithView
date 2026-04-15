import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BarChart3, Clock, ArrowLeft, Brain, ShieldCheck } from 'lucide-react';

const emotionMetrics = {
  'Sad': { 
    label: 'Sad / Low Energy', 
    color: 'bg-indigo-500', 
    icon: '😟' 
  },
  'Disgust': { 
    label: 'Dislike / Disapproval', 
    color: 'bg-orange-500', 
    icon: '🤢' 
  },
  'Angry': { 
    label: 'Angry / Aggressive', 
    color: 'bg-red-500', 
    icon: '😠' 
  },
  'Happy': { 
    label: 'Happy / Friendly', 
    color: 'bg-emerald-500', 
    icon: '😊' 
  },
  'Fear': { 
    label: 'Scared / Panicked', 
    color: 'bg-yellow-500', 
    icon: '😨' 
  },
  'Neutral': { 
    label: 'Neutral / Calm', 
    color: 'bg-slate-500', 
    icon: '😐' 
  },
  'Surprise': { 
    label: 'Surprised / Shocked', 
    color: 'bg-pink-500', 
    icon: '😲' 
  },
  'N/A': { 
    label: 'Checking...', 
    color: 'bg-slate-700', 
    icon: '⚙️' 
  }
};

export default function Results() {
  const location = useLocation();
  
  const { dominant_emotion, timeline, ai_feedback } = location.state || { 
    timeline: [], 
    dominant_emotion: "N/A", 
    ai_feedback: "Generating AI analysis..." 
  };
  const getFriendlyName = (emo) => emotionMetrics[emo]?.label || emo;
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-8">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back to Upload
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          ZenithView Analytics
        </h1>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="md:col-span-1 bg-slate-800/50 border border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl backdrop-blur-md">
          <Brain className="text-blue-400 mb-4" size={48} />
          <p className="text-slate-400 uppercase tracking-widest text-[10px] mb-2 text-center">Dominant State</p>
          <h2 className="text-2xl font-black text-white text-center">
            {getFriendlyName(dominant_emotion)}
          </h2>
        </div>
        <div className="md:col-span-2 bg-slate-800/50 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-md h-[400px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-6 sticky top-0 bg-slate-800/50 backdrop-blur-md py-2 z-10">
            <Clock className="text-emerald-400" size={24} />
            <h3 className="text-xl font-bold">Session Timeline</h3>
          </div>
          
          <div className="space-y-4">
            {timeline.length > 0 ? timeline.map((item, index) => {
              const config = emotionMetrics[item.emotion] || emotionMetrics['Neutral'];
              const confidence = item.confidence * 100;
              return (
                <div key={index} className="group flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all">
                  <div className="flex flex-col items-center justify-center w-14">
                    <span className="text-blue-400 font-mono font-bold">{item.timestamp}s</span>
                    <span className="text-[10px] text-slate-500 uppercase">Time</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        {config.icon} {config.label}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        confidence > 75 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {confidence.toFixed(1)}% Match
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${config.color}`} 
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                  </div>
                  <ShieldCheck 
                    size={22} 
                    className={confidence > 75 ? "text-emerald-400" : "text-slate-600"} 
                  />
                </div>
              );
            }) : (
              <p className="text-slate-500 text-center py-10">No timeline data available.</p>
            )}
          </div>
        </div>
        <div className="md:col-span-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 ml-2">Emotional Flow Intensity</p>
            <div className="flex gap-1 h-3 w-full rounded-full overflow-hidden bg-slate-800">
                {timeline.map((item, i) => (
                    <div 
                        key={i} 
                        className={`${emotionMetrics[item.emotion]?.color || 'bg-slate-500'} flex-1 transition-all hover:scale-y-150 cursor-help`}
                        title={`${item.timestamp}s: ${item.emotion}`}
                    />
                ))}
            </div>
        </div>
        <div className="md:col-span-3 bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-blue-500/20 rounded-3xl p-8">
            <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-400"/> ZenithView Analysis
            </h4>
            <p className="text-slate-300 leading-relaxed">
                Your session was primarily defined by <span className="text-white font-bold">{getFriendlyName(dominant_emotion)}</span>. 
                Our temporal logic tracked {timeline.length} significant emotional cues. 
                Navigate through the timeline above to review specific micro-expressions.
            </p>
        </div>

        {/* AI Coaching Insights Section */}
        <div className="md:col-span-3 bg-slate-800/80 border-l-4 border-blue-500 p-8 rounded-r-3xl shadow-2xl mt-4">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="text-blue-400" size={28} />
            <h3 className="text-xl font-bold font-mono uppercase tracking-widest">
              AI Coach Feedback
            </h3>
          </div>
          <div className="text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-700 pt-6 italic">
            {ai_feedback}
          </div>
        </div>
      </div>
    </div>
  );
}