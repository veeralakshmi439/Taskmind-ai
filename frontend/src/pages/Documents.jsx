import { useState, useRef, useEffect } from 'react';
import { Search, FileText, Plus, Upload, X, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import CreateDocumentModal from '../components/modals/CreateDocumentModal';

const categories = ['All', 'Specs', 'Notes', 'Design', 'Reports', 'Contracts'];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Load documents from localStorage on component mount
  useEffect(() => {
    const savedDocs = localStorage.getItem('taskmind_documents');
    if (savedDocs) {
      try {
        const parsed = JSON.parse(savedDocs);
        setDocuments(parsed);
      } catch (e) {
        console.error('Error loading documents:', e);
      }
    }
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('taskmind_documents', JSON.stringify(documents));
    }
  }, [documents]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Function to analyze file content based on extension and name
  const analyzeDocument = (file) => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type;
    
    let analysis = {
      category: 'Notes',
      confidence: 'medium',
      description: '',
      tags: [],
      suggestions: []
    };

    // Check file extension
    if (fileName.endsWith('.pdf')) {
      analysis.category = 'Reports';
      analysis.description = 'PDF Document - Likely a report or formal document';
      analysis.tags.push('pdf', 'document');
      analysis.suggestions.push('Contains structured content');
    } 
    else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      analysis.category = 'Specs';
      analysis.description = 'Word Document - Likely specifications or requirements';
      analysis.tags.push('word', 'specification');
      analysis.suggestions.push('May contain text, tables, and images');
    }
    else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      analysis.category = 'Reports';
      analysis.description = 'Excel Spreadsheet - Likely data or analytics report';
      analysis.tags.push('excel', 'data', 'analytics');
      analysis.suggestions.push('Contains structured data, charts, or calculations');
    }
    else if (fileName.endsWith('.pptx') || fileName.endsWith('.ppt')) {
      analysis.category = 'Design';
      analysis.description = 'PowerPoint Presentation - Likely design or proposal';
      analysis.tags.push('presentation', 'slides');
      analysis.suggestions.push('Visual content with slides');
    }
    else if (fileName.endsWith('.md') || fileName.endsWith('.txt')) {
      analysis.category = 'Notes';
      analysis.description = 'Text/Markdown Document - Notes or documentation';
      analysis.tags.push('text', 'markdown', 'notes');
      analysis.suggestions.push('Plain text content');
    }
    else if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.svg')) {
      analysis.category = 'Design';
      analysis.description = 'Image File - Design asset or screenshot';
      analysis.tags.push('image', 'design');
      analysis.suggestions.push('Visual content - UI/UX or design mockup');
    }
    else if (fileName.includes('report') || fileName.includes('analysis') || fileName.includes('analytics')) {
      analysis.category = 'Reports';
      analysis.description = 'Looks like a report document';
      analysis.tags.push('report', 'analysis');
      analysis.confidence = 'high';
    }
    else if (fileName.includes('spec') || fileName.includes('requirement') || fileName.includes('architecture')) {
      analysis.category = 'Specs';
      analysis.description = 'Looks like a specification document';
      analysis.tags.push('specs', 'requirements');
      analysis.confidence = 'high';
    }
    else if (fileName.includes('contract') || fileName.includes('agreement') || fileName.includes('nda')) {
      analysis.category = 'Contracts';
      analysis.description = 'Looks like a legal/contract document';
      analysis.tags.push('contract', 'legal');
      analysis.confidence = 'high';
    }
    else if (fileName.includes('design') || fileName.includes('ui') || fileName.includes('ux') || fileName.includes('mockup')) {
      analysis.category = 'Design';
      analysis.description = 'Looks like a design document';
      analysis.tags.push('design', 'ui', 'ux');
      analysis.confidence = 'high';
    }

    return analysis;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    const file = files[0];
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setAnalyzing(true);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Analyze the document
    setTimeout(() => {
      const analysis = analyzeDocument(file);
      
      // Create document with analysis
      const newDoc = {
        id: Date.now(), // Unique ID using timestamp
        name: file.name,
        date: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        description: analysis.description || `${file.type || 'Document'} - ${(file.size / 1024).toFixed(1)} KB`,
        category: analysis.category,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        owner: 'You',
        icon: FileText,
        tags: analysis.tags || [],
        suggestions: analysis.suggestions || [],
        confidence: analysis.confidence || 'medium',
        fileName: file.name,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
      };
      
      // Save to state (which will trigger localStorage save)
      setDocuments(prevDocs => [newDoc, ...prevDocs]);
      setUploading(false);
      setAnalyzing(false);
      setUploadProgress(0);
      
      // Show smart notification with analysis
      const categoryEmoji = {
        'Reports': '📊',
        'Specs': '📋',
        'Design': '🎨',
        'Notes': '📝',
        'Contracts': '📄'
      };
      
      toast.success(
        `✅ "${file.name}" uploaded!\n` +
        `📂 Categorized as: ${analysis.category}\n` +
        `🏷️ Tags: ${analysis.tags.join(', ') || 'None'}`
      );
      
      e.target.value = '';
    }, 2000);
  };

  const handleNewDocument = () => {
    setIsModalOpen(true);
  };

  const handleDocumentCreated = (newDoc) => {
    const docWithId = {
      ...newDoc,
      id: Date.now(),
      uploadedAt: new Date().toISOString(),
    };
    setDocuments(prevDocs => [docWithId, ...prevDocs]);
  };

  const handleDeleteDocument = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
      toast.success('Document deleted');
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.xlsx,.pptx,.ppt,.csv,.json,.xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Documents</h1>
          <p className="text-text-secondary text-sm">
            {documents.length > 0 
              ? `${documents.length} documents in your workspace` 
              : 'Specs, notes and reports connected to your work.'}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={handleUploadClick}
            disabled={uploading}
            className={`flex items-center gap-2 px-4 py-2 bg-background-card border border-white/10 rounded-lg hover:border-primary/30 transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">{analyzing ? 'Analyzing...' : 'Uploading...'}</span>
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

      {/* Upload Progress & Analysis */}
      {uploading && (
        <div className="glass-card p-4 border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                {analyzing ? (
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                ) : (
                  <Upload className="w-4 h-4 text-primary animate-pulse" />
                )}
              </div>
              <div>
                <p className="text-sm text-text font-medium">
                  {analyzing ? '🔍 Analyzing document...' : 'Uploading document...'}
                </p>
                <p className="text-xs text-text-muted">
                  {analyzing ? 'Identifying document type and content' : `${uploadProgress}% complete`}
                </p>
              </div>
            </div>
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

      {/* Document Count Bar */}
      {documents.length > 0 && (
        <div className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Total:</span>
            <span className="text-text font-medium">{documents.length} documents</span>
          </div>
          <div className="flex items-center gap-4 text-text-muted">
            {categories.slice(1).map(cat => {
              const count = documents.filter(d => d.category === cat).length;
              return count > 0 ? (
                <span key={cat}>{cat}: {count}</span>
              ) : null;
            })}
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-background-card text-text-secondary hover:text-text hover:bg-white/5'
                }`}
              >
                {category}
                <span className="text-xs opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document List */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDocuments.map((doc) => {
            const IconComponent = doc.icon || FileText;
            const categoryColors = {
              'Reports': 'border-blue-500/30',
              'Specs': 'border-purple-500/30',
              'Design': 'border-pink-500/30',
              'Notes': 'border-green-500/30',
              'Contracts': 'border-yellow-500/30'
            };
            const categoryEmojis = {
              'Reports': '📊',
              'Specs': '📋',
              'Design': '🎨',
              'Notes': '📝',
              'Contracts': '📄'
            };
            
            return (
              <div key={doc.id} className={`glass-card-hover p-5 border-l-4 ${categoryColors[doc.category] || 'border-primary/30'}`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors truncate">
                          {doc.name}
                        </h3>
                        <span className="text-xs text-text-muted flex-shrink-0">
                          {categoryEmojis[doc.category] || '📄'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-text-muted hover:text-red-400 transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{doc.description}</p>
                    
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {doc.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            #{tag}
                          </span>
                        ))}
                        {doc.tags.length > 3 && (
                          <span className="text-xs text-text-muted">+{doc.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                      <span>{doc.category}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.owner}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                    </div>
                    
                    {doc.suggestions && doc.suggestions.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI: {doc.suggestions[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* Create Document Modal */}
      <CreateDocumentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDocumentCreated={handleDocumentCreated}
      />
    </div>
  );
};

export default Documents;