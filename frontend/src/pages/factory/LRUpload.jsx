import { useState } from 'react';
import { orderService } from '../../services/dataService';
import Button from '../../components/common/Button';
import { UploadCloud, CheckCircle, FileUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LRUpload({ orderId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files[0] || e.target.files[0];
    if (f) {
      if (f.type.startsWith('image/') || f.type === 'application/pdf') {
        setFile(f);
        if (f.type.startsWith('image/')) {
          setPreview(URL.createObjectURL(f));
        } else {
          setPreview('');
        }
      } else {
        toast.error('Only images or PDF files are allowed.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('lr_file', file);
      const res = await orderService.uploadLR(orderId, formData);
      toast.success('LR document uploaded successfully!');
      onSuccess?.(res.data?.data?.file_url || res.data?.data?.lr_document_url);
    } catch {
      // toast is handled in interceptor
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 border-t border-border pt-4">
      <h4 className="text-sm font-bold text-text-primary mb-3">Upload LR Document</h4>
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-surface-alt hover:border-primary-lighter transition-colors cursor-pointer"
        >
          <input
            type="file"
            id={`lr-upload-${orderId}`}
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleDrop}
          />
          <label htmlFor={`lr-upload-${orderId}`} className="cursor-pointer flex flex-col items-center">
            <UploadCloud size={32} className="text-text-muted mb-2" />
            <p className="text-sm font-medium text-text-primary">Click or drag file here</p>
            <p className="text-xs text-text-muted mt-1">Images or PDF only</p>
          </label>
        </div>
      ) : (
        <div className="bg-surface-alt border border-border rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 rounded-lg bg-white border border-border flex flex-shrink-0 items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <FileUp size={20} className="text-text-muted" />
              )}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
              <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button onClick={() => { setFile(null); setPreview(''); }} className="text-error text-xs hover:underline ml-2">Remove</button>
        </div>
      )}

      {file && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleUpload} loading={uploading} variant="primary" icon={CheckCircle}>
            Upload LR
          </Button>
        </div>
      )}
    </div>
  );
}
