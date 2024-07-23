import './style.css';
import UIController from './UIController';
import weatherCarousel from './weatherCarousel';
import WeatherForecaster from './WeatherForecaster';

const API_KEY = '8LS8VNK8Q95T49ELEPT3AUNV5';

window.onload = () => {
  const weatherForecaster = new WeatherForecaster(API_KEY);
  window.weather = weatherForecaster; // For testing

  function getWeatherForecast(location) {
    const loadingDialogBox = UIController.loadingDialogBox;

    let weatherPromise;
    weatherPromise = weatherForecaster.getWeatherData(location);

    // Show loading module while fetching weather data
    loadingDialogBox.show();

    // Handle actions after weather data is fetched
    weatherPromise
      .then((data) => {
        loadingDialogBox.close();
        updateUI();
      })
      .catch((error) => {
        loadingDialogBox.error(error);
      });
  }

  function updateUI() {
    // Initialize to day 0
    UIController.update(weatherForecaster.dailyForecasts[0]);

    // Update location
    document.querySelector('#location').textContent = weatherForecaster.location;

    const carousel = weatherCarousel(weatherForecaster.dailyForecasts);
    const leftBtn = carousel.elements.leftBtn;
    const rightBtn = carousel.elements.rightBtn;

    const getCarouselIndex = () => {
      const index = carousel.getIndexData().index;
      return index;
    };

    leftBtn.addEventListener('click', () => {
      const index = getCarouselIndex();
      UIController.update(weatherForecaster.dailyForecasts[index]);
    });

    rightBtn.addEventListener('click', () => {
      const index = getCarouselIndex();
      UIController.update(weatherForecaster.dailyForecasts[index]);
    });
  }

  getWeatherForecast();

  const locationInput = document.querySelector('#location-input');
  const getWeatherBtn = document.querySelector('#get-weather-btn');

  locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      // Retrieve value from the location input box
      const location = locationInput.value;
      if (!location) {
        return;
      }
      getWeatherForecast(location);
    }
  });

  getWeatherBtn.addEventListener('click', () => {
    // Retrieve value from the location input box
    const location = locationInput.value;
    if (!location) {
      return;
    }
    getWeatherForecast(location);
  });
};
