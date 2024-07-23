import WeatherConditions from './WeatherConditions';
import weatherDataMock from './weatherDataMock';

class WeatherForecaster {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.location = null;
    this.dailyForecasts = [];
    this.weatherDataMock = weatherDataMock;

    // Class for creating daily forecasts
    this.WeatherConditions = WeatherConditions;
  }

  // Use fetch request to retrieve weather data
  getWeatherData = async function (location) {
    const apiKey = this.apiKey;

    try {
      if (!location) {
        if (this.weatherDataMock) {
          this.data = this.weatherDataMock;
          console.warn('No location provided. Using mock weather data object.');
        } else {
          throw new Error(`No location provided. Could not resolve weatherDataMock`);
        }
      } else {
        // Fetch weather data with provided location
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=${apiKey}&contentType=json`;
        const weatherData = await fetch(url);

        // Handle 400 error
        if (weatherData.status === 400) {
          throw new Error('Invalid request!');
        }

        // Format weather data
        this.data = await weatherData.json();
      }
    } catch (error) {
      throw error; // Reject promise
    }

    // Set location
    this.location = this.data.resolvedAddress;

    // Handle daily forecast data
    this.processForecasts(this.data.days);

    return this;
  };

  // Create day and hour weather condition objects
  processForecasts(array) {
    // Function to create a weather conditions object with provided data
    const setWeatherConditions = (weatherData) => {
      return new this.WeatherConditions({
        datetime: weatherData.datetime,
        temperature: weatherData.temp,
        precipitation: weatherData.precip,
        windspeed: weatherData.windspeed,
        conditions: weatherData.conditions,
        icon: weatherData.icon,
      });
    };

    // Map days to daily forecasts
    this.dailyForecasts = array.map((day) => {
      // Create a weather condition object for each hour
      const hourlyForecasts = (day.hours || []).map((hour) => {
        return setWeatherConditions(hour);
      });

      // Create a weather condition object for the day
      const dayForecast = setWeatherConditions(day);

      // Add hourly forecasts array to this day object
      dayForecast.hourlyForecasts = hourlyForecasts;

      return dayForecast;
    });
  }
}

export default WeatherForecaster;
