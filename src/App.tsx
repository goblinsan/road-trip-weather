import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import RouteWeatherResult from './components/RouteWeatherResult';

const App: React.FC = () => {
  const [route, setRoute] = useState(null);
  const [weather, setWeather] = useState(null);

  const handleRouteWeather = (routeData: any, weatherData: any) => {
    setRoute(routeData);
    setWeather(weatherData);
  };

  return (
    <div>
      {!route && !weather ? (
        <WelcomeScreen onRouteWeather={handleRouteWeather} />
      ) : (
        <RouteWeatherResult route={route} weather={weather} />
      )}
    </div>
  );
};

export default App;
