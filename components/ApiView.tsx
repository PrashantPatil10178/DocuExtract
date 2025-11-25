import React from 'react';
import { ProcessedDocument } from '../types';
import { Copy, Download, Database } from 'lucide-react';

interface ApiViewProps {
  documents: ProcessedDocument[];
}

const ApiView: React.FC<ApiViewProps> = ({ documents }) => {
  const completedDocs = documents
    .filter(doc => doc.status === 'completed' && doc.data)
    .map(doc => ({
      id: doc.id,
      filename: doc.file.name,
      processed_at: new Date(doc.timestamp).toISOString(),
      extraction: doc.data
    }));

  const jsonString = JSON.stringify(completedDocs, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'identity_leak_db.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col flex-1">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="ml-2 text-sm font-mono text-slate-400 flex items-center gap-2">
              <Database size={14} />
              api/v1/identities/export
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors text-sm font-medium border border-slate-700"
              title="Copy to Clipboard"
            >
              <Copy size={16} />
              Copy JSON
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors text-sm font-medium"
              title="Download JSON"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-[#0d1117] custom-scrollbar">
          <pre className="text-sm font-mono leading-relaxed p-6 text-green-400">
            <code>{jsonString}</code>
          </pre>
        </div>
      </div>
      <p className="mt-4 text-center text-slate-500 text-xs font-mono">
        {documents.length > 0 
          ? `${completedDocs.length} identities successfully extracted into JSON format.` 
          : 'Upload documents to generate JSON data.'}
      </p>
    </div>
  );
};

export default ApiView;