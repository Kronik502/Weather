import React, { useState } from 'react';
import '../App.css'
function Settings() {
  const [unit, setUnit] = useState('metric'); // or 'imperial'
  const [theme, setTheme] = useState('light'); // or 'dark'

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
    // Save unit preference to local storage or state
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    // Save theme preference to local storage or state
  };

  return (
    <div className='online'>
      <h2>Settings</h2>
      <div>
        <label >
          Temperature Unit:
          <select value={unit} onChange={handleUnitChange}>
            <option value="metric">Celsius</option><br/>
            
            <option  value="imperial">Fahrenheit</option>
          </select>
        </label>
      </div>
      <div>
        <label className='imp'>
          Theme:
          <select value={theme} onChange={handleThemeChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default Settings;
