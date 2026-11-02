const express = require('express');
const router = express.Router();

const WEATHER_CODE_MAP = {
  0: { description: 'Clear Sky', icon: 'Sun' },
  1: { description: 'Mainly Clear', icon: 'SunMedium' },
  2: { description: 'Partly Cloudy', icon: 'CloudSun' },
  3: { description: 'Overcast', icon: 'Cloud' },
  45: { description: 'Foggy', icon: 'CloudFog' },
  48: { description: 'Depositing Rime Fog', icon: 'CloudFog' },
  51: { description: 'Light Drizzle', icon: 'CloudDrizzle' },
  53: { description: 'Moderate Drizzle', icon: 'CloudDrizzle' },
  55: { description: 'Dense Drizzle', icon: 'CloudRain' },
  61: { description: 'Slight Rain', icon: 'CloudRain' },
  63: { description: 'Moderate Rain', icon: 'CloudRain' },
  65: { description: 'Heavy Rain', icon: 'CloudRainWind' },
  71: { description: 'Slight Snow', icon: 'CloudSnow' },
  73: { description: 'Moderate Snow', icon: 'CloudSnow' },
  75: { description: 'Heavy Snow', icon: 'CloudSnow' },
  80: { description: 'Rain Showers', icon: 'CloudRain' },
  81: { description: 'Heavy Showers', icon: 'CloudRainWind' },
  95: { description: 'Thunderstorm', icon: 'CloudLightning' }
};

const DEMO_FALLBACKS = {
  mumbai: {
    city: 'Mumbai',
    country: 'IN',
    temperature: 30.2,
    feels_like: 34.0,
    temp_min: 27.5,
    temp_max: 33.0,
    humidity: 74,
    pressure: 1011,
    wind_speed: 14.5,
    condition: 'Haze & Humid',
    icon: 'Sun',
    forecast: [
      { day: 'Mon', condition: 'Sunny', high: 33, low: 27, pop: 10 },
      { day: 'Tue', condition: 'Partly Cloudy', high: 32, low: 26, pop: 20 },
      { day: 'Wed', condition: 'Hazy', high: 31, low: 26, pop: 15 },
      { day: 'Thu', condition: 'Sunny', high: 33, low: 27, pop: 5 },
      { day: 'Fri', condition: 'Scattered Clouds', high: 32, low: 27, pop: 25 }
    ]
  },
  delhi: {
    city: 'New Delhi',
    country: 'IN',
    temperature: 26.5,
    feels_like: 26.0,
    temp_min: 21.0,
    temp_max: 31.0,
    humidity: 48,
    pressure: 1013,
    wind_speed: 11.2,
    condition: 'Clear Sky',
    icon: 'Sun',
    forecast: [
      { day: 'Mon', condition: 'Clear', high: 31, low: 21, pop: 0 },
      { day: 'Tue', condition: 'Clear', high: 30, low: 20, pop: 0 },
      { day: 'Wed', condition: 'Sunny', high: 31, low: 21, pop: 5 },
      { day: 'Thu', condition: 'Hazy Sun', high: 29, low: 19, pop: 10 },
      { day: 'Fri', condition: 'Partly Cloudy', high: 28, low: 18, pop: 15 }
    ]
  },
  london: {
    city: 'London',
    country: 'GB',
    temperature: 14.2,
    feels_like: 13.5,
    temp_min: 11.0,
    temp_max: 16.5,
    humidity: 82,
    pressure: 1017,
    wind_speed: 18.2,
    condition: 'Overcast Clouds',
    icon: 'Cloud',
    forecast: [
      { day: 'Mon', condition: 'Overcast', high: 16, low: 11, pop: 40 },
      { day: 'Tue', condition: 'Light Rain', high: 15, low: 10, pop: 70 },
      { day: 'Wed', condition: 'Showers', high: 14, low: 9, pop: 60 },
      { day: 'Thu', condition: 'Partly Cloudy', high: 15, low: 10, pop: 25 },
      { day: 'Fri', condition: 'Sunny Spells', high: 16, low: 11, pop: 20 }
    ]
  },
  'new york': {
    city: 'New York',
    country: 'US',
    temperature: 18.0,
    feels_like: 17.2,
    temp_min: 14.0,
    temp_max: 21.0,
    humidity: 62,
    pressure: 1015,
    wind_speed: 16.0,
    condition: 'Partly Sunny',
    icon: 'CloudSun',
    forecast: [
      { day: 'Mon', condition: 'Partly Cloudy', high: 21, low: 14, pop: 20 },
      { day: 'Tue', condition: 'Sunny', high: 22, low: 15, pop: 10 },
      { day: 'Wed', condition: 'Rain', high: 18, low: 13, pop: 80 },
      { day: 'Thu', condition: 'Breezy', high: 19, low: 12, pop: 30 },
      { day: 'Fri', condition: 'Sunny', high: 21, low: 14, pop: 5 }
    ]
  }
};

router.get('/', async (req, res) => {
  const city = (req.query.city || 'Mumbai').trim();

  try {
    // 1. Geocode city via Open-Meteo Keyless API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      // Check fallback
      const match = DEMO_FALLBACKS[city.toLowerCase()];
      if (match) {
        return res.json({ success: true, is_demo: true, ...match });
      }
      return res.status(404).json({ error: `City '${city}' was not found. Please verify spelling.` });
    }

    const loc = geoData.results[0];
    const { latitude, longitude, name, country_code } = loc;

    // 2. Fetch Live Weather & 5-day forecast from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=6`;

    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const curr = weatherData.current;
    const daily = weatherData.daily;
    const codeInfo = WEATHER_CODE_MAP[curr.weather_code] || { description: 'Variable Weather', icon: 'CloudSun' };

    const daysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const forecast = [];
    if (daily && daily.time) {
      for (let i = 1; i < Math.min(daily.time.length, 6); i++) {
        const dObj = new Date(daily.time[i]);
        const dayCode = daily.weather_code[i];
        const dayInfo = WEATHER_CODE_MAP[dayCode] || { description: 'Partly Cloudy', icon: 'CloudSun' };
        forecast.push({
          day: daysNames[dObj.getDay()],
          date: daily.time[i],
          condition: dayInfo.description,
          high: Math.round(daily.temperature_2m_max[i]),
          low: Math.round(daily.temperature_2m_min[i]),
          pop: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 10
        });
      }
    }

    res.json({
      success: true,
      city: name,
      country: country_code,
      temperature: Math.round(curr.temperature_2m * 10) / 10,
      feels_like: Math.round(curr.apparent_temperature * 10) / 10,
      temp_min: daily ? Math.round(daily.temperature_2m_min[0]) : Math.round(curr.temperature_2m - 3),
      temp_max: daily ? Math.round(daily.temperature_2m_max[0]) : Math.round(curr.temperature_2m + 3),
      humidity: curr.relative_humidity_2m,
      pressure: Math.round(curr.surface_pressure),
      wind_speed: Math.round(curr.wind_speed_10m * 10) / 10,
      condition: codeInfo.description,
      icon: codeInfo.icon,
      is_demo: false,
      forecast
    });
  } catch (err) {
    console.warn(`Live weather fetch failed for '${city}', using fallback:`, err.message);
    const fallback = DEMO_FALLBACKS[city.toLowerCase()] || DEMO_FALLBACKS.mumbai;
    res.json({ success: true, is_demo: true, ...fallback, city });
  }
});

module.exports = router;
