import { useState, useRef, useEffect } from 'react';
import { Search, FileText, Plus, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = ['All', 'Specs', 'Notes', 'Design', 'Reports', 'Contracts'];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Load documents from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('taskmind_documents');
      if (saved) {
        setDocuments(JSON.parse(saved));
      }
    } catch (e) {
      console.log('Error loading documents:', e);
    }
  }, []);

  // Save documents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('taskmind_documents', JSON.stringify(documents));
    } catch (e) {
      console.log('Error saving documents:', e);
    }
  }, [documents]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 300);

    setTimeout(() => {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        category: 'Notes',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        owner: 'You',
        description: `Uploaded file: ${file.name}`,
        tags: []
      };

      setDocuments([newDoc, ...documents]);
      setUploading(false);
      setUploadProgress(0);
      toast.success(`"${file.name}" uploaded!`);
      e.target.value = '';
    }, 2000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
      toast.success('Document deleted');
    }
  };

  const handleNewDocument = () => {
    toast.success('Creating new document...');
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Documents</h1>
          <p className="text-text-secondary text-sm">
            {documents.length > 0 
              ? `${documents.length} documents in your workspace` 
              : 'Upload or create documents for your workspace'}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={handleUploadClick}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-background-card border border-white/10 rounded-lg hover:border-primary/30 transition-colors"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload</span>
              </>
            )}
          </button>
          <button 
            onClick={handleNewDocument}
            className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New Document</span>
          </button>
        </div>
      </div>

      {uploading && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text">Uploading...</span>
            <span className="text-sm text-primary">{uploadProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background-card border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const count = category === 'All' 
              ? documents.length 
              : documents.filter(d => d.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-background-card text-text-secondary hover:text-text hover:bg-white/5'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="glass-card-hover p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text truncate">
                      {doc.name}
                    </h3>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-text-muted hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{doc.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                    <span>{doc.category}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-text">No documents yet</h3>
            <p className="text-text-secondary mt-2 text-sm">
              Upload your first document or create a new one.
            </p>
            <div className="flex gap-3 justify-center mt-6 flex-wrap">
              <button 
                onClick={handleUploadClick}
                className="flex items-center gap-2 px-4 py-2 bg-background-card border border-white/10 rounded-lg hover:border-primary/30 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </button>
              <button 
                onClick={handleNewDocument}
                className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;