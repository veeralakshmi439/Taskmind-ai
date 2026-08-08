import { useState, useRef } from 'react';
import { Upload, Mic, Loader2, CheckCircle, X, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AudioUploader = ({ onMeetingScheduled }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, processing, complete, error
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file');
      return;
    }

    // Check file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size too large. Max 25MB');
      return;
    }

    await uploadAudio(file);
  };

  const uploadAudio = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('processing');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/meetings/upload-audio',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      if (response.data) {
        setUploadStatus('complete');
        setExtractedData(response.data);
        toast.success('Meeting transcribed and scheduled! 🎉');
        
        // Call the callback with the extracted data
        if (onMeetingScheduled) {
          onMeetingScheduled(response.data);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast.error(error.response?.data?.detail || 'Failed to process audio');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        uploadAudio(file);
      } else {
        toast.error('Please drop an audio file');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const resetUploader = () => {
    setUploadStatus('idle');
    setExtractedData(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {uploadStatus === 'idle' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          <h4 className="text-text font-medium">Upload Meeting Recording</h4>
          <p className="text-text-secondary text-sm mt-1">
            Drag & drop audio file or click to browse
          </p>
          <p className="text-text-muted text-xs mt-2">
            Supports MP3, WAV, M4A, FLAC (Max 25MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Processing Status */}
      {uploadStatus === 'processing' && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-text font-medium">Processing meeting audio...</p>
              <p className="text-text-secondary text-sm">Transcribing with Whisper AI</p>
              <div className="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success - Extracted Data Preview */}
      {uploadStatus === 'complete' && extractedData && (
        <div className="glass-card p-4 border border-green-500/30">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-text font-medium">{extractedData.title}</h4>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-text-secondary">
                  <span>📅 {extractedData.date}</span>
                  <span>🕐 {extractedData.time}</span>
                  {extractedData.duration && <span>⏱️ {extractedData.duration}</span>}
                  <span>👥 {extractedData.participants?.length || 0} participants</span>
                </div>
                {extractedData.agenda && (
                  <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                    {extractedData.agenda}
                  </p>
                )}
                {extractedData.action_items && extractedData.action_items.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-text-muted">Action Items:</p>
                    <ul className="text-xs text-text-secondary list-disc list-inside">
                      {extractedData.action_items.slice(0, 3).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={resetUploader}
              className="p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {uploadStatus === 'error' && (
        <div className="glass-card p-4 border border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-text font-medium">Upload failed</p>
                <p className="text-text-secondary text-sm">Please try again</p>
              </div>
            </div>
            <button
              onClick={resetUploader}
              className="px-4 py-1.5 bg-primary rounded-lg hover:bg-primary-dark transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Upload Button (always visible) */}
      {uploadStatus === 'idle' && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors text-primary text-sm"
        >
          <Upload className="w-4 h-4" />
          Upload Audio Recording
        </button>
      )}
    </div>
  );
};

export default AudioUploader;