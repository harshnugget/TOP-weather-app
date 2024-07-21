import './style.css';
import UIController from './UIController';
import weatherObjectTest from './weatherObjectTest';
import weatherCarousel from './weatherCarousel';

const KEY = '8LS8VNK8Q95T49ELEPT3AUNV5';

const locationInput = document.querySelector('#location-input');
const getWeatherBtn = document.querySelector('#get-weather-btn');
const modalContent = document.querySelector('#loadingModal > .modal-content');

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
    handleWeatherData(weatherData);
  });

  // Format the value to be compatible in URL
  function formatLocation(text) {
    return encodeURIComponent(text);
  }

  // Function to show loading modal
  function showLoadingDialog() {
    modalContent.style.visibility = 'visible'; // Show the modal as a flexbox
    modalContent.querySelector('p').textContent = 'Loading...';
  }

  // Function to close loading modal
  function closeLoadingModal() {
    modalContent.style.visibility = 'hidden'; // Hide the modal
  }

  async function getWeatherData(location) {
    let weatherJSON;
    // If no location provided use test weather object
    if (!location) {
      weatherJSON = weatherObjectTest;
    } else {
      try {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${KEY}&contentType=json`;
        const weatherData = await fetch(url);

        // Open loading dialog while fetching url
        showLoadingDialog();

        if (weatherData.status === 400) {
          throw new Error('Invalid request!');
        }
        weatherJSON = await weatherData.json();

        // Close loading dialog
        closeLoadingModal();
      } catch (error) {
        console.error(error);
        modal.querySelector('p').textContent = 'Could not retrieve data';
        throw error; // Reject promise
      }
    }

    window.weatherJSON = weatherJSON; // For testing

    weatherCarousel(weatherJSON.days);
    return weatherJSON;
  }

  function handleWeatherData(dataPromise) {
    dataPromise
      .then((weather) => {
        const location = document.querySelector('#location');
        location.textContent = weather.resolvedAddress;

        // Close loading dialog here
        const { days } = weather;

        if (days) {
          updateUI(days[0]);
        }
      })
      .catch((error) => {
        console.log(error);
        updateUI('Error fetching data', 'N/A');
      });
  }

  function updateUI(day) {
    UIController.update(day);
  }

  // Initialize
  const weatherData = getWeatherData();
  handleWeatherData(weatherData);

  // TESTING
  window.weather = (weather) => {
    weatherObjectTest.days[0].icon = weather;
    const weatherData = getWeatherData();
    handleWeatherData(weatherData);
  };
};

// #########################################################################
