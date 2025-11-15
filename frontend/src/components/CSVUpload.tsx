import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const CSVUpload: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.uploadCSV(file),
    onSuccess: (data) => {
      toast.success('CSV uploaded successfully! Processing...');
      setIsOpen(false);
      setSelectedFile(null);
      // Poll for status
      pollUploadStatus(data.upload_id);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to upload CSV');
    },
  });

  const pollUploadStatus = async (uploadId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = setInterval(async () => {
      attempts++;
      try {
        const status = await api.getUploadStatus(uploadId);
        if (status.status === 'completed') {
          clearInterval(poll);
          toast.success('CSV processing completed!');
        } else if (status.status === 'failed') {
          clearInterval(poll);
          toast.error(`Processing failed: ${status.message}`);
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          toast.error('Processing timeout');
        }
      } catch (error) {
        clearInterval(poll);
        toast.error('Failed to check upload status');
      }
    }, 2000);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span>Upload CSV</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Upload CSV File
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedFile(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                  selectedFile
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-slate-400" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Click to select CSV file
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Max size: 10MB
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedFile(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CSVUpload;

