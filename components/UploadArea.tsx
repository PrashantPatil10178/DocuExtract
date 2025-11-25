import React, { useCallback } from 'react';
import { UploadCloud, FileText, Image as ImageIcon } from 'lucide-react';

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFilesSelected }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file: File) => 
        file.type.startsWith('image/') || file.type === 'application/pdf'
      );
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] w-full max-w-4xl mx-auto p-8">
      <div 
        className="w-full relative border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-900/50 hover:bg-slate-900 transition-all rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer group"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*,application/pdf" 
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <UploadCloud className="h-10 w-10 text-blue-500" />
        </div>
        
        <h3 className="text-2xl font-semibold text-white mb-2">
          Upload Documents
        </h3>
        <p className="text-slate-400 max-w-md mb-8">
          Drag & drop your files here, or click to browse. Supports Images and PDFs (Passports, Grades, Invoices, etc).
        </p>

        <div className="flex gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} />
            <span>JPG, PNG</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={16} />
            <span>PDF Supported</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;