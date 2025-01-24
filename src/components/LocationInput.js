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

  const handleGetCurrentLocation = () => {
    console.log('Attempting to get current location...'); // Debugging log
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Position obtained:', position); // Debugging log
          const { latitude, longitude } = position.coords;
          console.log('Dispatching fetchWeather with:', { latitude, longitude }); // Debugging log
          dispatch(fetchWeather({ latitude, longitude }));
          console.log('Dispatching fetchForecast with:', { latitude, longitude }); // Debugging log
          dispatch(fetchForecast({ latitude, longitude }));
        },
        (error) => {
          console.error('Geolocation error:', error); // Debugging log
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setErrorMessage("Permission denied. Please allow location access in your browser settings.");
              break;
            case error.POSITION_UNAVAILABLE:
              setErrorMessage("Location information is unavailable. Please try again.");
              break;
            case error.TIMEOUT:
              setErrorMessage("The request to get your location timed out. Please try again.");
              break;
            case error.UNKNOWN_ERROR:
            default:
              setErrorMessage(`An unknown error occurred: ${error.message}. Please try again.`);
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser."); // Debugging log
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
      

     
      {errorMessage && <p className="error-message">{errorMessage}</p>}

     
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
