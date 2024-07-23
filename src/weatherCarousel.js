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

  const weatherImgContainer = document.querySelector('#today-weather > .image-carousel-container');

  const carousel = new imageCarouselModule.ImageCarousel(
    Object.values(imageArray),
    weatherImgContainer
  );

  return carousel;
}
