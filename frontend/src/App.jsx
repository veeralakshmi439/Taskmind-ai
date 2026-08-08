import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Meetings from './pages/Meetings';
import Calendar from './pages/Calendar';
import Team from './pages/Team';
import AIAssistant from './pages/AIAssistant';
import Documents from './pages/Documents';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/signin" element={!isAuthenticated ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />} />
        
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/signin" />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="team" element={<Team />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="documents" element={<Documents />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;