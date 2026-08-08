import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { day: 'Mon', newProject: 2, newTask: 5, scheduleMeeting: 1, uploadDocument: 3 },
  { day: 'Tue', newProject: 1, newTask: 8, scheduleMeeting: 2, uploadDocument: 4 },
  { day: 'Wed', newProject: 3, newTask: 4, scheduleMeeting: 0, uploadDocument: 2 },
  { day: 'Thu', newProject: 0, newTask: 6, scheduleMeeting: 3, uploadDocument: 5 },
  { day: 'Fri', newProject: 2, newTask: 7, scheduleMeeting: 1, uploadDocument: 3 },
  { day: 'Sat', newProject: 0, newTask: 2, scheduleMeeting: 0, uploadDocument: 0 },
  { day: 'Sun', newProject: 0, newTask: 0, scheduleMeeting: 0, uploadDocument: 0 },
];

const ActivityChart = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
          <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a2e', 
              border: '1px solid #2a2a4a',
              borderRadius: '8px',
              color: '#ffffff'
            }}
          />
          <Legend />
          <Bar dataKey="newProject" fill="#6c5ce7" radius={[4, 4, 0, 0]} />
          <Bar dataKey="newTask" fill="#00b894" radius={[4, 4, 0, 0]} />
          <Bar dataKey="scheduleMeeting" fill="#e74c3c" radius={[4, 4, 0, 0]} />
          <Bar dataKey="uploadDocument" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;