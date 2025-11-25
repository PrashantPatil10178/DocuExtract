export interface ProcessedDocument {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  data?: ExtractedIdentityData;
  error?: string;
  timestamp: number;
}

export interface ExtractedIdentityData {
  documentType?: string;
  confidenceScore?: number;
  // Allow any other extracted key-value pairs
  [key: string]: any;
}

export enum ProcessingView {
  UPLOAD = 'UPLOAD',
  DASHBOARD = 'DASHBOARD',
  API_VIEW = 'API_VIEW'
}