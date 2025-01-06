import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchForecast } from '../redux/weatherslice';
import './Forecast.css';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudRain, faSnowflake } from '@fortawesome/free-solid-svg-icons';

function Forecast({ isFahrenheit }) {
  const dispatch = useDispatch();
  const forecast = useSelector((state) => state.weather.forecast);
  const weatherStatus = useSelector((state) => state.weather.status);
  const error = useSelector((state) => state.weather.error);

  useEffect(() => {
    dispatch(fetchForecast('Tembisa')); // Default location
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

  const groupByDay = (forecastList) => {
    const groupedForecast = {};
    forecastList.forEach((item) => {
      const day = new Date(item.dt * 1000).toLocaleDateString();
      if (!groupedForecast[day]) groupedForecast[day] = [];
      groupedForecast[day].push(item);
    });
    return groupedForecast;
  };

  const groupedForecast = forecast?.list ? groupByDay(forecast.list) : {};

  const convertTemperature = (temp) => {
    const temperature = isFahrenheit ? (temp * 9) / 5 + 32 : temp;
    return isFahrenheit ? temperature.toFixed(1) : temperature; // Round to 1 decimal place for Fahrenheit
  };

  if (weatherStatus === 'loading') {
    return <div className="loading">🌦️ Fetching Weather Data...</div>;
  }

  if (weatherStatus === 'failed') {
    return <div className="error-message">❌ {error || 'Unable to fetch weather data.'}</div>;
  }

  return (
    <div className="forecast-wrapper">
      {forecast?.city ? (
        <>
          <h2 className="forecast-title">Weather Forecast for {forecast.city.name}</h2>
          <div className="forecast-container">
            {Object.keys(groupedForecast).map((day) => (
              <ForecastDay
                key={day}
                day={day}
                items={groupedForecast[day]}
                getWeatherIcon={getWeatherIcon}
                convertTemperature={convertTemperature}
                isFahrenheit={isFahrenheit}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="no-data">No weather data available.</div>
      )}
    </div>
  );
}

const ForecastDay = ({ day, items, getWeatherIcon, convertTemperature, isFahrenheit }) => (
  <div className="forecast-day">
    <h3>{day}</h3>
    {items.map(({ dt, weather, main }) => {
      const dateObj = new Date(dt * 1000);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long', // Full day name (e.g., Monday)
        year: 'numeric',
        month: 'long', // Full month name (e.g., October)
        day: 'numeric',
      });

      const formattedTime = dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // 12-hour format
      });

      return (
        <div key={dt} className="forecast-item">
          <FontAwesomeIcon icon={getWeatherIcon(weather[0].icon)} />
          <p>Date: {formattedDate}</p>
          <p>Time: {formattedTime}</p>
          <p>
            Temperature: {convertTemperature(main.temp)}°{isFahrenheit ? 'F' : 'C'}
          </p>
          <p>Weather: {weather[0].description}</p>
        </div>
      );
    })}
  </div>
);

export default Forecast;
