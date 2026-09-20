import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, ArrowRight, Layers, Sparkles, AlertCircle } from 'lucide-react';

interface UploadSectionProps {
  onFileSelected: (file: File) => void;
  onManualSelect: () => void;
  isLoading: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onFileSelected,
  onManualSelect,
  isLoading,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please select a JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError('Image size exceeds 12MB limit.');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
    }
  };

  // Helper to load sample test images quickly for judges
  const loadPreset = async (path: string, filename: string) => {
    try {
      const res = await fetch(path);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
      validateAndSetFile(file);
    } catch (e) {
      console.error('Failed to load sample image:', e);
    }
  };

  return (
    <section id="upload-tool" className="py-8 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Step 1 • Image Upload
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
            Upload a clear photo of the device
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            Our AI will identify the hardware category, model cues, and visible damage before tailoring your action plan.
          </p>
        </div>

        {/* Drop Zone / Preview */}
        {!selectedFile ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-emerald-400 bg-emerald-950/20 scale-[1.01]'
                : 'border-slate-700/80 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-900/70'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-base font-semibold text-white mb-1">
              Drag and drop your photo here, or <span className="text-emerald-400 underline underline-offset-2">browse files</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports JPG, PNG, WEBP (up to 12 MB)
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 max-h-[360px] flex items-center justify-center p-2">
              <img
                src={previewUrl || ''}
                alt="Uploaded device preview"
                className="max-h-[340px] w-auto max-w-full object-contain rounded-xl"
              />
              <button
                onClick={handleClear}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-red-500/80 border border-white/20 transition-all shadow-lg"
                title="Remove photo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-3 truncate">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-semibold text-white truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Replace photo
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleChange}
                  className="hidden"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Device</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Preset Quick-Picks for rapid judging */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Or test with sample electronic devices
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => loadPreset('/samples/phone_cracked.svg', 'samsung_galaxy_cracked_phone.png')}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
            >
              <span className="text-lg block mb-1">📱</span>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 truncate">
                Cracked Phone
              </p>
              <span className="text-[10px] text-slate-400">Broken screen</span>
            </button>

            <button
              onClick={() => loadPreset('/samples/laptop_damaged.svg', 'dell_laptop_damaged.png')}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
            >
              <span className="text-lg block mb-1">💻</span>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 truncate">
                Damaged Laptop
              </p>
              <span className="text-[10px] text-slate-400">Screen & hinge issue</span>
            </button>

            <button
              onClick={() => loadPreset('/samples/battery_swollen.svg', 'swollen_lithium_battery_pack.png')}
              className="p-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-500/50 text-left transition-all group"
            >
              <span className="text-lg block mb-1">⚠️</span>
              <p className="text-xs font-semibold text-red-200 group-hover:text-red-300 truncate">
                Swollen Battery
              </p>
              <span className="text-[10px] text-red-400">Hazard alert scenario</span>
            </button>

            <button
              onClick={() => loadPreset('/samples/tablet_working.svg', 'apple_ipad_working.png')}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
            >
              <span className="text-lg block mb-1">📟</span>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 truncate">
                Working Tablet
              </p>
              <span className="text-[10px] text-slate-400">Donate / Reuse</span>
            </button>
          </div>
        </div>

        {/* Manual Fallback Trigger */}
        <div className="mt-6 text-center">
          <button
            onClick={onManualSelect}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Don't have a photo right now? Choose device manually</span>
          </button>
        </div>
      </div>
    </section>
  );
};
