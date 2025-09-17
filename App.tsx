
import React, { useState, useCallback, useRef } from 'react';
import { describeImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import DescriptionDisplay from './components/DescriptionDisplay';
import Loader from './components/Loader';
import { UploadedFile } from './types';

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const timerRef = useRef<number | null>(null);


  const handleImageUpload = (file: File) => {
    handleClear();
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFile({
        file,
        base64: reader.result as string,
      });
    };
    reader.onerror = () => {
        setError('Failed to read the image file. Please try again.');
    }
    reader.readAsDataURL(file);
  };
  
  const generateDescription = useCallback(async () => {
    if (!uploadedFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setDescription('');
    setProgress(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Simulate progress
    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 95;
        }
        // Simulate slower progress towards the end
        const increment = prev < 70 ? Math.random() * 10 + 2 : Math.random() * 3 + 1;
        return Math.min(prev + increment, 95);
      });
    }, 400);

    try {
      // The base64 string from FileReader includes the data URL prefix, which we need to remove.
      // e.g., "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..." -> "/9j/4AAQSkZJRgABAQ..."
      const base64Data = uploadedFile.base64.split(',')[1];
      const mimeType = uploadedFile.file.type;
      
      const result = await describeImage(base64Data, mimeType);
      
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(100);

      // Wait for the 100% animation to finish before showing the result
      setTimeout(() => {
        setDescription(result);
        setIsLoading(false);
      }, 500);

    } catch (err: unknown) {
      if (timerRef.current) clearInterval(timerRef.current);
      // The error message from geminiService is now user-friendly.
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
      setIsLoading(false);
    }
  }, [uploadedFile]);

  const handleClear = () => {
    setUploadedFile(null);
    setDescription('');
    setError('');
    setIsLoading(false);
    setProgress(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };

  return (
    <div className="min-h-screen bg-base-100 text-text-primary font-sans antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          <div className="w-full flex flex-col space-y-6">
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              uploadedFile={uploadedFile}
            />

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={generateDescription}
                disabled={!uploadedFile || isLoading}
                className="w-full flex-1 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-base-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                {isLoading ? 'Analyzing...' : 'Generate Description'}
              </button>
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="w-full sm:w-auto bg-base-200 hover:bg-base-300 text-text-secondary font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 bg-base-200 rounded-lg p-4">
                <Loader progress={progress} />
              </div>
            ) : (
              <DescriptionDisplay description={description} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
