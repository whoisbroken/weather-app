import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FormContainer,
  SearchInput,
  Wrapper,
  Text,
  RotatedText,
  MainContainer,
  SecondaryContainer,
  Button,
  ToggleButton,
} from "./Weather.styles";
import { ForecastData, WeatherData, forecastDay } from "../types/Weather.types";

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  const fetchCoordinates = async () => {
    try {
      const locationIQEndpoint = `https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${city}&format=json`;
      const locationIQResponse = await axios.get(locationIQEndpoint);

      // Extract coordinates from the LocationIQ API response
      const { lat, lon } = locationIQResponse.data[0];

      return { lat, lon };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
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
          feels_like: main.feels_like,
        });

        const formattedForecastData = forecastResponse.data.list.reduce(
          (acc: ForecastData[], forecastDayData: forecastDay) => {
            const date = forecastDayData.dt_txt.split(" ")[0];
            const temp = forecastDayData.main.temp;
            const condition = forecastDayData.weather[0].description;

            if (!acc.some((day) => day.date === date)) {
              acc.push({ date, temp, condition });
            }

            return acc;
          },
          []
        );

        setForecastData(formattedForecastData);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchWeatherData();
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const locationIQEndpoint = `https://us1.locationiq.com/v1/reverse.php?key=${process.env.REACT_APP_WEATHER_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`;
            const locationIQResponse = await axios.get(locationIQEndpoint);

            setCity(locationIQResponse.data.address.city || "");
          } catch (error) {
            console.error("Error fetching location name:", error);
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
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
    <Wrapper>
      <FormContainer onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Enter Location"
        />
        <Button type="submit">Search</Button>
        <ToggleButton onClick={toggleUnit} type="checkbox" />
      </FormContainer>

      {weatherData && (
        <MainContainer>
          <h2>{city}</h2>
          <Text>
            {weatherData.temperature}&deg;{unit === "metric" ? "C" : "F"}
          </Text>
          <RotatedText>{weatherData.condition}</RotatedText>
          <SecondaryContainer>
            <div>
              <Text>
                {weatherData.feels_like}&deg;{unit === "metric" ? "C" : "F"}
              </Text>
              <p>Feels Like</p>
            </div>
            <div>
              <Text>{weatherData.humidity}%</Text>
              <p>Humidity</p>
            </div>
            <div>
              <Text>
                {weatherData.windSpeed}{" "}
                {unit === "metric" ? "meter/sec" : "miles/hour"}
              </Text>
              <p>Wind Speed</p>
            </div>
          </SecondaryContainer>

          <h2>5-Day Forecast</h2>
          {forecastData.length > 0 && (
            <SecondaryContainer>
              {forecastData.map((day) => (
                <div key={day.date}>
                  <div>
                    <Text>{day.date}</Text>
                  </div>
                  <div>
                    <Text>
                      {day.temp}&deg;
                      {unit === "metric" ? "C" : "F"}
                    </Text>
                  </div>
                  <div>
                    <Text>{day.condition}</Text>
                  </div>
                </div>
              ))}
            </SecondaryContainer>
          )}
        </MainContainer>
      )}
    </Wrapper>
  );
};

export default Weather;
