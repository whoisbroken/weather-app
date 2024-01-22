export interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number;
  feels_like: number;
}

export interface ForecastData {
  date: string;
  temp: number;
  condition: string;
}

export interface forecastDayDescription {
  description: string;
  icon: string;
  id: number;
  main: string;
}

export interface forecastDay {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: forecastDayDescription[];
}
