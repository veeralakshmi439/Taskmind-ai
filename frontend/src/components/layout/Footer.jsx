import { useState, useEffect } from 'react';

const Footer = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState({
    temp: '30°C',
    condition: '☁️ Partly cloudy'
  });

  // Update time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time: HH:MM AM/PM
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      setTime(`${displayHours}:${minutes} ${ampm}`);
      
      // Format date: MM/DD/YYYY
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const year = now.getFullYear();
      setDate(`${month}/${day}/${year}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate weather changes every 30 seconds (for demo)
  useEffect(() => {
    const weatherConditions = [
      { temp: '30°C', condition: '☀️ Sunny' },
      { temp: '28°C', condition: '⛅ Partly cloudy' },
      { temp: '25°C', condition: '🌧️ Light rain' },
      { temp: '32°C', condition: '☀️ Clear sky' },
      { temp: '27°C', condition: '🌤️ Mostly sunny' },
      { temp: '22°C', condition: '🌙 Night sky' },
      { temp: '29°C', condition: '🌦️ Passing showers' },
    ];

    const updateWeather = () => {
      const randomIndex = Math.floor(Math.random() * weatherConditions.length);
      setWeather(weatherConditions[randomIndex]);
    };

    // Change weather every 30 seconds
    const weatherInterval = setInterval(updateWeather, 30000);

    return () => clearInterval(weatherInterval);
  }, []);

  return (
    <footer className="border-t border-white/5 px-6 py-3 flex items-center justify-between bg-background/50 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-6 text-xs text-text-muted">
        <span>Phase 1 preview</span>
        <span>Running on mock data. AI features arrive in Phase 2.</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <span>{weather.temp}</span>
          <span>{weather.condition}</span>
        </div>
        <span>{time}</span>
        <span>{date}</span>
      </div>
    </footer>
  );
};

export default Footer;