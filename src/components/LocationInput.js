import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchWeather, fetchForecast } from '../redux/weatherslice';
import './LocationInput.css';
import '../App.css';

const LOCATIONIQ_API_KEY = 'pk.e7aa635aad8d83faf4481c9eb9618a31'; // Replace with your actual API key

function LocationInput() {
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [suggestions, setSuggestions] = useState([]); // To store location suggestions
  const dispatch = useDispatch();

  // Handle form submission for location input
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!location.trim()) {
      setErrorMessage("Please enter a valid location.");
      return;
    }

    setErrorMessage(null); // Clear any previous error message
    dispatch(fetchWeather(location)); // Dispatch action to fetch weather
    dispatch(fetchForecast(location)); // Dispatch action to fetch forecast
    setLocation(''); // Clear input after submission
    setSuggestions([]); // Clear suggestions after submission
  };

  // Fetch location suggestions from LocationIQ
  useEffect(() => {
    if (location.trim().length > 2) {
      // If location length is greater than 2 characters, start fetching suggestions
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${location}&format=json`
          );
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error('Error fetching location suggestions:', error);
          setErrorMessage('Unable to fetch location suggestions.');
        }
      };

      const debounceTimer = setTimeout(fetchSuggestions, 500); // Debounce to reduce API calls

      return () => clearTimeout(debounceTimer); // Cleanup the timeout on unmount
    } else {
      setSuggestions([]); // Clear suggestions if location input is empty or too short
    }
  }, [location]);

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.display_name); // Set the location to the selected suggestion
    setSuggestions([]); // Clear suggestions after selection
  };

  // Request the user's current location using Geolocation API
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
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

      {/* Show error message if location is empty or invalid */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Render suggestions if there are any */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationInput;
