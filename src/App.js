import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import LocationInput from './components/LocationInput';
import Forecast from './components/Forecast';
import WeatherAlerts from './components/WeatherAlerts';
import WeatherDisplay from './components/WeatherDisplay';
import OfflineMode from './components/OfflineMode';
import { Container, Navbar, Button } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; // Existing styles

function App() {
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTemperatureUnit = () => {
    setIsFahrenheit((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
          <Navbar expand="lg" className="custom-navbar">
            <Container className="d-flex justify-content-between align-items-center">
              {/* Left side: buttons */}
              <div className="d-flex">
                <Button
                  variant="custom-button"
                  className="toggle-button temperature-unit-button"
                  onClick={toggleTemperatureUnit}
                >
                  {isFahrenheit ? '°F' : '°C'}
                </Button>
                <Button
                  variant="custom-button"
                  className="toggle-button dark-mode-button"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>
              </div>

            
              <Navbar.Brand href="/weather" className="title">
                Weather Kronikles
              </Navbar.Brand>
            </Container>
          </Navbar>

          <Routes>
          
            <Route
              path="/"
              element={
                <div className="container">
                  <LocationInput />
                  <WeatherDisplay isFahrenheit={isFahrenheit} />
                  <Forecast isFahrenheit={isFahrenheit} />
                  <WeatherAlerts />
                  <OfflineMode />
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
