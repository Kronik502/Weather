import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../redux/weatherslice';
import './WeatherDisplay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudRain, faSnowflake } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

function WeatherDisplay({ isFahrenheit }) {
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weather.currentWeather);
  const weatherStatus = useSelector((state) => state.weather.status);
  const error = useSelector((state) => state.weather.error);

  useEffect(() => {
    dispatch(fetchWeather('Johannesburg')); // Default location
  }, [dispatch]);

  const getWeatherIcon = (icon) => {
    switch (icon) {
      case '01d':
      case '01n':
        return faSun;
      case '02d':
      case '02n':
        return faCloud;
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return faCloudRain;
      case '13d':
      case '13n':
        return faSnowflake;
      default:
        return faCloud;
    }
  };

  const convertTemperature = (temp) => {
    const temperature = isFahrenheit ? (temp * 9) / 5 + 32 : temp;
    return isFahrenheit ? temperature.toFixed(1) : temperature; // Round Fahrenheit to 1 decimal place
  };

  if (weatherStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (weatherStatus === 'failed') {
    return <div>{error || 'Unable to fetch weather data'}</div>;
  }

  if (!weather) {
    // If weather data is null or undefined, we render nothing or a fallback message
    return <div>No weather data available.</div>;
  }

  // Check if weather has a valid date property (to prevent null reference errors)
  const formattedDate = weather.date ? new Date(weather.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';

  // If the weather doesn't have a valid date, we can return early or render a default value
  if (!formattedDate) {
    return <div>Weather data is incomplete or invalid.</div>;
  }

  // Format the time (optional, if you want to show the time of the current weather)
  const formattedTime = weather.date ? new Date(weather.date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }) : '';

  return (
    <div className="current">
      {weather && (
        <div className="weather-display">
          <h2>Current Weather</h2>
          <FontAwesomeIcon icon={getWeatherIcon(weather.icon)} className="weather-icon" />
          <p>Date: {formattedDate}</p>
          <p>Time: {formattedTime}</p>
          <p>
            Temperature: {convertTemperature(weather.temperature)}°{isFahrenheit ? 'F' : 'C'}
          </p>
        </div>
      )}
    </div>
  );
}

export default WeatherDisplay;
