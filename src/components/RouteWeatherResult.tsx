// filepath: /Users/jamescoghlan/code/road-trip-weather/road-trip-weather/src/components/RouteWeatherResult.tsx
import React from 'react';

interface RouteWeatherResultProps {
  route: any; // Replace with appropriate type
  weather: any; // Replace with appropriate type
}

const RouteWeatherResult: React.FC<RouteWeatherResultProps> = ({ route, weather }) => {
  return (
    <div>
      <h2>Route</h2>
      {/* Display route information */}
      <pre>{JSON.stringify(route, null, 2)}</pre>

      <h2>Weather Forecast</h2>
      {/* Display weather information */}
      <pre>{JSON.stringify(weather, null, 2)}</pre>
    </div>
  );
};

export default RouteWeatherResult;