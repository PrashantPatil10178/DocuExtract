import React from 'react';
import { ProcessedDocument } from '../types';
import { Loader2, CheckCircle2, XCircle, FileText, Tag, Hash, Percent } from 'lucide-react';

interface AnalysisGridProps {
  documents: ProcessedDocument[];
}

const AnalysisGrid: React.FC<AnalysisGridProps> = ({ documents }) => {
  
  // Helper to render values recursively or simply
  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') {
      if (Array.isArray(value)) return `[Array: ${value.length} items]`;
      return '{Object}';
    }
    return String(value);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {documents.map((doc) => {
          // Destructure known meta-fields, keep the rest as dynamic
          const { documentType, confidenceScore, ...dynamicData } = doc.data || {};
          
          // Get top 6 fields to display in the card (excluding huge objects)
          const displayFields = Object.entries(dynamicData || {})
            .filter(([_, val]) => typeof val !== 'object' || (Array.isArray(val) && val.length < 2))
            .slice(0, 8);

          return (
            <div key={doc.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col hover:border-slate-600 transition-colors shadow-lg">
              
              {/* Header / Image Preview */}
              <div className="h-48 overflow-hidden relative bg-slate-900 group">
                {doc.file.type.includes('pdf') ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                    <FileText className="w-16 h-16" />
                  </div>
                ) : (
                  <img 
                    src={doc.previewUrl} 
                    alt="Document Preview" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                )}
                
                <div className="absolute top-3 right-3">
                  {doc.status === 'processing' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-md">
                      <Loader2 className="animate-spin -ml-0.5 mr-1.5 h-3 w-3" />
                      Analyzing
                    </span>
                  )}
                  {doc.status === 'completed' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 backdrop-blur-md">
                      <CheckCircle2 className="-ml-0.5 mr-1.5 h-3 w-3" />
                      Processed
                    </span>
                  )}
                  {doc.status === 'error' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 backdrop-blur-md">
                      <XCircle className="-ml-0.5 mr-1.5 h-3 w-3" />
                      Failed
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-4">
                   <p className="text-white text-sm font-medium truncate">{doc.file.name}</p>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col gap-3">
                {doc.data ? (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white leading-tight">
                          {documentType || 'Unknown Document'}
                        </h4>
                        <p className="text-xs text-blue-400 font-medium mt-1">
                          AUTO-DETECTED
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-slate-300 flex-1">
                      {displayFields.length > 0 ? (
                        displayFields.map(([key, value]) => (
                          <div key={key} className="flex justify-between items-start gap-4 border-b border-slate-700/50 pb-1.5 last:border-0">
                            <span className="text-slate-500 text-xs uppercase font-semibold tracking-wide shrink-0 max-w-[40%] truncate" title={key}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-slate-200 font-mono text-xs text-right truncate w-full" title={String(value)}>
                              {renderValue(value)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 italic text-xs">Complex data extracted. View JSON for details.</p>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-700/50">
                      <div className="flex items-center gap-1.5">
                        <Tag size={12} />
                        <span>{Object.keys(doc.data).length} Fields</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${Number(confidenceScore) > 0.8 ? 'bg-green-500' : Number(confidenceScore) > 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${(Number(confidenceScore) || 0) * 100}%` }}
                            />
                         </div>
                         <span>{Math.round((Number(confidenceScore) || 0) * 100)}%</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-sm italic min-h-[150px]">
                    {doc.status === 'processing' ? 'Extracting all visible data...' : doc.status === 'error' ? 'Could not extract data.' : 'Waiting to process...'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisGrid;