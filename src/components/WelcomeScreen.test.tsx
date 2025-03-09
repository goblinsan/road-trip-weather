import React from 'react';
import { jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WelcomeScreen from './WelcomeScreen';
import axios from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(() => {
  Object.defineProperty(global, 'import.meta', {
    value: {
      env: {
        VITE_GOOGLE_MAPS_API_KEY: 'test-google-maps-api-key',
        VITE_OPENWEATHERMAP_API_KEY: 'test-openweathermap-api-key',
      },
    },
  });
});

test('renders welcome screen with input fields and button', () => {
  render(<WelcomeScreen onRouteWeather={jest.fn()} />);
  expect(screen.getByLabelText(/source/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
  expect(screen.getByText(/get route and weather/i)).toBeInTheDocument();
});

test('calls onRouteWeather with route and weather data on form submit', async () => {
  const mockOnRouteWeather = jest.fn();
  const mockGeocodeResponse = {
    data: {
      results: [
        {
          geometry: {
            location: {
              lat: 40.712776,
              lng: -74.005974,
            },
          },
        },
        {
          geometry: {
            location: {
              lat: 34.052235,
              lng: -118.243683,
            },
          },
        },
      ],
    },
  };
  const mockRouteData = { data: 'route data' };
  const mockWeatherData = { data: 'weather data' };

  mockedAxios.get.mockResolvedValueOnce(mockGeocodeResponse); // Mock geocoding for source
  mockedAxios.get.mockResolvedValueOnce(mockGeocodeResponse); // Mock geocoding for destination
  mockedAxios.post.mockResolvedValueOnce({ data: mockRouteData });
  mockedAxios.get.mockResolvedValueOnce({ data: mockWeatherData });

  render(<WelcomeScreen onRouteWeather={mockOnRouteWeather} />);

  fireEvent.change(screen.getByLabelText(/source/i), { target: { value: 'New York' } });
  fireEvent.change(screen.getByLabelText(/destination/i), { target: { value: 'Los Angeles' } });
  fireEvent.click(screen.getByText(/get route and weather/i));

  await waitFor(() => {
    expect(mockOnRouteWeather).toHaveBeenCalledWith(mockRouteData, mockWeatherData);
  });

  await waitFor(() => {
    expect(screen.getByText('Route')).toBeInTheDocument();
    expect(screen.getByText('Weather')).toBeInTheDocument();
    expect(screen.getByText(/route data/i)).toBeInTheDocument();
    expect(screen.getByText(/weather data/i)).toBeInTheDocument();
  });
});