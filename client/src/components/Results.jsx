import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BarChart3, Clock, ArrowLeft, Brain, ShieldCheck } from 'lucide-react';

export default function Results() {
  const location = useLocation();
  const { dominant_emotion, timeline } = location.state || { timeline: [], dominant_emotion: "N/A" };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-8">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back to Upload
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          ZenithView Analytics
        </h1>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Dominant Emotion Card */}
        <div className="md:col-span-1 bg-slate-800/50 border border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl backdrop-blur-md">
          <Brain className="text-blue-400 mb-4" size={48} />
          <p className="text-slate-400 uppercase tracking-widest text-xs mb-2">Dominant State</p>
          <h2 className="text-4xl font-black text-white">{dominant_emotion}</h2>
        </div>

        {/* Timeline Analysis Card */}
        <div className="md:col-span-2 bg-slate-800/50 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-emerald-400" size={24} />
            <h3 className="text-xl font-bold">Session Timeline</h3>
          </div>

          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={index} className="group flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all">
                <span className="text-blue-400 font-mono font-bold w-12">{item.timestamp}s</span>
                
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-200">{item.emotion}</span>
                    <span className="text-xs text-slate-500">{(item.confidence * 100).toFixed(1)}% Match</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        item.emotion === 'Happy' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`} 
                      style={{ width: `${item.confidence * 100}%` }}
                    />
                  </div>
                </div>
                
                <ShieldCheck size={18} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Summary/Feedback Card */}
        <div className="md:col-span-3 bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border border-blue-500/30 rounded-3xl p-8">
            <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                <BarChart3 size={20}/> ZenithView Insights
            </h4>
            <p className="text-slate-300 leading-relaxed">
                Based on our temporal analysis, your most consistent emotion was <span className="text-white font-bold">{dominant_emotion}</span>. 
                Your delivery showed {timeline.length} distinct emotional transitions. 
                Check the timestamps above to see how your expressions changed during key parts of your presentation.
            </p>
        </div>
      </div>
    </div>
  );
}