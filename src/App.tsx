/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import DashboardShell from './components/DashboardShell';
import Analyzer from './pages/Analyzer';
import RebrandWizard from './components/RebrandWizard';
import RemixEditor from './pages/RemixEditor';
import { RebrandData, RemixResult } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Zap } from 'lucide-react';

const INITIAL_REBRAND_DATA: RebrandData = {
  storeName: '',
  productName: '',
  productTitle: '',
  brandTone: 'Modern & Minimalist',
  mainColor: '#4F46E5',
  secondaryColor: '#FDF2F8',
  targetAudience: '',
  price: '',
  offer: '',
  shippingTime: '',
  guarantee: '30-Day Money Back',
  mainBenefits: ''
};

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [step, setStep] = useState<'analyze' | 'rebrand' | 'editor'>('analyze');
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [useRebrand, setUseRebrand] = useState(false);
  const [rebrandData, setRebrandData] = useState<RebrandData>(INITIAL_REBRAND_DATA);
  const [analysis, setAnalysis] = useState<any>(null);
  const [remixResult, setRemixResult] = useState<RemixResult | null>(null);

  const handleAnalyze = async (url: string, rebrand: boolean) => {
    setIsLoading(true);
    setUrl(url);
    setUseRebrand(rebrand);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.data);
        if (rebrand) {
          setStep('rebrand');
        } else {
          await generateRemix(data.data, INITIAL_REBRAND_DATA, 'rewrite');
        }
      } else {
        alert("Failed to analyze URL. Please check if the URL is accessible.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateRemix = async (analysisData: any, branding: RebrandData, mode: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: analysisData, rebrandData: branding, mode })
      });
      const data = await response.json();
      
      if (data.success) {
        setRemixResult(data.data);
        setStep('editor');
        setActiveTab('remix');
      } else {
        alert("AI generation failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during AI generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateRebrandData = (partial: Partial<RebrandData>) => {
    setRebrandData(prev => ({ ...prev, ...partial }));
  };

  return (
    <DashboardShell activeTab={activeTab} setActiveTab={setActiveTab}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center gap-6"
          >
             <div className="relative">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                <Zap className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
             </div>
             <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900">Magically Remixing...</h3>
                <p className="text-slate-500 mt-2">Our AI is deconstructing the structure and building your unique version.</p>
             </div>
          </motion.div>
        )}

        {step === 'analyze' && activeTab === 'analyze' && (
          <motion.div key="analyze" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Analyzer onAnalyze={handleAnalyze} isLoading={isLoading} />
          </motion.div>
        )}

        {step === 'rebrand' && (
          <motion.div key="rebrand" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <RebrandWizard 
              data={rebrandData} 
              updateData={updateRebrandData} 
              onComplete={() => generateRemix(analysis, rebrandData, 'rebrand')} 
            />
          </motion.div>
        )}

        {step === 'editor' && remixResult && (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <RemixEditor 
              data={remixResult} 
              onRegenerate={() => generateRemix(analysis, rebrandData, useRebrand ? 'rebrand' : 'rewrite')} 
            />
          </motion.div>
        )}

        {/* Placeholder pages */}
        {activeTab === 'export' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
               <Zap className="w-10 h-10" />
             </div>
             <h2 className="text-2xl font-bold text-slate-800">Export Center</h2>
             <p className="text-slate-500 mt-2 max-w-sm">Connect your store or generate a remix to unlock one-click push and exports.</p>
          </div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}

