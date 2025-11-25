# DocuExtract AI

A modern React application for intelligent document extraction using Google's Gemini AI. Upload identity documents and automatically extract structured data with high accuracy.

## Features

- **Document Upload**: Drag-and-drop interface for uploading multiple identity documents
- **AI-Powered Extraction**: Leverages Google Gemini AI for accurate data extraction from documents
- **Real-time Processing**: Live status updates during document processing
- **Dashboard View**: Visual dashboard with processing statistics and extracted data grid
- **API View**: JSON representation of extracted data for integration
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **AI Service**: Google Gemini AI (@google/genai)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PrashantPatil10178/DocuExtract.git
   cd docuextract-ai
   ```

2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

3. Set up your Google Gemini API key:
   - Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Configure the API key in the application (refer to geminiService.ts for configuration)

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Upload Documents**: Use the upload area to select or drag-and-drop identity documents (PDF, images)
2. **Processing**: The app will automatically process documents using Gemini AI
3. **View Results**: Switch between Dashboard and API views to see extracted data
4. **Monitor Progress**: Track processing status with real-time statistics

## Project Structure

```
docuextract-ai/
├── components/
│   ├── AnalysisGrid.tsx    # Document analysis display
│   ├── ApiView.tsx         # JSON API view
│   ├── Header.tsx          # Navigation header
│   └── UploadArea.tsx      # File upload interface
├── services/
│   └── geminiService.ts    # Gemini AI integration
├── types.ts                # TypeScript type definitions
├── App.tsx                 # Main application component
├── index.tsx               # Application entry point
└── vite.config.ts          # Vite configuration
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

---

Designed & Developed by GladiatorrX
