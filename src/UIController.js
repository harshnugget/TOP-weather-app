import weatherImages from './weatherImages';

const UIController = (function () {
  const main = document.querySelector('main');

  // Create a timer for checking and updating background image
  let timer = null;

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

  const formatDate = (date) => {
    let dateObj = new Date(date);

    // Validate
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Incorrect date format: ${date}`);
    }

    // Convert the date to UTC
    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();
    dateObj = new Date(Date.UTC(year, monthIndex, day));

    // Get today's date in UTC
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

    // Check if the input date is equal to today's date
    if (dateObj.getTime() === todayUTC.getTime()) {
      return 'Today';
    }

    // Define the formatting options
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };

    // Format the dateObj using the options defined
    const formattedDate = new Intl.DateTimeFormat('en-UK', options).format(dateObj);

    return formattedDate;
  };

  const update = (function () {
    const todayContainer = document.querySelector('#today-weather');
    const dateElement = todayContainer.querySelector('.date');
    const todayConditions = todayContainer.querySelector('.conditions');
    const todayTemperature = todayContainer.querySelector('.temperature');

    return function (icon, condition, temp, date) {
      dateElement.textContent = formatDate(date);

      const backgroundImgElement = document.querySelector('.background-img');

      // Update background image instantly if there isn't one
      if (!backgroundImgElement) {
        changeBackgroundImage(weatherImages(icon).bg);
      } else {
        // Set a timer to update background image after a set period of time
        clearTimeout(timer);
        timer = setTimeout(() => {
          changeBackgroundImage(weatherImages(icon).bg);
        }, 1000);
      }

      // Update weather conditions
      todayConditions.textContent = condition;
      todayTemperature.textContent = temp;
    };
  })();

  return { update };
})();

export default UIController;
