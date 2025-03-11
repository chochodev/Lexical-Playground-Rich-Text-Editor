import type React from 'react';
import { useState, useRef, type JSX } from 'react';

type Props = Readonly<{
  'data-test-id'?: string;
  accept?: string;
  label: string;
  onChange: (files: FileList | null) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
  variant?: 'default' | 'enhanced';
}>;

export default function FileInput({
  accept,
  label,
  onChange,
  'data-test-id': dataTestId,
  maxFiles = 1,
  maxSizeMB = 10,
  className = '',
  variant = 'default',
}: Props): JSX.Element {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (fileList: FileList | null) => {
    if (!fileList) {
      setFiles([]);
      onChange(null);
      return;
    }

    setError(null);

    // Check number of files
    if (fileList.length > maxFiles) {
      setError(
        `You can only upload up to ${maxFiles} file${maxFiles === 1 ? '' : 's'}`
      );
      return;
    }

    // Check file sizes
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const newFiles: File[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (file.size > maxSizeBytes) {
        setError(
          `File "${file.name}" exceeds the maximum size of ${maxSizeMB}MB`
        );
        return;
      }

      newFiles.push(file);
    }

    setFiles(newFiles);
    onChange(fileList);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variant === 'enhanced') {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variant === 'enhanced') {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variant === 'enhanced' && !isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const clearFiles = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles([]);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onChange(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const triggerFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Truncate filename if it's too long
  const truncateFilename = (name: string, maxLength = 20): string => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop() || '';
    const nameWithoutExt = name.substring(
      0,
      name.length - extension.length - 1
    );
    const truncatedName =
      nameWithoutExt.substring(0, maxLength - extension.length - 3) + '...';
    return `${truncatedName}.${extension}`;
  };

  if (variant === 'default') {
    return (
      <div className={`w-max bg-gray-100 rounded-md ${className}`}>
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={dataTestId}
              className="sr-only mb-1 text-sm font-medium text-gray-700"
            >
              {label}
            </label>
          )}

          <div className="relative">
            <div
              className={`flex items-center border rounded-md overflow-hidden cursor-pointer
                ${
                  error
                    ? 'border-red-500'
                    : 'border-gray-300 hover:border-gray-400'
                }
                focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500`}
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              data-test-id={dataTestId}
            >
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files)}
                data-test-id={dataTestId ? `${dataTestId}-input` : undefined}
                id={dataTestId}
                multiple={maxFiles > 1}
              />

              <div className="flex-grow px-3 py-2 text-sm truncate">
                {files.length === 0 ? (
                  <span className="text-gray-500">
                    Choose file{maxFiles > 1 ? 's' : ''}
                  </span>
                ) : (
                  <div className="flex items-center space-x-1 overflow-hidden">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center">
                        {index > 0 && <span className="text-gray-500">, </span>}
                        <span className="truncate" title={file.name}>
                          {truncateFilename(file.name)}
                        </span>
                        <span className="text-gray-500 text-xs ml-1">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-gray-200 rounded-r-md px-3 py-2 bg-gray-100 text-sm font-medium border-solid border-0 border-l-1 text-gray-700 hover:bg-gray-100 transition-colors">
                Browse
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-1 text-sm text-red-600" id={`${dataTestId}-error`}>
              {error}
            </p>
          )}

          {accept && (
            <p className="sr-only mt-1 text-xs text-gray-500">
              Accepted formats: {accept.split(',').join(', ')}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Enhanced variant (drag and drop)
  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${error ? 'border-red-500 bg-red-50' : ''}
          cursor-pointer`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        data-test-id={dataTestId}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
          data-test-id={dataTestId ? `${dataTestId}-input` : undefined}
          id={dataTestId}
          multiple={maxFiles > 1}
        />

        <div className="text-center">
          {files.length === 0 ? (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-2 flex text-sm text-gray-600">
                <label
                  htmlFor={dataTestId}
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>{label}</span>
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                {accept ? accept.split(',').join(', ') : 'Any file type'} up to{' '}
                {maxSizeMB}MB
              </p>
            </>
          ) : (
            <div className="space-y-1">
              <ul className="divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="py-2 flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 flex-1 w-0 truncate">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex space-x-4">
                      <span className="text-gray-500">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={clearFiles}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${dataTestId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
