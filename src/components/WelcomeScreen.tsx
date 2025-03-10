import React, { useState } from 'react';
import axios from 'axios';

interface WelcomeScreenProps {
  onRouteWeather: (route: any, weather: any) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onRouteWeather }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Fetch coordinates for source and destination using the serverless function
      const sourceResponse = await axios.get(`/api/geocode`, {
        params: {
          address: source,
          key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        },
      });
      const sourceCoords = sourceResponse.data.results[0].geometry.location;

      const destinationResponse = await axios.get(`/api/geocode`, {
        params: {
          address: destination,
          key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        },
      });
      const destinationCoords = destinationResponse.data.results[0].geometry.location;

      // Fetch route data from Google Routes API using the serverless function
      const routeResponse = await axios.post(
        `/api/routes`,
        {
          origin: {
            location: {
              latLng: {
                latitude: sourceCoords.lat,
                longitude: sourceCoords.lng,
              },
            },
          },
          destination: {
            location: {
              latLng: {
                latitude: destinationCoords.lat,
                longitude: destinationCoords.lng,
              },
            },
          },
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE',
          computeAlternativeRoutes: false,
          routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false,
          },
          languageCode: 'en-US',
          units: 'IMPERIAL',
        },
        {
          params: {
            key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          },
        }
      );
      const routeData = routeResponse.data;

      // Fetch weather data from OpenWeatherMap One Call API using the serverless function
      const weatherResponse = await axios.get(`/api/weather`, {
        params: {
          lat: destinationCoords.lat,
          lon: destinationCoords.lng,
          units: 'imperial',
          appid: import.meta.env.VITE_OPENWEATHERMAP_API_KEY,
        },
      });
      const weatherData = weatherResponse.data;

      setRoute(routeData);
      setWeather(weatherData);
      onRouteWeather(routeData, weatherData);
    } catch (error) {
      console.error('Error fetching route or weather data:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to Road Trip Weather</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="source">Source:</label>
          <input
            type="text"
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        <button type="submit">Get Route and Weather</button>
      </form>
      {route && (
        <div>
          <h2>Route</h2>
          <pre>{JSON.stringify(route, null, 2)}</pre>
        </div>
      )}
      {weather && (
        <div>
          <h2>Weather</h2>
          <pre>{JSON.stringify(weather, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;