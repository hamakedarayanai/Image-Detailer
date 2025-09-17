
import React, { useRef } from 'react';
import { UploadedFile } from '../types';
import { ImageIcon } from './icons/ImageIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  uploadedFile: UploadedFile | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label htmlFor="file-upload" className="sr-only">Upload an image</label>
      <div
        className={`relative w-full aspect-video border-2 border-dashed border-base-300 rounded-lg flex items-center justify-center text-center p-4 cursor-pointer hover:border-brand-primary transition-colors duration-300 ${uploadedFile ? 'border-solid border-brand-primary' : ''}`}
        onClick={handleClick}
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
    </div>
  );
};

export default ImageUploader;
