🌤️ Weather App with User Location Support
This Weather App is a ReactJS-based project that fetches and displays current weather conditions for the user's location. It uses the browser's Geolocation API to get the user's coordinates and provides an intuitive interface with support for temperature conversion (Celsius/Fahrenheit).

🚀 Features
Automatic Location Detection: Automatically fetches the user's current location.
Weather Display: Shows weather details like temperature, date, and a weather icon.
Unit Conversion: Toggle between Celsius and Fahrenheit.
Error Handling: Fallback to a default location (e.g., Johannesburg) if location access is denied.
Responsive Design: Adapts seamlessly to various screen sizes.
Custom Icons: Displays relevant weather icons using FontAwesome.
🛠️ Technologies Used
Frontend: ReactJS, FontAwesome
State Management: Redux Toolkit
APIs:
OpenWeatherMap or a similar weather API
Browser's Geolocation API
⚙️ Setup and Installation
Prerequisites
Node.js installed on your system.
A weather API key from OpenWeatherMap.
Steps
Clone this repository:

bash

git clone https://github.com/your-username/weather-app.git
cd weather-app
Install dependencies:

bash

npm install
Create a .env file in the project root and add your API key:

makefile

REACT_APP_WEATHER_API_KEY=your_api_key_here
Start the development server:

bash

npm start
Visit the app in your browser at http://localhost:3000.