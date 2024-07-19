import './style.css';
import UIController from './UIController';
import weatherObjectTest from './weatherObjectTest';

const KEY = '8LS8VNK8Q95T49ELEPT3AUNV5';

const locationInput = document.querySelector('#location-input');
const getWeatherBtn = document.querySelector('#get-weather-btn');

window.onload = () => {
  // Show body contents after css is loaded
  document.body.style.opacity = 1;

  getWeatherBtn.addEventListener('click', () => {
    // Retrieve value from the location input box
    const location = locationInput.value;
    if (!location) {
      return;
    }
    const weatherData = getWeatherData(formatLocation(location));
    console.log(weatherData);
    handleWeatherData(weatherData);
  });

  // Format the value to be compatible in URL
  function formatLocation(text) {
    return encodeURIComponent(text);
  }

  async function getWeatherData(location) {
    if (!location) {
      return weatherObjectTest;
    }
    try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${KEY}&contentType=json`;
      const weatherData = await fetch(url);
      if (weatherData.status === 400) {
        throw new Error('Invalid request!');
      }
      const weatherJSON = await weatherData.json();
      return weatherJSON;
    } catch (error) {
      console.error(error);
      throw error; // Reject promise
    }
  }

  function handleWeatherData(dataPromise) {
    dataPromise
      .then((weather) => {
        const { days } = weather;
        const { icon, conditions, temp } = days[0];

        if (icon && conditions && temp) {
          updateTodayUI(icon, conditions, temp);
        }
      })
      .catch((error) => {
        console.log(error);
        updateTodayUI('Error fetching data', 'N/A');
      });
  }

  function updateTodayUI(icon, conditions, temp) {
    const condition = extractBeforeComma(conditions);
    UIController.update(icon, condition, temp);
  }

  function extractBeforeComma(inputString) {
    const commaIndex = inputString.indexOf(',');
    if (commaIndex === -1) {
      // If there's no comma, return the whole string
      return inputString;
    }
    return inputString.substring(0, commaIndex);
  }

  // Initialize
  const weatherData = getWeatherData();
  console.log(weatherData);
  handleWeatherData(weatherData);

  // TESTING
  window.weather = (weather) => {
    weatherObjectTest.days[0].icon = weather;
    const weatherData = getWeatherData();
    handleWeatherData(weatherData);
  };
};

// #########################################################################
