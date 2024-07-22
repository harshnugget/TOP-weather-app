import './style.css';
import UIController from './UIController';
import weatherCarousel from './weatherCarousel';
import WeatherForecaster from './WeatherForecaster';

const API_KEY = '8LS8VNK8Q95T49ELEPT3AUNV5';

window.onload = () => {
  const weatherForecaster = new WeatherForecaster(API_KEY);
  const weather = {
    get location() {
      return weatherForecaster.location;
    },
    get days() {
      return weatherForecaster.dailyForecasts;
    },
  };
  window.weather = weather; // For testing

  function getWeatherForecast(location) {
    const loadingModule = UIController.loadingModal;

    let weatherPromise;
    weatherPromise = weatherForecaster.getWeatherData(location);

    // Show loading module while fetching weather data
    loadingModule.show();

    // Handle actions after weather data is fetched
    weatherPromise
      .then((data) => {
        // Show body contents after data is fetched
        loadingModule.close();
        updateUI();
      })
      .catch((error) => {
        loadingModule.error(error);
      });
  }

  function updateUI() {
    // Initialize to day 0
    UIController.update(weather.days[0]);

    const carousel = weatherCarousel(weather.days);
    const leftBtn = carousel.elements.leftBtn;
    const rightBtn = carousel.elements.rightBtn;

    const getCarouselIndex = () => {
      const index = carousel.getIndexData().index;
      return index;
    };

    leftBtn.addEventListener('click', () => {
      const index = getCarouselIndex();
      console.log();
      UIController.update(weather.days[index]);
    });

    rightBtn.addEventListener('click', () => {
      const index = getCarouselIndex();
      UIController.update(weather.days[index]);
    });
  }

  getWeatherForecast();

  const locationInput = document.querySelector('#location-input');
  const getWeatherBtn = document.querySelector('#get-weather-btn');

  getWeatherBtn.addEventListener('click', () => {
    // Retrieve value from the location input box
    const location = locationInput.value;
    if (!location) {
      return;
    }
    getWeatherForecast(location);
  });
};
