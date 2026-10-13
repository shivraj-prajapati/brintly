import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface ExcelUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  onFileUpload,
  isLoading = false,
  error = null,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFile = e.dataTransfer.files[0];
        onFileUpload(droppedFile);
      }
    },
    [onFileUpload]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      onFileUpload(selectedFile);
      e.target.value = ''; // Reset for re-selection
    }
  };

  const openFileDialog = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isLoading}
      />

      {/* Sleek, Compact Aesthetic Drop & Upload Card */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`relative group cursor-pointer rounded-2xl border transition-all duration-200 p-4 sm:p-5 text-center bg-white/90 backdrop-blur-md shadow-card hover:shadow-xl ${
          isDragActive
            ? 'border-emerald-500 bg-emerald-50/80 ring-4 ring-emerald-500/15 scale-[1.01]'
            : 'border-surface-200 hover:border-emerald-400'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Left: Icon + Label */}
          <div className="flex items-center space-x-3 text-left">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                isDragActive
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isDragActive ? (
                <UploadCloud className="w-5 h-5 animate-pulse" />
              ) : (
                <FileSpreadsheet className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="text-sm font-extrabold text-surface-900 group-hover:text-emerald-700 transition-colors">
                Upload Excel Salary Sheet
              </div>
              <p className="text-[11px] text-surface-500 leading-tight">
                Drop <span className="font-mono text-surface-700 font-semibold">.xlsx</span> or <span className="font-mono text-surface-700 font-semibold">.xls</span> here, or click to browse
              </p>
            </div>
          </div>

          {/* Right: High-Contrast Dark Action Button (Payway Inspired) */}
          <div className="flex-shrink-0 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={openFileDialog}
              isLoading={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 font-bold shadow-md hover:shadow-lg transition-all"
              leftIcon={<UploadCloud className="w-4 h-4" />}
            >
              Choose Spreadsheet
            </Button>
          </div>
        </div>
      </div>

      {/* Error Feedback */}
      {error && (
        <div className="p-3 bg-red-50/90 border border-red-200 rounded-xl flex items-center space-x-2.5 text-xs text-red-700 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

