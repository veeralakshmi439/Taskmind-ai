-- =========================================================
-- TaskMind AI - MySQL Database Schema
-- Database: taskmind_ai
-- =========================================================

-- Create database
CREATE DATABASE IF NOT EXISTS taskmind_ai;

-- Select database
USE taskmind_ai;


-- =========================================================
-- 1. USERS
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'Member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. TEAMS
-- =========================================================

CREATE TABLE IF NOT EXISTS teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. TEAM MEMBERS
-- =========================================================

CREATE TABLE IF NOT EXISTS team_members (
    team_member_id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_team_members_team
        FOREIGN KEY (team_id)
        REFERENCES teams(team_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_team_members_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_team_user
        UNIQUE (team_id, user_id)
);


-- =========================================================
-- 4. PROJECTS
-- =========================================================

CREATE TABLE IF NOT EXISTS projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    status VARCHAR(50) NOT NULL DEFAULT 'Active',

    progress INT NOT NULL DEFAULT 0,

    tasks_done INT NOT NULL DEFAULT 0,

    tasks_total INT NOT NULL DEFAULT 0,

    due_date DATE,

    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 5. TASKS
-- =========================================================

CREATE TABLE IF NOT EXISTS tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,

    project_id INT,
    user_id INT,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    status VARCHAR(50) NOT NULL DEFAULT 'backlog',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tasks_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_tasks_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);


-- =========================================================
-- 6. TASK LABELS
-- =========================================================

CREATE TABLE IF NOT EXISTS task_labels (
    task_label_id INT AUTO_INCREMENT PRIMARY KEY,

    task_id INT NOT NULL,

    label VARCHAR(100) NOT NULL,

    CONSTRAINT fk_task_labels_task
        FOREIGN KEY (task_id)
        REFERENCES tasks(task_id)
        ON DELETE CASCADE
);


-- =========================================================
-- 7. DOCUMENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    name VARCHAR(255) NOT NULL,

    document_date DATE,

    description TEXT,

    category VARCHAR(100),

    file_size VARCHAR(50),

    file_path VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_documents_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);


-- =========================================================
-- 8. MEETINGS
-- =========================================================

CREATE TABLE IF NOT EXISTS meetings (
    meeting_id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    agenda TEXT,

    meeting_date DATE,

    meeting_time TIME,

    duration VARCHAR(50),

    transcript TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 9. MEETING PARTICIPANTS
-- =========================================================

CREATE TABLE IF NOT EXISTS meeting_participants (
    meeting_participant_id INT AUTO_INCREMENT PRIMARY KEY,

    meeting_id INT NOT NULL,

    user_id INT NOT NULL,

    CONSTRAINT fk_meeting_participants_meeting
        FOREIGN KEY (meeting_id)
        REFERENCES meetings(meeting_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_meeting_participants_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_meeting_user
        UNIQUE (meeting_id, user_id)
);


-- =========================================================
-- 10. MEETING ACTION ITEMS
-- =========================================================

CREATE TABLE IF NOT EXISTS meeting_action_items (
    action_item_id INT AUTO_INCREMENT PRIMARY KEY,

    meeting_id INT NOT NULL,

    action_item TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_action_items_meeting
        FOREIGN KEY (meeting_id)
        REFERENCES meetings(meeting_id)
        ON DELETE CASCADE
);


-- =========================================================
-- END OF SCHEMA
-- =========================================================