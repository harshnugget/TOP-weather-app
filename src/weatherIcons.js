import cloudy from './images/weather_icons/cloudy.svg';
import clear from './images/weather_icons/clear.svg';
import rainy from './images/weather_icons/rainy.svg';
import partlyCloudy from './images/weather_icons/partly_cloudy.svg';
import stormy from './images/weather_icons/thunder.svg';
import snowy from './images/weather_icons/snowy.svg';

const convertPathToSVG = async (SVGPath) => {
  try {
    const response = await fetch(SVGPath);
    const data = await response.text();
    return data;
  } catch (error) {
    console.error(error);
    return null; // Return null or handle the error as needed
  }
};

const loadWeatherIcons = async () => {
  return {
    cloudy: await convertPathToSVG(cloudy),
    clear: await convertPathToSVG(clear),
    rainy: await convertPathToSVG(rainy),
    partlyCloudy: await convertPathToSVG(partlyCloudy),
    stormy: await convertPathToSVG(stormy),
    snowy: await convertPathToSVG(snowy),
  };
};

export default loadWeatherIcons;
