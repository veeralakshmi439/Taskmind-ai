from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, projects, tasks, meetings, team, documents

from app.core.config import settings

app = FastAPI(
    title="TaskMind AI API",
    description="AI Meeting-to-Project Execution Manager",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(meetings.router, prefix="/api/meetings", tags=["meetings"])
app.include_router(team.router, prefix="/api/team", tags=["team"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])


@app.get("/")
async def root():
    return {"message": "TaskMind AI API", "status": "running", "phase": "1"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}