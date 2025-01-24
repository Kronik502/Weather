import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = '1935857dd015dc0a09a79ccbeaac344d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Fetch current weather
// Fetch current weather
export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (location) => {
    try {
      const params = typeof location === 'string' ? { q: location } : { lat: location.latitude, lon: location.longitude };
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          ...params,
          appid: API_KEY,
          units: 'metric',
        },
      });
      return parseWeatherData(response.data);
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : error.message);
    }
  }
);

// Fetch weather forecast
export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (location) => {
    try {
      const params = typeof location === 'string' ? { q: location } : { lat: location.latitude, lon: location.longitude };
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          ...params,
          appid: API_KEY,
          units: 'metric',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : error.message);
    }
  }
);

// Function to parse the weather data
const parseWeatherData = (data) => {
    const iconCode = data.weather[0].icon;
    let iconClass = '';
  
    switch (iconCode) {
      case '01d':
        iconClass = 'wi-day-sunny';
        break;
      case '01n':
        iconClass = 'wi-night-clear';
        break;
      case '02d':
        iconClass = 'wi-day-cloudy';
        break;
      case '02n':
        iconClass = 'wi-night-alt-cloudy';
        break;
      case '03d':
      case '03n':
        iconClass = 'wi-cloud';
        break;
      case '04d':
      case '04n':
        iconClass = 'wi-cloudy';
        break;
      case '09d':
      case '09n':
        iconClass = 'wi-showers';
        break;
      case '10d':
        iconClass = 'wi-day-rain';
        break;
      case '10n':
        iconClass = 'wi-night-rain';
        break;
      case '11d':
      case '11n':
        iconClass = 'wi-thunderstorm';
        break;
      case '13d':
      case '13n':
        iconClass = 'wi-snow';
        break;
      case '50d':
      case '50n':
        iconClass = 'wi-fog';
        break;
      default:
        iconClass = 'wi-na'; // Not available
        break;
    }
  
    return {
      date: new Date(data.dt * 1000),
      temperature: data.main.temp,
      icon: iconClass, // Use the icon class for Weather Icons
    };
  };;

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    currentWeather: null,
    forecast: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentWeather = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchForecast.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.forecast = action.payload;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
