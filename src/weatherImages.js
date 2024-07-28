// Animated Icons
import cloudy from './images/weather_icons/cloudy.svg';
import clear from './images/weather_icons/clear.svg';
import rainy from './images/weather_icons/rainy.svg';
import partlyCloudy from './images/weather_icons/partly_cloudy.svg';
import stormy from './images/weather_icons/thunder.svg';
import snowy from './images/weather_icons/snowy.svg';
import night from './images/weather_icons/night.svg';

// Static Icons
import cloudyStatic from './images/weather_icons/cloudy_static.svg';
import clearStatic from './images/weather_icons/clear_static.svg';
import rainyStatic from './images/weather_icons/rainy_static.svg';
import partlyCloudyStatic from './images/weather_icons/partly_cloudy_static.svg';
import stormyStatic from './images/weather_icons/thunder_static.svg';
import snowyStatic from './images/weather_icons/snowy_static.svg';
import nightStatic from './images/weather_icons/night_static.svg';

// Backgrounds
import clearSkyBg from './images/wallpapers/sunny.png';
import partlyCloudyBg from './images/wallpapers/partly_cloudy.png';
import rainyBg from './images/wallpapers/rainy.png';
import stormyBg from './images/wallpapers/stormy.png';
import snowyBg from './images/wallpapers/snowy.png';
import cloudyBg from './images/wallpapers/cloudy.png';

// Function to preload images
function preloadImages(imageArray) {
  imageArray.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

// Preload background images
preloadImages([clearSkyBg, partlyCloudyBg, rainyBg, stormyBg, snowyBg, cloudyBg]);

const weatherImages = (() => {
  let icon;
  let staticIcon;
  let bg;

  const images = {
    cloudy: { icon: cloudy, staticIcon: cloudyStatic, bg: cloudyBg },
    clear: { icon: clear, staticIcon: clearStatic, bg: clearSkyBg },
    rainy: { icon: rainy, staticIcon: rainyStatic, bg: rainyBg },
    partlyCloudy: { icon: partlyCloudy, staticIcon: partlyCloudyStatic, bg: partlyCloudyBg },
    stormy: { icon: stormy, staticIcon: stormyStatic, bg: stormyBg },
    snowy: { icon: snowy, staticIcon: snowyStatic, bg: snowyBg },
    night: { icon: night, staticIcon: nightStatic, bg: clearSkyBg }, // ? Update bg image
  };

  return function (description) {
    // TODO...
    // Add more checks
    switch (description.toLowerCase()) {
      case 'clear-day':
        icon = images.clear.icon;
        staticIcon = images.clear.staticIcon;
        bg = images.clear.bg;
        break;
      case 'rain':
        icon = images.rainy.icon;
        staticIcon = images.rainy.staticIcon;
        bg = images.rainy.bg;
        break;
      case 'cloudy':
        icon = images.cloudy.icon;
        staticIcon = images.cloudy.staticIcon;
        bg = images.cloudy.bg;
        break;
      case 'partly-cloudy-day':
        icon = images.partlyCloudy.icon;
        staticIcon = images.partlyCloudy.staticIcon;
        bg = images.partlyCloudy.bg;
        break;
      case 'thunder-rain':
        icon = images.stormy.icon;
        staticIcon = images.stormy.staticIcon;
        bg = images.stormy.bg;
        break;
      case 'snow':
        icon = images.snowy.icon;
        staticIcon = images.snowy.staticIcon;
        bg = images.snowy.bg;
        break;
      case 'clear-night':
        icon = images.night.icon;
        staticIcon = images.night.staticIcon;
        bg = images.night.bg;
    }
    return { icon, staticIcon, bg };
  };
})();

export default weatherImages;
