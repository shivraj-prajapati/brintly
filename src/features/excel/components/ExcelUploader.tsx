import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileSpreadsheet, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface ExcelUploaderProps {
  onFileUpload: (file: File) => void;
  onLoadDemo: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  onFileUpload,
  onLoadDemo,
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
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isLoading}
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-200 ${
          isDragActive
            ? 'border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-500/10'
            : 'border-surface-200 hover:border-emerald-500/50 hover:bg-surface-50/50 bg-white'
        }`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center">
          {/* Icon Circle */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-105 ${
              isDragActive
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
            }`}
          >
            {isDragActive ? (
              <UploadCloud className="w-7 h-7 animate-pulse" />
            ) : (
              <FileSpreadsheet className="w-7 h-7" />
            )}
          </div>

          {/* Heading & Subtext */}
          <h3 className="text-base font-semibold text-surface-900 mb-1.5">
            Upload your financial workbook
          </h3>
          <p className="text-xs text-surface-500 leading-relaxed mb-6">
            Drag and drop your Excel spreadsheet here, or{' '}
            <span className="text-emerald-700 font-medium underline underline-offset-2">
              browse from your computer
            </span>
            . Supports both modern <span className="font-mono text-surface-700">.xlsx</span> and legacy{' '}
            <span className="font-mono text-surface-700">.xls</span>.
          </p>

          {/* Primary Action Button */}
          <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={openFileDialog}
              isLoading={isLoading}
              leftIcon={<UploadCloud className="w-4 h-4" />}
            >
              Select Spreadsheet
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onLoadDemo}
              disabled={isLoading}
              leftIcon={<Sparkles className="w-4 h-4 text-emerald-600" />}
            >
              Load Demo Model
            </Button>
          </div>

          {/* Constraints Footnote */}
          <div className="mt-6 flex items-center space-x-4 text-[11px] text-surface-400">
            <span>Max file size: 25 MB</span>
            <span>•</span>
            <span>Multi-sheet preserved</span>
            <span>•</span>
            <span>Formulas & numbers parsed</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50/80 border border-red-200 flex items-start space-x-3 text-red-800 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-red-900">Upload failed</p>
            <p className="mt-0.5 text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
