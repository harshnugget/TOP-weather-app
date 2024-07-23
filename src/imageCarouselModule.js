const imageCarouselModule = (() => {
  const MAXLENGTH = 15; // Maximum number of images

  let xPos = 0; // For tracking position of carousel
  let timer = null; // Timer for shifting carousel

  class ImageCarousel {
    constructor(imageSources = [], carouselContainer) {
      this.imageSources = imageSources;
      this.elements = {
        container: null,
        content: null,
        rightBtn: null,
        leftBtn: null,
      };
      this.buildCarouselStructure(carouselContainer);
      this.initializeCarousel();
    }

    validateImages() {
      // Validate array length
      if (this.imageSources.length > MAXLENGTH) {
        console.warn(
          `imageSources array exceeds limit of ${MAXLENGTH}. Only the first ${MAXLENGTH} images will be used.`
        );
        this.imageSources = this.imageSources.slice(0, MAXLENGTH); // Use only the first [MAXLENGTH] images in the array
      }
    }

    // Return the index and element of the visible image in the carousel
    getIndexData() {
      const index = xPos / this.elements.container.offsetWidth;
      const element = this.elements.content.querySelectorAll('img')[index];
      return { index, element };
    }

    buildCarouselStructure(container) {
      // Validate images
      this.validateImages();

      // Clear container
      container.textContent = null;

      // Create elements
      const contentWrapper = document.createElement('div');
      const content = document.createElement('div');
      const rightBtn = document.createElement('button');
      const leftBtn = document.createElement('button');

      // Add classes
      contentWrapper.classList.add('image-carousel-content-wrapper');
      content.classList.add('image-carousel-content');
      rightBtn.classList.add('right-btn');
      leftBtn.classList.add('left-btn');

      // Set attributes
      rightBtn.setAttribute('type', 'button');
      leftBtn.setAttribute('type', 'button');

      // Set text content for buttons
      rightBtn.innerHTML = '&#11166'; // Unicode character or text
      leftBtn.innerHTML = '&#11164'; // Unicode character or text

      // Append elements to container
      contentWrapper.append(content);
      container.append(contentWrapper, rightBtn, leftBtn);

      // Store references in this.elements
      this.elements = {
        container,
        content,
        rightBtn,
        leftBtn,
      };
    }

    // Initialization
    initializeCarousel() {
      xPos = 0;

      // Start a timer for cycling through carousel automatically
      timer = null; // Set to null for no timer

      this.elements.content.innerHTML = '';

      const imgWidth = this.elements.container.offsetWidth;
      const imgHeight = this.elements.container.offsetHeight;

      // Function to create div containers with image tags
      const createImageContainer = () => {
        const container = document.createElement('div');
        const imgElement = document.createElement('img');

        container.classList.add('image-container');

        // Set width and height styles based on carousel container dimensions
        imgElement.style.width = `${imgWidth}px`;
        imgElement.style.height = `${imgHeight}px`;

        container.append(imgElement);

        return container;
      };

      // Create image containers and navigation dots for each carousel image
      this.imageSources.forEach((src, index) => {
        const imageContainer = createImageContainer();
        // const navigationDot = createNavigationDot();

        // Set the source attribute for the image
        imageContainer.querySelector('img').setAttribute('src', src);

        this.elements.content.append(imageContainer);
      });

      const initializeButtonEventListeners = () => {
        this.elements.rightBtn.addEventListener('click', () => {
          this.shiftCarousel('right');
        });

        this.elements.leftBtn.addEventListener('click', () => {
          this.shiftCarousel('left');
        });
      };

      initializeButtonEventListeners();
    }

    // Function to shift the image carousel
    shiftCarousel(direction, index) {
      // Clear the timeout
      if (timer) {
        clearTimeout(timer);
      }

      const imageWidth = this.elements.container.offsetWidth;
      const scrollWidth = this.elements.content.scrollWidth;
      const numberOfIndices = this.imageSources.length - 1;
      let newPos;

      // Handle direct index navigation
      if (index != null) {
        if (index < 0 || index > numberOfIndices || isNaN(index)) {
          throw new Error(
            `Index out of bounds. Index: '${index}' | Must be a number between: 0-${numberOfIndices}`
          );
        }
        newPos = index * imageWidth;
      } else {
        // Handle directional navigation
        switch (direction) {
          case 'right':
            newPos = xPos + imageWidth;
            break;
          case 'left':
            newPos = xPos - imageWidth;
            break;
          default:
            throw new Error(`Invalid direction: ${direction}. Can only be "left" or "right"`);
        }

        // Loop carousel
        if (newPos < 0) {
          newPos = scrollWidth - imageWidth;
        } else if (newPos > scrollWidth - imageWidth) {
          newPos = 0;
        }
      }

      // Apply transform animation
      this.elements.content.style.transition = 'transform 0.3s ease';
      this.elements.content.style.transform = `translateX(-${newPos}px)`;

      // Update xPos
      xPos = newPos;

      // Restart timer
      if (timer) {
        timer = this.startTimer();
      }
    }

    // Timer for shifting automatically shifting through carousel
    startTimer() {
      console.log('shift');
      return setTimeout(() => this.shiftCarousel('right'), 5000);
    }
  }

  return { ImageCarousel };
})();

export default imageCarouselModule;
