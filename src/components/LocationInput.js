import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchWeather, fetchForecast } from '../redux/weatherslice';
import './LocationInput.css';
import '../App.css';

function LocationInput() {
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState(null); // For displaying error messages
  const dispatch = useDispatch();

  // Handle form submission for location input
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!location.trim()) {
      setErrorMessage("Please enter a valid location.");
      return; // Don't proceed if the location input is empty
    }

    setErrorMessage(null); // Clear any previous error message

    dispatch(fetchWeather(location)); // Dispatch action to fetch weather for the location
    dispatch(fetchForecast(location)); // Dispatch action to fetch forecast for the location
    setLocation(''); // Clear input after submission
  };

  // Request the user's current location using Geolocation API
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Use the coordinates to fetch weather and forecast
          dispatch(fetchWeather({ latitude, longitude }));
          dispatch(fetchForecast({ latitude, longitude }));
        },
        (error) => {
          setErrorMessage("Unable to retrieve your location. Please allow location access.");
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="loc">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>
      <button onClick={handleGetCurrentLocation}>Use Current Location</button>

      {/* Show error message if the location is empty or invalid */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default LocationInput;
