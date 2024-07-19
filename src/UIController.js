import clearSkyBg from './images/wallpapers/sunny.png';
import partlyCloudyBg from './images/wallpapers/partly_cloudy.png';
import rainBg from './images/wallpapers/rainy.png';
import stormBg from './images/wallpapers/stormy.png';
import snowBg from './images/wallpapers/snowy.png';
import cloudyBg from './images/wallpapers/cloudy.png';
import loadWeatherIcons from './weatherIcons';

const UIController = (function () {
  const main = document.querySelector('main');

  const changeBackgroundImage = (function () {
    let transitionFlag = 0;
    let queuedBackgroundImgURL = null;

    return function (url) {
      queuedBackgroundImgURL = url;

      // Prevent repeat transitioning
      if (transitionFlag === 1) {
        return;
      }

      /* Select all background image elements
      This is to allow for clean up if duplicates are accidentally created */
      const currentImgElements = document.querySelectorAll('.background-img');

      // Select the most recently added current image element
      const currentImgElement = currentImgElements[currentImgElements.length - 1];

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
      imgElement.style.zIndex = '-2'; // Set a negative z-index to appear behind all other content

      main.append(imgElement);

      function fadeOutBackgroundImg() {
        if (currentImgElement) {
          // Set flag to prevent repeat transitions
          transitionFlag = 1;

          // Set current background image on top to allow for fade out effect
          currentImgElement.style.zIndex = '-1';

          // Add the fade-out class to start the transition
          currentImgElement.classList.add('fade-out');

          // Add an event listener for the transition end event
          currentImgElement.addEventListener('transitionend', function handleTransitionEnd(event) {
            // Ensure this event is for the opacity transition
            if (event.propertyName === 'opacity') {
              // Remove the background image elements
              currentImgElements.forEach((element) => element.remove());

              // Check if imgelement doesn't match the queued img
              if (imgElement.src !== queuedBackgroundImgURL && transitionFlag === 1) {
                // Reset flag to allow next transition
                transitionFlag = 0;

                // Transition to queued img
                changeBackgroundImage(queuedBackgroundImgURL);
              }

              transitionFlag = 0;
            }
          });
        }
      }

      // Call the function to start the fade transition
      fadeOutBackgroundImg();
    };
  })();

  const update = (function () {
    const todayContainer = document.querySelector('#today-weather');
    const todayConditions = todayContainer.querySelector('.conditions');
    const todayTemperature = todayContainer.querySelector('.temperature');
    const weatherImgContainer = todayContainer.querySelector('.weather-img-container');
    let weatherIcon;

    return async function (icon, condition, temp) {
      // Retrieve weather icons object
      const weatherIcons = await loadWeatherIcons();

      // Set weather icon and change background image
      switch (icon.toLowerCase()) {
        case 'rainy':
          weatherIcon = weatherIcons.rainy;
          changeBackgroundImage(rainBg);
          break;
        case 'cloudy':
          weatherIcon = weatherIcons.cloudy;
          changeBackgroundImage(cloudyBg);
          break;
        case 'partly-cloudy-day':
          weatherIcon = weatherIcons.partlyCloudy;
          changeBackgroundImage(partlyCloudyBg);
          break;
        case 'stormy':
          weatherIcon = weatherIcons.stormy;
          changeBackgroundImage(stormBg);
          break;
        case 'snowy':
          weatherIcon = weatherIcons.snowy;
          changeBackgroundImage(snowBg);
          break;
        default:
          weatherIcon = weatherIcons.clear;
          changeBackgroundImage(clearSkyBg);
      }

      weatherImgContainer.innerHTML = weatherIcon;
      todayConditions.textContent = condition;
      todayTemperature.textContent = temp;
    };
  })();

  return { update };
})();

export default UIController;
