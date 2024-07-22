import UIController from './UIController';
import weatherDataMock from './weatherDataMock';
import WeatherConditions from './WeatherConditions';

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

function getWeatherData(apiKey) {
  const KEY = apiKey;
  const loadingModal = UIController.loadingModal;
  let weatherDataJSON;

  return async function (location) {
    // If no location provided use test weather object (TEMP)
    if (!location) {
      weatherDataJSON = weatherObjectTest;
    } else {
      try {
        // Fetch weather data with provided location
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${KEY}&contentType=json`;

        // Open loading dialog while fetching url
        if (loadingModal) {
          try {
            loadingModal.show();
          } catch (err) {
            console.error(err);
          }
        }

        const weatherData = await fetch(url);

        // Handle 400 error
        if (weatherData.status === 400) {
          throw new Error('Invalid request!');
        }

        // Format weather data
        weatherDataJSON = await weatherData.json();

        // Close loading dialog when data has been fetched
        if (loadingModal) {
          try {
            loadingModal.close();
          } catch (err) {
            console.error(err);
          }
        }
      } catch (err) {
        console.error(err);

        // Show error message in Loading Dialog
        if (loadingModal) {
          try {
            loadingModal.error();
          } catch (err) {
            console.error(err);
          }
        }

        throw error; // Reject promise
      }
    }

    return weatherDataJSON;
  };
}

export default WeatherForecaster;
