import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../redux/weatherslice';
import './WeatherAlerts.css';
import '../App.css';

function WeatherAlerts() {
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weather.currentWeather);
  const weatherStatus = useSelector((state) => state.weather.status);
  const error = useSelector((state) => state.weather.error);

  useEffect(() => {
    dispatch(fetchWeather('Tembisa')); // Default location
  }, [dispatch]);

  if (weatherStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (weatherStatus === 'failed') {
    return <div>{error}</div>;
  }

  return (
    <div className='alert' >
      {weather && weather.alerts && weather.alerts.length > 0 ? (
  <div className='alert2' >
  <h2>Current Weather</h2>
  <img
    src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
    alt={weather.description}
  />
  <p>Date: {weather.date.toLocaleString()}</p>
  <p>Temperature: {weather.temperature}°C</p>
</div>
      ) : (
        <p>No weather alerts for this location.</p>
      )}
    </div>
  );
}

export default WeatherAlerts;
