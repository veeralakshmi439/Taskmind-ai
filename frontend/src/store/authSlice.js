import { createSlice } from '@reduxjs/toolkit';

// Check if user wanted to be remembered
const rememberMe = localStorage.getItem('rememberMe') === 'true';
const token = rememberMe ? localStorage.getItem('token') : sessionStorage.getItem('token');
const user = rememberMe 
  ? JSON.parse(localStorage.getItem('user') || 'null')
  : JSON.parse(sessionStorage.getItem('user') || 'null');

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
  rememberMe: rememberMe,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, remember } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.rememberMe = remember || false;

      if (remember) {
        // Persist across browser restarts
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('rememberMe', 'true');
      } else {
        // Only for this session
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.rememberMe = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      localStorage.removeItem('taskmind_projects');
      localStorage.removeItem('taskmind_tasks');
      localStorage.removeItem('taskmind_meetings');
      localStorage.removeItem('taskmind_documents');
      localStorage.removeItem('projects');
      localStorage.removeItem('tasks');
      localStorage.removeItem('meetings');

    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;