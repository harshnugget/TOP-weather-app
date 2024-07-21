import imageCarouselModule from './imageCarouselModule';
import UIController from './UIController';
import weatherImages from './weatherImages';

export default function weatherCarousel(weatherData) {
  const imageArray = [];

  // Retrieve image icon for each day
  weatherData.forEach((day) => {
    const { icon } = weatherImages(day.icon);
    imageArray.push(icon);
  });

  const weatherImgContainer = document.querySelector('#today-weather > .weather-img-container');

  const carousel = new imageCarouselModule.ImageCarousel(
    Object.values(imageArray),
    weatherImgContainer
  );

  const getCarouselIndex = () => {
    const index = carousel.getIndexData().index;
    return index;
  };

  const updateWeatherData = (dayIndex) => {
    UIController.update(weatherData[dayIndex]);
  };

  document
    .querySelector('#today-weather > div > button.right-btn')
    .addEventListener('click', () => {
      updateWeatherData(getCarouselIndex());
    });

  document.querySelector('#today-weather > div > button.left-btn').addEventListener('click', () => {
    updateWeatherData(getCarouselIndex());
  });
}
