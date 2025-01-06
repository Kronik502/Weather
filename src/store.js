import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './redux/weatherslice';

const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});

export default store;
