import { useState } from 'react';
import { X, FileText, Tag, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateDocumentModal = ({ isOpen, onClose, onDocumentCreated }) => {
  const [docData, setDocData] = useState({
    title: '',
    description: '',
    category: 'Notes',
    tags: [],
    content: '',
  });

  const [newTag, setNewTag] = useState('');

  const categories = ['Specs', 'Notes', 'Design', 'Reports', 'Contracts'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!docData.title.trim()) {
      toast.error('Document title is required');
      return;
    }

    const newDoc = {
      id: Date.now(),
      name: docData.title,
      description: docData.description || `${docData.category} document`,
      category: docData.category,
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      size: '0 KB',
      owner: 'You',
      tags: docData.tags,
      content: docData.content,
    };

    toast.success(`Document "${docData.title}" created! 🎉`);
    
    if (onDocumentCreated) {
      onDocumentCreated(newDoc);
    }
    
    // Reset form
    setDocData({
      title: '',
      description: '',
      category: 'Notes',
      tags: [],
      content: '',
    });
    setNewTag('');
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !docData.tags.includes(newTag.trim())) {
      setDocData({
        ...docData,
        tags: [...docData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setDocData({
      ...docData,
      tags: docData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-background-card border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-text">Create New Document 📄</h2>
            <p className="text-text-secondary text-sm mt-0.5">Add a spec, note, or report to your workspace</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Document Title */}
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">
              Document Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={docData.title}
              onChange={(e) => setDocData({...docData, title: e.target.value})}
              placeholder="e.g., API Documentation, Design Specs"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
              autoFocus
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">Category</label>
            <select
              value={docData.category}
              onChange={(e) => setDocData({...docData, category: e.target.value})}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary/50 transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">Description</label>
            <textarea
              value={docData.description}
              onChange={(e) => setDocData({...docData, description: e.target.value})}
              placeholder="Brief description of this document..."
              rows="2"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">Content</label>
            <textarea
              value={docData.content}
              onChange={(e) => setDocData({...docData, content: e.target.value})}
              placeholder="Write your document content here..."
              rows="4"
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors resize-none font-mono text-sm"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tags (e.g., api, design, frontend)"
                className="flex-1 bg-background border border-white/10 rounded-lg px-4 py-2.5 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors"
              >
                Add
              </button>
            </div>
            {docData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {docData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-text-secondary"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* AI Assistant Note */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-xs text-text-secondary">
              <span className="text-primary">🤖 AI will</span> help organize and summarize your document content.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-background-card border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-text-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Create Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDocumentModal;