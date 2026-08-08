import { useState, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, FolderKanban, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AIAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "👋 Hello! I'm TaskMind AI, your intelligent project companion. I can help you with project insights, task management, and meeting summaries.\n\nTo get started, create a project or schedule a meeting. I'll then be able to analyze your work and provide meaningful insights.",
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  // Check if user has any projects or meetings
  useEffect(() => {
    // In a real app, this would check your actual data
    // For now, we'll check localStorage or a simple flag
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const meetings = JSON.parse(localStorage.getItem('meetings') || '[]');
    setHasData(projects.length > 0 || meetings.length > 0);
  }, []);

  // Check if user actually has data when they ask about specific things
  const checkDataExists = () => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const meetings = JSON.parse(localStorage.getItem('meetings') || '[]');
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    return { hasProjects: projects.length > 0, hasMeetings: meetings.length > 0, hasTasks: tasks.length > 0 };
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      time: 'Just now'
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Analyze user query and data state
    setTimeout(() => {
      const dataState = checkDataExists();
      let response = '';
      
      const userQuery = input.toLowerCase();
      const { hasProjects, hasMeetings, hasTasks } = dataState;

      // Check if user is asking about specific project-related things
      if (userQuery.includes('risk') || userQuery.includes('risks')) {
        if (!hasProjects) {
          response = "🔍 I don't see any projects or tasks in your workspace yet. To identify risks, I need project data to analyze. Please create your first project, and I'll help you identify and track risks as you work.";
        } else {
          response = "📋 I've analyzed your project data. Here are the current risks identified based on your tasks and progress:\n\n1. ⚠️ **Task completion rate**: Some tasks are approaching deadlines without updates\n2. ⚠️ **Resource allocation**: Team members may be overloaded\n3. ⚠️ **Dependency blockers**: Some tasks are waiting on others\n\nTo get more specific risk analysis, please add more details to your tasks and track progress regularly.";
        }
      } 
      else if (userQuery.includes('task') || userQuery.includes('tasks')) {
        if (!hasTasks && !hasProjects) {
          response = "📝 You don't have any tasks yet. Start by creating a project and adding tasks. I'll then help you track progress and identify what needs attention.\n\n💡 Tip: Click 'New Project' in your dashboard to get started!";
        } else {
          response = "📊 I've analyzed your tasks. Based on the current workload, I recommend prioritizing tasks with upcoming deadlines. Focus on completing high-priority items first.\n\nWould you like me to help you organize your tasks by priority?";
        }
      }
      else if (userQuery.includes('meeting') || userQuery.includes('meetings')) {
        if (!hasMeetings) {
          response = "📅 I don't see any scheduled meetings yet. To get meeting insights, schedule your first meeting and I'll help you track decisions, action items, and follow-ups.\n\n💡 Click 'Schedule Meeting' in your dashboard to get started!";
        } else {
          response = "💬 Here's a summary of your recent meetings:\n\n• Key decisions made\n• Action items assigned\n• Pending follow-ups\n\nWould you like me to generate a detailed meeting report?";
        }
      }
      else if (userQuery.includes('project') || userQuery.includes('projects')) {
        if (!hasProjects) {
          response = "🚀 You haven't created any projects yet. Projects are the foundation of your workspace. Create a project to start tracking work, assigning tasks, and monitoring progress.\n\n💡 Ready to start? Click 'New Project' to create your first one!";
        } else {
          response = "📁 I can help you manage your projects. Here's what I can assist with:\n\n• Track project progress\n• Identify bottlenecks\n• Suggest timeline adjustments\n• Generate status reports\n\nJust let me know what you need!";
        }
      }
      else if (userQuery.includes('capacity') || userQuery.includes('team')) {
        if (!hasProjects) {
          response = "👥 I don't have team or capacity data yet. To analyze team capacity, you need to create projects and assign tasks to team members. Start by setting up your first project!";
        } else {
          response = "👤 Based on your team's workload, here's a capacity overview:\n\n• Team members assigned to active projects\n• Current workload distribution\n• Available capacity for new tasks\n\nWould you like to see detailed capacity planning?";
        }
      }
      else if (userQuery.includes('hello') || userQuery.includes('hi') || userQuery.includes('hey')) {
        response = "👋 Hello! I'm your AI assistant. I can help you with:\n\n• 📋 Task management and prioritization\n• 📊 Project progress tracking\n• 📅 Meeting summaries and action items\n• 🎯 Risk identification and mitigation\n• 👥 Team capacity planning\n\nWhat would you like to know?";
      }
      else if (userQuery.includes('help') || userQuery.includes('what can you do')) {
        response = "🤖 I'm here to help you manage your work efficiently. Here's what I can do:\n\n1. **Task Management**: Create, organize, and prioritize tasks\n2. **Project Tracking**: Monitor progress and identify risks\n3. **Meeting Insights**: Summarize decisions and action items\n4. **Team Analysis**: Track workload and capacity\n5. **Risk Detection**: Identify potential issues early\n\nJust ask me anything about your projects or tasks!";
      }
      else {
        // Generic response for unrecognized queries
        if (!hasProjects) {
          response = "💡 I'd love to help you with that! However, I don't see any projects or tasks in your workspace yet. To get personalized insights:\n\n1. Create your first project\n2. Add tasks to your project\n3. Schedule meetings with your team\n\nOnce you have some data, I'll be able to provide meaningful analysis and insights. What would you like to start with?";
        } else {
          response = "🤔 I'm analyzing your workspace data. Could you be more specific about what you need help with? I can assist with:\n\n• Project progress\n• Task prioritization\n• Meeting summaries\n• Risk assessment\n• Team capacity\n\nJust ask and I'll help!";
        }
      }

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'assistant',
        content: response,
        time: 'Just now'
      }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'project':
        toast.success('Opening project creator...');
        navigate('/projects');
        break;
      case 'meeting':
        toast.success('Opening meeting scheduler...');
        navigate('/meetings');
        break;
      case 'task':
        toast.success('Opening task creator...');
        navigate('/tasks');
        break;
      default:
        break;
    }
  };

  const suggestions = [
    { text: "What tasks are at risk?", icon: "⚠️" },
    { text: "Summarise my meetings", icon: "📝" },
    { text: "Who has capacity this week?", icon: "👤" },
    { text: "Help me plan my tasks", icon: "📋" },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">AI Assistant</h1>
          <p className="text-text-secondary text-sm">Your intelligent project companion.</p>
        </div>
        {!hasData && (
          <div className="flex gap-3 flex-wrap">
            <button 
              onClick={() => handleQuickAction('project')}
              className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors text-sm"
            >
              <FolderKanban className="w-4 h-4" />
              <span>Create Project</span>
            </button>
            <button 
              onClick={() => handleQuickAction('meeting')}
              className="flex items-center gap-2 px-4 py-2 bg-background-card border border-white/10 rounded-lg hover:border-primary/30 transition-colors text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Meeting</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 glass-card p-4 flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.type === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'assistant' 
                  ? 'bg-gradient-to-br from-primary to-primary-light' 
                  : 'bg-white/10'
              }`}>
                {message.type === 'assistant' ? (
                  <Bot className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-text-secondary" />
                )}
              </div>
              <div className={`max-w-[80%] ${
                message.type === 'user' ? 'bg-primary/20' : 'bg-background-card'
              } rounded-lg p-3`}>
                <p className="text-sm text-text whitespace-pre-line">{message.content}</p>
                <p className="text-xs text-text-muted mt-1">{message.time}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-background-card rounded-lg p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {!hasData && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-text font-medium">No data in your workspace yet</p>
                <p className="text-xs text-text-secondary mt-1">
                  Create a project or schedule a meeting to get personalized insights.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary mt-1" />
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(suggestion.text);
                setTimeout(handleSend, 100);
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text transition-colors border border-white/5"
            >
              {suggestion.icon} {suggestion.text}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about projects, meetings or tasks..."
            className="flex-1 bg-background-card border border-white/10 rounded-lg px-4 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;