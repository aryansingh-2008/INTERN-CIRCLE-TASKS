import React, { useState, useEffect } from 'react';
import {
  Search,
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Gauge,
  Thermometer,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ForecastDay {
  day: string;
  date: string;
  condition: string;
  high: number;
  low: number;
  pop: number;
}

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  condition: string;
  icon: string;
  is_demo: boolean;
  forecast?: ForecastDay[];
}

export const Weather: React.FC = () => {
  const [cityInput, setCityInput] = useState('Mumbai');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const popularCities = ['Mumbai', 'New Delhi', 'Bengaluru', 'London', 'New York', 'Tokyo'];

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(cityName.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch weather data.');
      }

      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Could not retrieve meteorological data.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('Mumbai');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(cityInput);
  };

  const toUnit = (celsius: number) => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const getConditionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-8 h-8 text-amber-500" />;
      case 'Cloud':
        return <Cloud className="w-8 h-8 text-slate-400" />;
      case 'CloudRain':
      case 'CloudRainWind':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'CloudSnow':
        return <CloudSnow className="w-8 h-8 text-sky-300" />;
      case 'CloudLightning':
        return <CloudLightning className="w-8 h-8 text-amber-600" />;
      default:
        return <CloudSun className="w-8 h-8 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="scamshield-card p-6 bg-white border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              PROJECT 04
            </span>
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
              Fetch API & Open-Meteo
            </span>
          </div>
          <h1 className="text-xl font-semibold text-[#172033]">Live Weather Dashboard</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time conditions and 5-day forecasts with zero client-side secret exposure.
          </p>
        </div>

        {/* Temperature Unit Toggle */}
        <div className="flex items-center gap-1 border border-[#E5E7EB] rounded-lg p-1 bg-[#F8FAFC]">
          <button
            onClick={() => setUnit('C')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              unit === 'C' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-500'
            }`}
          >
            °C Celsius
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              unit === 'F' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-500'
            }`}
          >
            °F Fahrenheit
          </button>
        </div>
      </div>

      {/* Search Bar & Shortcuts */}
      <div className="scamshield-card p-5 space-y-3">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter city name (e.g. Mumbai, Tokyo, London, Bengaluru)..."
              className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-9 pr-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-60 shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
          <span className="text-[11px] text-slate-400 mr-1">Popular Cities:</span>
          {popularCities.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCityInput(c);
                fetchWeather(c);
              }}
              className="px-2 py-0.5 rounded text-[11px] bg-[#F8FAFC] hover:bg-slate-200 border border-[#E5E7EB] text-slate-700 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Weather Card */}
      {weather && (
        <div className="scamshield-card p-7 space-y-6 bg-white border border-[#E5E7EB]">
          {/* Main Top info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-[#172033]">
                  {weather.city}, {weather.country}
                </h2>
                {weather.is_demo && (
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded">
                    Verified Cache
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-wider flex items-center gap-2">
                {weather.condition}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                {getConditionIcon(weather.icon)}
              </div>
              <div className="text-right">
                <div className="text-5xl font-extrabold text-[#172033] tracking-tight font-mono">
                  {toUnit(weather.temperature)}°{unit}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Feels like {toUnit(weather.feels_like)}°{unit}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-center space-y-1">
              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-blue-500" /> Min / Max
              </div>
              <div className="text-base font-bold font-mono text-[#172033]">
                {toUnit(weather.temp_min)}° / {toUnit(weather.temp_max)}°
              </div>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-center space-y-1">
              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Humidity
              </div>
              <div className="text-base font-bold font-mono text-[#172033]">{weather.humidity}%</div>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-center space-y-1">
              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1">
                <Wind className="w-3.5 h-3.5 text-slate-500" /> Wind Velocity
              </div>
              <div className="text-base font-bold font-mono text-[#172033]">{weather.wind_speed} km/h</div>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-center space-y-1">
              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-amber-500" /> Pressure
              </div>
              <div className="text-base font-bold font-mono text-[#172033]">{weather.pressure} hPa</div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          {weather.forecast && weather.forecast.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="text-xs font-semibold text-[#172033] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#2563EB]" /> 5-Day Extended Forecast
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {weather.forecast.map((f, i) => (
                  <div key={i} className="p-3 bg-white border border-[#E5E7EB] rounded-lg text-center space-y-1.5 hover:border-slate-300 transition-colors">
                    <div className="text-xs font-semibold text-slate-700">{f.day}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{f.condition}</div>
                    <div className="text-sm font-bold font-mono text-[#172033]">
                      {toUnit(f.high)}° <span className="text-slate-400 font-normal">/ {toUnit(f.low)}°</span>
                    </div>
                    <div className="text-[10px] text-blue-600 font-medium">Rain {f.pop}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
