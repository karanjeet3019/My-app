import React, { useState } from 'react';
import { Search, Globe, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalyzerProps {
  onAnalyze: (url: string, rebrand: boolean) => void;
  isLoading: boolean;
}

export default function Analyzer({ onAnalyze, isLoading }: AnalyzerProps) {
  const [url, setUrl] = useState('');
  const [rebrand, setRebrand] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && rebrand !== null) {
      onAnalyze(url, rebrand);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-6 text-indigo-600"
        >
          <Search className="w-8 h-8" />
        </motion.div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Remix Any Store Page</h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Paste a Shopify URL and our AI will deconstruct the conversion flow to rebuild it with fresh content and your vision.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Target URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Globe className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://competitor-store.com/products/cool-product"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-slate-900"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">Supported: Shopify Product Pages, Collection Pages, Homepages</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
             <button
                type="button"
                onClick={() => setRebrand(true)}
                className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 group ${
                  rebrand === true 
                    ? "border-indigo-600 bg-indigo-50/50" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
             >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  rebrand === true ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                }`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-bold text-slate-900 leading-tight">Yes, Rebrand It</h3>
                   <p className="text-sm text-slate-500 mt-1">New store name, colors, and completely fresh brand identity.</p>
                </div>
             </button>

             <button
                type="button"
                onClick={() => setRebrand(false)}
                className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 group ${
                  rebrand === false 
                    ? "border-indigo-600 bg-indigo-50/50" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
             >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  rebrand === false ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-bold text-slate-900 leading-tight">No, Only Rewrite</h3>
                   <p className="text-sm text-slate-500 mt-1">Keep existing branding, but generate high-converting new copy.</p>
                </div>
             </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !url || rebrand === null}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Structure...
              </>
            ) : (
              <>
                Begin Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
        {/* Placeholder for "Trusted by" or feature icons */}
        <div className="flex flex-col items-center gap-2">
           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
             <Zap className="w-6 h-6 text-indigo-600" />
           </div>
           <span className="text-xs font-semibold text-slate-600 uppercase">Instant Analysis</span>
        </div>
        {/* ... */}
      </div>
    </div>
  );
}

function Zap({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.71 14 3 11 9h9l-10 11.71 3-5.71H4z"/></svg>;
}
