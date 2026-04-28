import React, { useState } from 'react';
import { 
  Eye, 
  Code, 
  Copy, 
  RefreshCw, 
  Check, 
  Image as ImageIcon, 
  Type, 
  Layout,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Smartphone,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RemixResult } from '../types';

interface RemixEditorProps {
  data: RemixResult;
  onRegenerate: () => void;
}

export default function RemixEditor({ data, onRegenerate }: RemixEditorProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
      {/* List of Sections */}
      <div className="overflow-y-auto pr-4 space-y-4">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#F6F6F7] z-10 py-2">
           <div>
             <h2 className="text-2xl font-bold text-slate-900">Your AI Remix</h2>
             <p className="text-sm text-slate-500">15 Sections reconstructed from the source</p>
           </div>
           <button 
             onClick={onRegenerate}
             className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-white px-4 py-2 rounded-lg border border-indigo-100 transition-colors"
           >
             <RefreshCw className="w-4 h-4" />
             Regenerate
           </button>
        </div>

        {data.remixedSections.map((section, idx) => (
          <div 
            key={idx}
            className={`bg-white rounded-xl border transition-all ${
              expandedSection === idx ? "border-indigo-600 shadow-lg shadow-indigo-50" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <button 
              onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  {idx + 1}
                </div>
                <div>
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                     <span className="capitalize">{section.type.replace('_', ' ')}</span>
                     <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded uppercase">Section</span>
                   </h3>
                   <p className="text-xs text-slate-500 truncate max-w-[200px]">{section.newHeadline}</p>
                </div>
              </div>
              {expandedSection === idx ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            <AnimatePresence>
              {expandedSection === idx && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-slate-100"
                >
                  <div className="p-4 space-y-6">
                    {/* Copy Block */}
                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Headline</label>
                          <div className="relative group">
                            <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 resize-none h-16"
                              value={section.newHeadline}
                              readOnly
                            />
                            <button 
                              onClick={() => copyToClipboard(section.newHeadline, `h-${idx}`)}
                              className="absolute top-2 right-2 p-1.5 bg-white shadow-sm border border-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copiedKey === `h-${idx}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                            </button>
                          </div>
                       </div>

                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Body Text</label>
                          <div className="relative group">
                            <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-600 focus:ring-2 focus:ring-indigo-100 resize-none h-32"
                              value={section.newCopy}
                              readOnly
                            />
                            <button 
                              onClick={() => copyToClipboard(section.newCopy, `c-${idx}`)}
                              className="absolute top-2 right-2 p-1.5 bg-white shadow-sm border border-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copiedKey === `c-${idx}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                            </button>
                          </div>
                       </div>
                    </div>

                    {/* AI Image Prompt */}
                    <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                        <div className="flex items-center gap-2 mb-2 text-indigo-700">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">AI Image Prompt</span>
                        </div>
                        <p className="text-xs text-slate-600 italic mb-3 leading-relaxed">
                          "{section.aiImagePrompt}"
                        </p>
                        <button 
                          onClick={() => copyToClipboard(section.aiImagePrompt, `i-${idx}`)}
                          className="w-full bg-white border border-indigo-200 text-indigo-600 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          {copiedKey === `i-${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          Copy for Midjourney/DALL-E
                        </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Preview Column */}
      <div className="hidden lg:flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative border-8 border-slate-800">
         <div className="bg-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
               <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
            </div>
            <div className="flex bg-slate-700 p-1 rounded-lg">
               <button 
                 onClick={() => setViewMode('desktop')}
                 className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? "bg-slate-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
               >
                 <Monitor className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => setViewMode('mobile')}
                 className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? "bg-slate-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
               >
                 <Smartphone className="w-4 h-4" />
               </button>
            </div>
            <div className="text-[10px] font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded truncate max-w-[150px]">
              https://preview.pageremix.ai/store-id-xyz
            </div>
         </div>

         <div className="flex-1 overflow-y-auto bg-white flex justify-center p-4">
           <div className={`transition-all duration-500 shadow-xl border border-slate-100 ${viewMode === 'mobile' ? "w-[375px]" : "w-full"}`}>
              {/* Mock Preview */}
              <div className="sticky top-0 h-12 bg-white/80 backdrop-blur border-b border-slate-100 flex items-center justify-between px-6 z-20">
                 <div className="font-black text-slate-900">{data.branding.storeName}</div>
                 <Menu className="w-5 h-5 text-slate-900" />
              </div>

              {data.remixedSections.map((section, idx) => (
                <section 
                   key={idx} 
                   className={`p-8 flex flex-col items-center text-center gap-4 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                >
                   {section.type === 'hero' ? (
                     <div className="space-y-6 py-12">
                        <h1 className="text-4xl font-black text-slate-900 leading-tight">{section.newHeadline}</h1>
                        <p className="text-slate-600 max-w-md mx-auto">{section.newCopy}</p>
                        <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-100">
                          {section.cta}
                        </button>
                        <div className="w-full aspect-video bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden relative group">
                           <ImageIcon className="w-12 h-12" />
                           <div className="absolute inset-x-0 bottom-0 p-4 bg-indigo-600/90 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                             AI Generation Placeholder
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="py-8 w-full max-w-xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.newHeadline}</h2>
                        <p className="text-slate-600 mb-6 text-sm leading-relaxed">{section.newCopy}</p>
                        {section.cta && (
                          <button className="text-indigo-600 font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all">
                            {section.cta} <Layout className="w-4 h-4" />
                          </button>
                        )}
                     </div>
                   )}
                </section>
              ))}
           </div>
         </div>
      </div>
    </div>
  );
}

function Menu({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
}
