import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number;
}

interface ForecastData {
  date: string;
  highTemperature: number;
  lowTemperature: number;
  condition: string;
}

interface forecastDayDescription {
  description: string
  icon: string
  id: number
  main: string
}

interface forecastDay {
  dt_txt: string;
  main: {
    temp_max: number,
    temp_min: number
  };
  weather: forecastDayDescription[];
}

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  const fetchCoordinates = async () => {
    try {
      const locationIQEndpoint = `https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${city}&format=json`;
      const locationIQResponse = await axios.get(locationIQEndpoint);

      // Extract coordinates from the LocationIQ API response
      const { lat, lon } = locationIQResponse.data[0];

      return { lat, lon };
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  const fetchWeatherData = async () => {
    try {
      const coordinates = await fetchCoordinates();

      if (coordinates) {
      const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${unit}&appid=${process.env.REACT_APP_ID}`;
      const forecastEndpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=${unit}&appid=${process.env.REACT_APP_ID}`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(weatherEndpoint),
        axios.get(forecastEndpoint),
      ]);

      const { main, weather, wind } = weatherResponse.data;
      setWeatherData({
        temperature: main.temp,
        condition: weather[0].description,
        windSpeed: wind.speed,
        humidity: main.humidity,
      });

      const formattedForecastData = forecastResponse.data.list.reduce(
        (acc: ForecastData[], forecastDayData: forecastDay) => {
          const date = forecastDayData.dt_txt.split(' ')[0];
          const highTemperature = forecastDayData.main.temp_max;
          const lowTemperature = forecastDayData.main.temp_min;
          const condition = forecastDayData.weather[0].description;

          if (!acc.some((day) => day.date === date)) {
            acc.push({ date, highTemperature, lowTemperature, condition });
          }

          return acc;
        },
        []
      );

      setForecastData(formattedForecastData);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
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
            const locationIQEndpoint = `https://us1.locationiq.com/v1/reverse.php?key=${process.env.REACT_APP_WEATHER_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`;
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
  }, [city, unit]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter City:
          <input type="text" value={city} onChange={handleInputChange} />
        </label>
        <button type="submit">Search</button>
      </form>

      <button onClick={toggleUnit}>
        {unit === 'metric' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
      </button>

      {weatherData && (
        <div>
          <h2>Weather in {city}</h2>
          <p>Temperature: {weatherData.temperature}&deg;{unit === 'metric' ? 'C' : 'F'}</p>
          <p>Condition: {weatherData.condition}</p>
          <p>Wind Speed: {weatherData.windSpeed} {unit === 'metric' ? 'meter/sec' : 'miles/hour'}</p>
          <p>Humidity: {weatherData.humidity}%</p>
        </div>
      )}

      {forecastData.length > 0 && (
        <div>
          <h2>5-Day Forecast</h2>
          {forecastData.map((day) => (
            <div key={day.date}>
              <p>Date: {day.date}</p>
              <p>High: {day.highTemperature}&deg;{unit === 'metric' ? 'C' : 'F'}</p>
              <p>Low: {day.lowTemperature}&deg;{unit === 'metric' ? 'C' : 'F'}</p>
              <p>Condition: {day.condition}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Weather;
