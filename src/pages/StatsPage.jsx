import React, { useEffect, useState } from 'react';
import { esp32Service } from '../services/esp32Service';
import "../styles/pages/StatsPage.css";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const StatsPage = () => {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    location: {
      latitude: 18.4575,
      longitude: 73.8508
    }
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const connectESP32 = async () => {
      try {
        await esp32Service.connect();
        esp32Service.onData((data) => {
          setSensorData(data);
        });
      } catch (error) {
        console.error('Connection failed:', error);
      }
    };

    connectESP32();

    return () => {
      esp32Service.disconnect();
    };
  }, []);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedTimeRange]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-neutral-900">
          Live Statistics
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Real-time monitoring of temperature, humidity, and location data
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center space-x-4">
        {['24h', '7d', '30d', '1y'].map((range) => (
          <button
            key={range}
            onClick={() => setSelectedTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeRange === range
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentStats.map((stat, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                stat.change >= 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {stat.change >= 0 ? '+' : ''}{stat.change}%
              </span>
            </div>
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stat.data}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={stat.change >= 0 ? '#059669' : '#DC2626'}
                    fill={stat.change >= 0 ? '#D1FAE5' : '#FEE2E2'}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
            Temperature History
          </h3>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-primary-500"></span>
            <span className="text-gray-700 dark:text-gray-200 text-sm">Temperature (°C)</span>
          </div>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="time"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°C`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Map */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-6">
          Current Location
        </h3>
        <div className="bg-gray-50 dark:bg-gray-800">
          <h2 className="text-gray-900 dark:text-gray-100">Map integration coming soon</h2>
          <p className="text-gray-600 dark:text-gray-300"></p>
        </div>
      </div>
    </div>
  );
};

// Sample data
const currentStats = [
  {
    label: 'Current Temperature',
    value: '4.2°C',
    change: 0.8,
    data: Array.from({ length: 24 }, (_, i) => ({
      value: 4 + Math.random() * 0.5,
    })),
  },
  {
    label: 'Humidity',
    value: '45%',
    change: -2.3,
    data: Array.from({ length: 24 }, (_, i) => ({
      value: 45 + Math.random() * 5,
    })),
  },
  {
    label: 'Battery Level',
    value: '82%',
    change: -5.4,
    data: Array.from({ length: 24 }, (_, i) => ({
      value: 82 - i * 0.5 + Math.random() * 2,
    })),
  },
  {
    label: 'Signal Strength',
    value: '95%',
    change: 1.2,
    data: Array.from({ length: 24 }, (_, i) => ({
      value: 95 + Math.random() * 3,
    })),
  },
];

const temperatureData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  temperature: 4 + Math.random() * 0.5,
}));

export default StatsPage;
