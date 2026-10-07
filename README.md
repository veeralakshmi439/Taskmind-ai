

```markdown
# 🧠 TaskMind AI

**AI-Powered Meeting-to-Project Execution Manager**

[![GitHub repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/veeralakshmi439/Taskmind-ai)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📖 Overview

**TaskMind AI** is an intelligent project execution assistant that transforms unstructured team conversations into structured, actionable workflows. It bridges the gap between **human communication** and **project execution** by automatically converting meeting discussions into tasks, ownership assignments, deadlines, and a persistent project memory.

> 🎯 **Mission:** Ensure every decision made in a meeting translates into a tracked, accountable unit of work — closing the loop between discussion and delivery.

---

## ✨ Features

### 🎨 **Frontend**
| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Live metrics, activity charts, and quick actions |
| 📁 **Projects** | Create and track projects with progress bars |
| 📋 **Tasks** | Drag-and-drop Kanban board (Backlog → Done) |
| 📅 **Meetings** | Schedule and manage meetings with AI summaries |
| 📆 **Calendar** | Interactive calendar with meeting scheduling |
| 👥 **Team** | Member cards with task assignment & contribution |
| 🤖 **AI Assistant** | Context-aware chat interface (mock mode) |
| 📄 **Documents** | Upload, categorize, and search documents |
| 📈 **Analytics** | Interactive charts for task completion & productivity |
| ⚙️ **Settings** | Profile, workspace, appearance, notifications, security |
| 🌓 **Theme** | Dark/Light/System modes with density options |

### 🔧 **Backend**
| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based secure login & registration |
| 📡 **REST API** | FastAPI endpoints for all resources |
| 🗄️ **Database** | PostgreSQL (coming soon) |
| 🤖 **AI Integration** | OpenAI Whisper + GPT (coming soon) |
| 📁 **File Upload** | Document storage (coming soon) |

---

## 🛠️ Tech Stack

### Frontend
```
React 18.x          - UI Framework
Vite 5.x            - Build Tool
Tailwind CSS 3.x    - Styling
Redux Toolkit       - State Management
React Router 6      - Navigation
Recharts 2.x        - Charts & Analytics
Lucide React        - Icons
date-fns            - Date utilities
```

### Backend
```
Python 3.10+        - Core Language
FastAPI 0.104       - API Framework
Uvicorn             - ASGI Server
SQLAlchemy          - ORM (coming soon)
PostgreSQL          - Database (coming soon)
JWT                 - Authentication
OpenAI Whisper      - Speech-to-Text (coming soon)
OpenAI GPT          - LLM (coming soon)
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.10+ ([Download](https://python.org/))
- Git ([Download](https://git-scm.com/))

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/veeralakshmi439/Taskmind-ai.git
cd Taskmind-ai
```

### 2️⃣ Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```
Backend runs at: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

### 3️⃣ Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```
Frontend runs at: **http://localhost:3000**

---

## 🔑 Demo Login

Use these credentials to explore the app:

| Field | Value |
|-------|-------|
| **Email** | `ava@taskmind.ai` |
| **Password** | `password123` |

> ℹ️ This is a demo account with mock data. AI features will be fully functional in Phase 2.

---

## 📁 Project Structure

```
Taskmind-ai/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   │   └── routes/   # Auth, Projects, Tasks, etc.
│   │   ├── core/         # Config, Security, Database
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── main.py       # FastAPI entry point
│   ├── venv/             # Python virtual environment
│   ├── requirements.txt  # Python dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   ├── layout/   # Sidebar, Header, Footer
│   │   │   ├── dashboard/# Dashboard components
│   │   │   ├── projects/ # Project components
│   │   │   ├── tasks/    # Task components
│   │   │   └── modals/   # Modal dialogs
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux slices
│   │   ├── context/      # Theme context
│   │   ├── App.jsx       # Main app
│   │   └── main.jsx      # Entry point
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite configuration
├── .gitignore
└── README.md
```

---

## 🎯 Development Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| **Phase 1** | Frontend + Authentication | ✅ Complete |
| **Phase 2** | AI Integration (Whisper + GPT) | 🔄 In Progress |
| **Phase 3** | Database (PostgreSQL) | 🔄 In Progress |
| **Phase 4** | File Storage | ⏳ Planned |
| **Phase 5** | Deployment | ⏳ Planned |
| **Phase 6** | Testing & Documentation | ⏳ Planned |

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 👥 Team

**Team Sprint Mind - AI Architects**

- Frontend Developer - UI Development, Dashboard, UX
- Backend Developer - APIs, Authentication, Server Logic
- AI/NLP Developer - Speech Processing, LLM Integration
- RAG & Database Developer - Knowledge Base, Vector DB
- Testing & Deployment Engineer - Testing, Deployment

---

## 📄 License

This project is for **educational and evaluation purposes** as part of the Project Evaluation.

---

## 🙏 Acknowledgments

- Faculty Mentors for guidance and support
- OpenAI for Whisper and GPT APIs
- Open-source community for amazing tools

---

## 📬 Contact

**Project Repository:** [https://github.com/veeralakshmi439/Taskmind-ai](https://github.com/veeralakshmi439/Taskmind-ai)

---

> ⚡ **TaskMind AI** - Turning Conversations into Execution 🚀
```

---

## 📋 How to Add It

### **Step 1: Create the file**
In VS Code, create a new file at `C:\Taskmind\README.md`

### **Step 2: Paste the content**
Copy ALL the content above and paste it into the file.

### **Step 3: Save**
Press `Ctrl+S` to save.

### **Step 4: Push to GitHub**
```bash
cd C:\Taskmind
git add README.md
git commit -m "Add professional README.md"
git push
```

---

## ✅ After Pushing

Go to: https://github.com/veeralakshmi439/Taskmind-ai

Your README will automatically render with:
- ✅ Badges at the top
- ✅ Clean formatting
- ✅ Tables
- ✅ Code blocks
- ✅ Emojis
- ✅ Sections


