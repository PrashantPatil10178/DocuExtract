import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import AnalysisGrid from './components/AnalysisGrid';
import ApiView from './components/ApiView';
import { ProcessedDocument, ProcessingView } from './types';
import { processDocument } from './services/geminiService';
import { Database } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ProcessingView>(ProcessingView.UPLOAD);
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    const newDocs: ProcessedDocument[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      timestamp: Date.now()
    }));

    setDocuments(prev => [...prev, ...newDocs]);
    setView(ProcessingView.DASHBOARD);
    
    // Trigger processing
    processQueue(newDocs);
  };

  const processQueue = async (newDocs: ProcessedDocument[]) => {
    setIsProcessing(true);
    
    // Process one by one to avoid rate limits on standard tier, 
    // in production this would be a backend job queue.
    for (const doc of newDocs) {
      setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'processing' } : d));
      
      try {
        const extractedData = await processDocument(doc.file);
        setDocuments(prev => prev.map(d => 
          d.id === doc.id ? { ...d, status: 'completed', data: extractedData } : d
        ));
      } catch (error) {
        setDocuments(prev => prev.map(d => 
          d.id === doc.id ? { ...d, status: 'error', error: 'Failed to extract data' } : d
        ));
      }
      
      // Small delay to be gentle on rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header 
        currentView={view} 
        setView={setView} 
        processedCount={documents.filter(d => d.status === 'completed').length}
      />

      <main className="flex-1 overflow-auto flex flex-col">
        {view === ProcessingView.UPLOAD && (
          <UploadArea onFilesSelected={handleFilesSelected} />
        )}

        {view === ProcessingView.DASHBOARD && (
          <div className="max-w-7xl mx-auto w-full flex-1">
            
            {/* Stats Section - Streamlined */}
            {documents.length > 0 && (
              <div className="px-6 pt-8 pb-2">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div>
                         <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                           <Database className="text-blue-500" />
                           Extraction Overview
                         </h2>
                         <p className="text-slate-400 text-sm">
                           Real-time analysis of {documents.length} uploaded identity documents.
                         </p>
                      </div>
                      
                      <div className="flex gap-4">
                         <div className="bg-slate-800 px-5 py-3 rounded-lg border border-slate-700 text-center min-w-[100px]">
                            <div className="text-2xl font-bold text-white">{documents.length}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Total Docs</div>
                         </div>
                         <div className="bg-slate-800 px-5 py-3 rounded-lg border border-slate-700 text-center min-w-[100px]">
                            <div className="text-2xl font-bold text-green-500">
                              {documents.filter(d => d.status === 'completed').length}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Successful</div>
                         </div>
                         <div className="bg-slate-800 px-5 py-3 rounded-lg border border-slate-700 text-center min-w-[100px]">
                            <div className="text-2xl font-bold text-blue-500">
                              {documents.filter(d => d.status === 'processing').length}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Processing</div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            <AnalysisGrid documents={documents} />
          </div>
        )}

        {view === ProcessingView.API_VIEW && (
          <ApiView documents={documents} />
        )}
      </main>

      <footer className="py-6 border-t border-slate-900 bg-slate-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-600 text-xs font-mono tracking-wide">
            Designed & Developed by <span className="text-slate-400 font-semibold">GladiatorrX</span>
          </p>
        </div>
      </footer>
    
    </div>
  );
};

export default App;