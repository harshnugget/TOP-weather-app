import weatherImages from './weatherImages';
import dateFormatting from './dateFormatting';

const UIController = (function () {
  // Create a timer for checking and updating background image
  let timer = null;

  const loadingModal = {
    modalContent: document.querySelector('#loadingModal > .modal-content'),

    show: function () {
      this.modalContent.style.visibility = 'visible'; // Show the modal
      this.modalContent.querySelector('p').textContent = 'Loading...';
    },

    error: function (error) {
      this.modalContent.querySelector('p').textContent = 'Could not fetch data';
      console.warn(error);
    },

    close: function () {
      this.modalContent.style.visibility = 'hidden'; // Hide the modal
    },
  };

  const changeBackgroundImage = (function () {
    const container = document.querySelector('.container');
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

      container.append(imgElement);

      function fadeOutBackgroundImg() {
        if (currentImgElement) {
          // Set flag to prevent repeat transitions
          transitionFlag = 1;

          // Set current background image on top to allow for fade out effect
          currentImgElement.style.zIndex = '-1';

          // Add the fade-out transition styles
          currentImgElement.style.transition = 'opacity 1s ease';
          currentImgElement.style.opacity = '0';

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

  const updateHoursForecast = (hourlyForecasts) => {
    const numberOfHours = hourlyForecasts.length;
    const scrollBar = document.querySelector('.scrolling-bar');
    scrollBar.innerHTML = '';

    const extractTime = (timeString) => {
      const parts = timeString.split(':');
      return `${parts[0]}:${parts[1]}`;
    };

    for (let i = 0; i < numberOfHours; i++) {
      const container = document.createElement('div');
      const imgElement = document.createElement('img');
      const infoContainer = document.createElement('div');
      const hourElement = document.createElement('h4');
      const tempElement = document.createElement('h4');

      container.classList.add('hour-container');
      infoContainer.classList.add('info-container');

      hourElement.textContent = extractTime(hourlyForecasts[i].datetime);
      const temp = Math.floor(hourlyForecasts[i].temperature);
      tempElement.innerHTML = `${temp}&deg;C`;

      const icon = weatherImages(hourlyForecasts[i].icon).staticIcon;
      imgElement.setAttribute('src', icon);

      infoContainer.append(hourElement, tempElement);
      container.append(infoContainer, imgElement);
      scrollBar.append(container);
    }
  };

  const update = (function () {
    const todayContainer = document.querySelector('#today-weather');
    const dateElement = todayContainer.querySelector('.date');
    const todayConditions = todayContainer.querySelector('.conditions');
    const todayTemperature = todayContainer.querySelector('.temperature');

    return function (day) {
      updateHoursForecast(day.hourlyForecasts);

      // Reformat the date
      dateElement.textContent = dateFormatting(day.datetime);

      const backgroundImgElement = document.querySelector('.background-img');

      // Update background image instantly if there isn't one
      if (!backgroundImgElement) {
        changeBackgroundImage(weatherImages(day.icon).bg);
      } else {
        // Set a timer to update background image after a set period of time
        clearTimeout(timer);
        timer = setTimeout(() => {
          changeBackgroundImage(weatherImages(day.icon).bg);
        }, 1000);
      }

      // Update weather conditions
      todayConditions.textContent = day.conditions;
      todayTemperature.innerHTML = `${day.temperature}&deg;C`;
    };
  })();

  return { update, loadingModal };
})();

export default UIController;
