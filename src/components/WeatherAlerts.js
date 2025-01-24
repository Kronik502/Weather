import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../redux/weatherslice';
import './WeatherAlerts.css';
import '../App.css';

function WeatherAlerts() {
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  const weather = useSelector((state) => state.weather.currentWeather);
  const weatherStatus = useSelector((state) => state.weather.status);
  const error = useSelector((state) => state.weather.error);

  useEffect(() => {
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location if geolocation fails
          dispatch(fetchWeather('Tembisa'));
        }
      );
    } else {
      // Geolocation not supported, fallback to default location
      dispatch(fetchWeather('Tembisa'));
    }
  }, [dispatch]);

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location;
      dispatch(fetchWeather(`${latitude},${longitude}`));
    }
  }, [dispatch, location]);

  if (weatherStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (weatherStatus === 'failed') {
    return <div>{error}</div>;
  }

  return (
    <div className='alert'>
      {weather && weather.alerts && weather.alerts.length > 0 ? (
        <div className='alert2'>
          <h2>Current Weather</h2>
          <img
            src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
            alt={weather.description}
          />
          <p>Date: {new Date(weather.date).toLocaleString()}</p>
          <p>Temperature: {weather.temperature}°C</p>
        </div>
      ) : (
        <p>No weather alerts for this location.</p>
      )}
    </div>
  );
}

export default WeatherAlerts;
