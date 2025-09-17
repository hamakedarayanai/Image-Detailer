import React, { useRef, useState, useEffect } from 'react';
import { UploadedFile } from '../types';
import { ImageIcon } from './icons/ImageIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  uploadedFile: UploadedFile | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Clear local state if the parent component clears the file
  useEffect(() => {
    if (!uploadedFile) {
      setImageUrl('');
      setFetchError(null);
    }
  }, [uploadedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlFetch = async () => {
    if (!imageUrl) {
      setFetchError('Please enter a URL.');
      return;
    }

    try {
      new URL(imageUrl);
    } catch (_) {
      setFetchError('Invalid URL format. Please enter a valid URL.');
      return;
    }

    setIsFetchingUrl(true);
    setFetchError(null);

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image. Server responded with status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('The URL does not point to a valid image file. Please check the URL and try again.');
      }

      const blob = await response.blob();
      const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1).split('?')[0] || 'image-from-url';
      const file = new File([blob], filename, { type: blob.type });

      onImageUpload(file);
      setImageUrl('');

    } catch (error) {
      console.error("Error fetching image from URL:", error);
      let message = 'Could not fetch the image from the URL.';
      if (error instanceof TypeError) { // Often indicates a CORS issue
        message += ' This may be due to a network error or a cross-origin (CORS) restriction on the server hosting the image.';
      } else if (error instanceof Error) {
        message = error.message;
      }
      setFetchError(message);
    } finally {
      setIsFetchingUrl(false);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor="file-upload" className="sr-only">Upload an image</label>
      <div
        className={`relative w-full aspect-video border-2 border-dashed border-base-300 rounded-lg flex items-center justify-center text-center p-4 transition-colors duration-300 ${uploadedFile ? 'border-solid border-brand-primary' : 'cursor-pointer hover:border-brand-primary'}`}
        onClick={uploadedFile ? undefined : handleClick}
        role="button"
        tabIndex={0}
      >
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
        {uploadedFile ? (
          <img
            src={uploadedFile.base64}
            alt="Uploaded preview"
            className="object-contain w-full h-full max-h-[40vh] lg:max-h-full rounded-md"
          />
        ) : (
          <div className="flex flex-col items-center text-text-secondary">
            <ImageIcon className="w-12 h-12 mb-2"/>
            <span className="font-semibold">Click to upload an image</span>
            <span className="text-sm">PNG, JPG, or WEBP</span>
          </div>
        )}
      </div>

      {/* URL uploader section */}
      <div className="mt-4 text-center">
        <p className="text-sm text-text-secondary mb-2">Or paste an image URL</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => { setImageUrl(e.target.value); setFetchError(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlFetch()}
            placeholder="https://example.com/image.jpg"
            disabled={isFetchingUrl || !!uploadedFile}
            className="flex-grow bg-base-200 border border-base-300 text-text-primary text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Image URL"
          />
          <button
            onClick={handleUrlFetch}
            disabled={isFetchingUrl || !imageUrl || !!uploadedFile}
            className="bg-brand-secondary hover:bg-brand-secondary/90 disabled:bg-base-300 disabled:cursor-not-allowed text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-300"
          >
            {isFetchingUrl ? 'Loading...' : 'Load'}
          </button>
        </div>
        {fetchError && (
          <p className="text-red-400 text-sm mt-2 text-left sm:text-center" role="alert">
            {fetchError}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;