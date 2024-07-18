import clearSkyBg from './images/wallpapers/sunny.png';
import partlyCloudyBg from './images/wallpapers/partly_cloudy.png';
import rainBg from './images/wallpapers/rainy.png';
import stormBg from './images/wallpapers/stormy.png';
import snowBg from './images/wallpapers/snowy.png';
import cloudyBg from './images/wallpapers/cloudy.png';
import loadWeatherIcons from './weatherIcons';

const UIController = (function () {
  const main = document.querySelector('main');

  function changeBackgroundImage(url) {
    // Select the current background image element
    const currentImgElement = document.querySelector('.background-img');

    // Create a new <img> element for the new background image
    const imgElement = document.createElement('img');
    imgElement.src = url;
    imgElement.classList.add('background-img');
    imgElement.style.position = 'absolute'; // Fixed position to stay in the background
    imgElement.style.top = '0';
    imgElement.style.left = '0';
    imgElement.style.width = '100%';
    imgElement.style.height = '100%';
    imgElement.style.objectFit = 'cover';
    imgElement.style.zIndex = '-1'; // Set a negative z-index to appear behind all other content

    // Add mask-image for fading out edges
    imgElement.style.maskImage =
      'linear-gradient(to right, transparent, black 50%, black 50%, transparent)';

    main.append(imgElement);

    // Remove previous image element
    if (currentImgElement) {
      currentImgElement.remove();
    }
  }

  async function update(icon, condition, temp) {
    const todayContainer = document.querySelector('#today-weather');
    const todayConditions = todayContainer.querySelector('.conditions');
    const todayTemperature = todayContainer.querySelector('.temperature');
    const weatherImgContainer = todayContainer.querySelector('.weather-img-container');

    let weatherIcon;

    // Retrieve weather icons object
    const weatherIcons = await loadWeatherIcons();

    // FIX ME
    // Change condition to look for icon instead
    switch (icon.toLowerCase()) {
      case 'rainy':
        changeBackgroundImage(rainBg);
        weatherIcon = weatherIcons.rainy;
        break;
      case 'cloudy':
        changeBackgroundImage(cloudyBg);
        weatherIcon = weatherIcons.cloudy;
        break;
      case 'partially cloudy':
        changeBackgroundImage(partlyCloudyBg);
        weatherIcon = weatherIcons.partlyCloudy;
        break;
      case 'stormy':
        changeBackgroundImage(stormBg);
        weatherIcon = weatherIcons.stormy;
        break;
      case 'snowy':
        changeBackgroundImage(snowBg);
        weatherIcon = weatherIcons.snowy;
        break;
      default:
        changeBackgroundImage(clearSkyBg);
        weatherIcon = weatherIcons.clear;
    }

    weatherImgContainer.innerHTML = weatherIcon;
    todayConditions.textContent = condition;
    todayTemperature.textContent = temp;
  }

  return { update };
})();

export default UIController;
