import React from 'react';
import { FileText, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen relative font-sans text-slate-900 flex flex-col overflow-hidden bg-white">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/60 blur-[100px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-100/60 blur-[100px]"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] rounded-full bg-indigo-100/60 blur-[100px]"></div>
      </div>

      {/* Header (Glassmorphism) */}
      <header className="fixed w-full top-0 z-50 bg-white/60 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md shadow-blue-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">CV Builder Pro</span>
          </div>
          <button 
            onClick={onStart}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Boshlash
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center relative z-10 pt-20">
        <section className="px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto w-full">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-xs sm:text-sm mb-8 shadow-sm backdrop-blur-sm animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Yangi va zamonaviy CV yaratish</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            O'z kelajagingizni <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              mukammal rezyume
            </span> bilan quring
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Bir necha daqiqa ichida professional va chiroyli dizayndagi rezyume yarating. 
            Ish beruvchilarda yaxshi taassurot qoldirish uchun kerak bo'lgan barcha vositalar shu yerda.
          </p>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={onStart}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(79,70,229,0.7)] flex items-center gap-3 overflow-hidden transform hover:-translate-y-1"
            >
              <span className="relative z-10">Resume to'ldirish</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/50 backdrop-blur-sm py-6 text-center mt-auto">
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} CV Builder Pro. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
