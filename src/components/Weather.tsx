import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number;
}

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>('');

  const fetchWeatherData = async () => {
    try {
      const apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4b14cb9940b8928413081f6e1f4c6f8e`;
      const response = await axios.get(apiEndpoint);

      const { main, weather, wind } = response.data;
      setWeatherData({
        temperature: main.temp,
        condition: weather[0].description,
        windSpeed: wind.speed,
        humidity: main.humidity,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchWeatherData();
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const locationIQEndpoint = `https://us1.locationiq.com/v1/reverse.php?key=pk.044356cb5b706b9a01a631e949d2544b&lat=${latitude}&lon=${longitude}&format=json`;
            const locationIQResponse = await axios.get(locationIQEndpoint);

            setCity(locationIQResponse.data.address.city || '');
          } catch (error) {
            console.error('Error fetching location name:', error);
          }
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (city) {
      fetchWeatherData();
    }
  }, [city]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter City:
          <input type="text" value={city} onChange={handleInputChange} />
        </label>
        <button type="submit">Search</button>
      </form>

      {weatherData && (
        <div>
          <h2>Weather in {city}</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Condition: {weatherData.condition}</p>
          <p>Wind Speed: {weatherData.windSpeed} m/s</p>
          <p>Humidity: {weatherData.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
