import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  tasks: [],
  meetings: [],
  loading: false,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setMeetings: (state, action) => {
      state.meetings = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setProjects, setTasks, setMeetings, setLoading } = projectSlice.actions;
export default projectSlice.reducer;