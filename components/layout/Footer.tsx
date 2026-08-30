import React from 'react';
import { Receipt, ShieldCheck, Zap, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#29203f] bg-[#0d0a17]/70 mt-auto py-8 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-violet-600 to-orange-500 flex items-center justify-center text-white text-xs">
            <Receipt className="w-3 h-3" />
          </div>
          <span className="font-bold text-white">BillMate</span>
          <span>— Production Digital Receipt Studio</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-violet-300">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
            100% Client-Side Privacy
          </span>
          <span className="flex items-center gap-1.5 text-orange-300">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            Instant PDF & Print
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-orange-500 fill-orange-500 inline" />
          <span>for businesses & freelancers</span>
        </div>
      </div>
    </footer>
  );
}
