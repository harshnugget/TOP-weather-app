// Icons
import cloudy from './images/weather_icons/cloudy.svg';
import clear from './images/weather_icons/clear.svg';
import rainy from './images/weather_icons/rainy.svg';
import partlyCloudy from './images/weather_icons/partly_cloudy.svg';
import stormy from './images/weather_icons/thunder.svg';
import snowy from './images/weather_icons/snowy.svg';

// Backgrounds
import clearSkyBg from './images/wallpapers/sunny.png';
import partlyCloudyBg from './images/wallpapers/partly_cloudy.png';
import rainyBg from './images/wallpapers/rainy.png';
import stormyBg from './images/wallpapers/stormy.png';
import snowyBg from './images/wallpapers/snowy.png';
import cloudyBg from './images/wallpapers/cloudy.png';

const weatherImages = (() => {
  let icon;
  let bg;

  const images = {
    cloudy: { icon: cloudy, bg: cloudyBg },
    clear: { icon: clear, bg: clearSkyBg },
    rainy: { icon: rainy, bg: rainyBg },
    partlyCloudy: { icon: partlyCloudy, bg: partlyCloudyBg },
    stormy: { icon: stormy, bg: stormyBg },
    snowy: { icon: snowy, bg: snowyBg },
  };

  return function (description) {
    // TODO...
    // Add more checks
    switch (description.toLowerCase()) {
      case 'clear-day':
        icon = images.clear.icon;
        bg = images.clear.bg;
        break;
      case 'rain':
        icon = images.rainy.icon;
        bg = images.rainy.bg;
        break;
      case 'cloudy':
        icon = images.cloudy.icon;
        bg = images.cloudy.bg;
        break;
      case 'partly-cloudy-day':
        icon = images.partlyCloudy.icon;
        bg = images.partlyCloudy.bg;
        break;
      case 'thunder-rain':
        icon = images.stormy.icon;
        bg = images.stormy.bg;
        break;
      case 'snow':
        icon = images.snowy.icon;
        bg = images.snowy.bg;
        break;
    }
    return { icon, bg };
  };
})();

export default weatherImages;
