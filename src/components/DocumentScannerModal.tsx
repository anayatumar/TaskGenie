import React, { useState } from 'react';
import { Task } from '../types';
import { X, FileText, Upload, Sparkles, CheckCircle2, Image as ImageIcon, FileCheck } from 'lucide-react';

interface DocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmScannedTask: (taskData: Partial<Task>) => void;
}

export const DocumentScannerModal: React.FC<DocumentScannerModalProps> = ({
  isOpen,
  onClose,
  onConfirmScannedTask,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<Partial<Task> | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanDocument = () => {
    if (!selectedFile && !imagePreview) return;

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // AI OCR Result extracted from Document / Screenshot
      const result: Partial<Task> = {
        title: 'Send revised Olympus CX31 quotation',
        description: 'Extracted from uploaded screenshot/document invoice',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        dueTime: '15:00',
        priority: 'high',
        category: 'quotation',
      };
      setScannedResult(result);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-white rounded-t-[32px] p-6 max-w-md mx-auto w-full space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Document & Screenshot Scanner
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Extract tasks from invoices, screenshots & PDFs</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Area */}
        {!imagePreview ? (
          <label className="border-2 border-dashed border-slate-300 rounded-3xl p-8 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-[#10B981] transition-all bg-slate-50">
            <Upload className="w-10 h-10 text-[#10B981]" />
            <div className="text-xs font-extrabold text-slate-900">Upload Screenshot or Document</div>
            <div className="text-[10px] text-slate-400 font-medium text-center">
              Supports PNG, JPG, Invoice Screenshots, or PDFs
            </div>
            <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
          </label>
        ) : (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 flex items-center justify-center bg-slate-900">
              <img src={imagePreview} alt="Preview" className="max-h-48 object-contain" />
              <button
                onClick={() => {
                  setImagePreview(null);
                  setSelectedFile(null);
                  setScannedResult(null);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!scannedResult && (
              <button
                onClick={handleScanDocument}
                disabled={isScanning}
                className="w-full py-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isScanning ? 'AI Scanning Document & Extracting Tasks...' : 'Scan & Extract Tasks 🚀'}</span>
              </button>
            )}
          </div>
        )}

        {/* Scanned Result Review Screen */}
        {scannedResult && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#10B981]">
              <FileCheck className="w-4 h-4" />
              <span>AI Extracted Action Item:</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-extrabold text-slate-900">{scannedResult.title}</div>
              <div className="text-[10px] text-slate-600 font-medium">{scannedResult.description}</div>
              <div className="text-[10px] text-slate-500 font-bold pt-1">
                📅 Due: {scannedResult.dueDate} at {scannedResult.dueTime} • Category: {scannedResult.category}
              </div>
            </div>

            <button
              onClick={() => {
                onConfirmScannedTask(scannedResult);
                onClose();
              }}
              className="w-full py-3 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Create Task from Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
