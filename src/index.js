import './style.css';

const KEY = '8LS8VNK8Q95T49ELEPT3AUNV5';

const locationInput = document.querySelector('#location-input');
const getWeatherBtn = document.querySelector('#get-weather-btn');

getWeatherBtn.addEventListener('click', () => {
  const location = locationInput.value;
  if (!location) {
    return;
  }
  const weatherData = getWeatherData(formatLocation(location));
  handleWeatherData(weatherData);
});

function formatLocation(text) {
  return encodeURIComponent(text);
}

async function getWeatherData(location) {
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${KEY}&contentType=json`;
    const weatherData = await fetch(url);
    const weatherJSON = await weatherData.json();
    return weatherJSON;
  } catch (error) {
    console.error(error);
  }
}

function handleWeatherData(data) {
  data.then((weather) => {
    const { days } = weather;
    const { conditions, temp } = days[0];

    if (days && conditions && temp) {
      updateTodayUI(conditions, temp);
    }
  });
  data.catch((error) => {
    console.error(error);
  });
}

function updateTodayUI(conditions, temp) {
  const todayContainer = document.querySelector('#today-weather');
  const todayConditions = todayContainer.querySelector('.conditions');
  const todayTemperature = todayContainer.querySelector('.temperature');

  todayConditions.textContent = conditions;
  todayTemperature.textContent = temp;
}
