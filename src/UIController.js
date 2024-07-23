import weatherImages from './weatherImages';
import dateFormatting from './dateFormatting';

const UIController = (function () {
  const loadingDialogBox = {
    modalContent: document.querySelector('#loadingDialogBox > .modal-content'),

    show: function () {
      this.modalContent.style.visibility = 'visible'; // Show the dialog box
      this.modalContent.querySelector('p').textContent = 'Loading...';
    },

    error: function (error) {
      this.modalContent.querySelector('p').textContent = 'Could not fetch data';
      console.warn(error);
    },

    close: function () {
      this.modalContent.style.visibility = 'hidden'; // Hide the dialog box
    },
  };

  const changeBackgroundImage = (function () {
    let currentUrl = null;
    let timeoutId = null;
    let nextUrl = null;

    // Set body styles
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.transition = 'background-image 1s ease-in-out';

    function updateBackground() {
      if (nextUrl !== null && nextUrl !== currentUrl) {
        currentUrl = nextUrl;
        document.body.style.backgroundImage = `url(${currentUrl})`;
        nextUrl = null;
      }
    }

    return function (url) {
      nextUrl = url;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Update background image instantly if there isn't one
      if (!document.body.style.backgroundImage) {
        updateBackground();
      }

      // Use a timeout to prevent changing background mid-transition
      timeoutId = setTimeout(() => {
        updateBackground();
        timeoutId = null;
      }, 1000); // Adjust the delay as needed
    };
  })();

  const updateHoursForecast = (() => {
    const scrollBar = document.querySelector('.scrolling-bar');

    // Create a clone of the hour container template element
    const hourContainer = scrollBar.querySelector('.hour-container');

    return function (hourlyForecasts) {
      const numberOfHours = hourlyForecasts.length;
      scrollBar.innerHTML = '';

      const extractTime = (timeString) => {
        const parts = timeString.split(':');
        return `${parts[0]}:${parts[1]}`;
      };

      // Build containers for displaying each hour forecast
      for (let i = 0; i < numberOfHours; i++) {
        const container = hourContainer.cloneNode(true);
        const hourElement = container.querySelector('.hour');
        const tempElement = container.querySelector('.temperature');
        const imgElement = container.querySelector('img');

        const hour = extractTime(hourlyForecasts[i].datetime);
        const temp = Math.floor(hourlyForecasts[i].temperature);
        const icon = weatherImages(hourlyForecasts[i].icon).staticIcon;

        hourElement.textContent = `${hour}`;
        tempElement.innerHTML = `${temp}&deg;C`;
        imgElement.setAttribute('src', icon);

        scrollBar.append(container);
      }
    };
  })();

  const update = (function () {
    const todayContainer = document.querySelector('#today-weather');
    const dateElement = todayContainer.querySelector('.date');
    const todayConditions = todayContainer.querySelector('.conditions');
    const todayTemperature = todayContainer.querySelector('.temperature');

    return function (day) {
      updateHoursForecast(day.hourlyForecasts);

      // Reformat the date
      dateElement.textContent = dateFormatting(day.datetime);

      changeBackgroundImage(weatherImages(day.icon).bg);

      // Update weather conditions
      todayConditions.textContent = day.conditions;
      todayTemperature.innerHTML = `${day.temperature}&deg;C`;
    };
  })();

  return { update, loadingDialogBox };
})();

export default UIController;
