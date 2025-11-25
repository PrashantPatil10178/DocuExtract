import React from 'react';
import { ShieldCheck, Database, LayoutDashboard, FileJson } from 'lucide-react';
import { ProcessingView } from '../types';

interface HeaderProps {
  currentView: ProcessingView;
  setView: (view: ProcessingView) => void;
  processedCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, processedCount }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex flex-col justify-center cursor-pointer" onClick={() => setView(ProcessingView.UPLOAD)}>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-xl text-white tracking-tight">DocuExtract<span className="text-blue-500">AI</span></span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wide uppercase">by GladiatorrX</span>
              </div>
            </div>
          </div>
          
          <nav className="flex space-x-4">
            <button
              onClick={() => setView(ProcessingView.UPLOAD)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === ProcessingView.UPLOAD ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setView(ProcessingView.DASHBOARD)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                currentView === ProcessingView.DASHBOARD ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
              {processedCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{processedCount}</span>
              )}
            </button>
            <button
              onClick={() => setView(ProcessingView.API_VIEW)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                currentView === ProcessingView.API_VIEW ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileJson size={16} />
              JSON Data
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;