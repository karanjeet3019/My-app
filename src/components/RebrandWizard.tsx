import React from 'react';
import { Palette, MessageSquare, Target, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { RebrandData } from '../types';

interface RebrandWizardProps {
  data: RebrandData;
  updateData: (data: Partial<RebrandData>) => void;
  onComplete: () => void;
}

export default function RebrandWizard({ data, updateData, onComplete }: RebrandWizardProps) {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Tell us about your brand</h2>
        <p className="text-slate-500 mt-2">These details will be used to transform the competitor layout into your unique store.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SectionTitle icon={Palette} title="Identity & Style" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Store Name" value={data.storeName} onChange={(v) => updateData({ storeName: v })} placeholder="Elevate Gear" />
            <Input label="Product Name" value={data.productName} onChange={(v) => updateData({ productName: v })} placeholder="Pro Mat" />
          </div>
          <Input label="Main Product Title" value={data.productTitle} onChange={(v) => updateData({ productTitle: v })} placeholder="The Ultimate Non-Slip Grip Mat" />
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Color</label>
                <div className="flex gap-2">
                  <input type="color" value={data.mainColor} onChange={(e) => updateData({ mainColor: e.target.value })} className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer rounded overflow-hidden" />
                  <input type="text" value={data.mainColor} onChange={(e) => updateData({ mainColor: e.target.value })} className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                </div>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sec. Color</label>
                <div className="flex gap-2">
                   <input type="color" value={data.secondaryColor} onChange={(e) => updateData({ secondaryColor: e.target.value })} className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer rounded overflow-hidden" />
                   <input type="text" value={data.secondaryColor} onChange={(e) => updateData({ secondaryColor: e.target.value })} className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <SectionTitle icon={MessageSquare} title="Voice & Tone" />
          <Input label="Brand Tone" value={data.brandTone} onChange={(v) => updateData({ brandTone: v })} placeholder="Energetic, Professional, Minimalist" />
          <Input label="Target Audience" value={data.targetAudience} onChange={(v) => updateData({ targetAudience: v })} placeholder="Home fitness enthusiasts aged 25-45" />
          
          <div className="grid grid-cols-2 gap-4">
             <Input label="Price (e.g. $49.00)" value={data.price} onChange={(v) => updateData({ price: v })} placeholder="$49.00" />
             <Input label="Current Offer" value={data.offer} onChange={(v) => updateData({ offer: v })} placeholder="Buy 1 Get 1 50% OFF" />
          </div>
        </div>

        <div className="space-y-6">
          <SectionTitle icon={Truck} title="Logistics" />
          <div className="grid grid-cols-2 gap-4">
             <Input label="Shipping Time" value={data.shippingTime} onChange={(v) => updateData({ shippingTime: v })} placeholder="3-5 Business Days" />
             <Input label="Guarantee" value={data.guarantee} onChange={(v) => updateData({ guarantee: v })} placeholder="90-Day Money Back" />
          </div>
        </div>

        <div className="space-y-6">
          <SectionTitle icon={Target} title="Value Propositions" />
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Benefits (Comma separated)</label>
            <textarea 
               value={data.mainBenefits}
               onChange={(e) => updateData({ mainBenefits: e.target.value })}
               className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm h-24 resize-none"
               placeholder="Eco-friendly, Non-slip, Odor-resistant, Lifetime warranty"
            />
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
         <button 
           onClick={onComplete}
           className="bg-indigo-600 text-white px-12 py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
         >
           Generate My Remix
         </button>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm"
      />
    </div>
  );
}
