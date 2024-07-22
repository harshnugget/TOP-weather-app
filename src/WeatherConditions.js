class WeatherConditions {
  constructor({ datetime, temperature, precipitation, windspeed, conditions, icon }) {
    this.datetime = datetime;
    this.temperature = temperature;
    this.precipitation = precipitation;
    this.windspeed = windspeed;
    this.conditions = conditions;
    this.icon = icon;
  }
}

export default WeatherConditions;
