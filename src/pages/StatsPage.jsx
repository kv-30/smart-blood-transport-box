import React, { useState, useEffect } from 'react';
import '../styles/pages/StatsPage.css';
import { useDevice } from '../context/DeviceContext';

// Add this component before the main StatsPage component
const TemperatureGuidelinesCard = () => {
  return (
    <div className="stats-card">
      <div className="card-header">
        <svg className="text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
        </svg>
        <h2 className="card-title">Temperature Guidelines</h2>
      </div>
      <div className="guidelines-list space-y-3 mt-4">
        <div className="guideline-item">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Whole Blood & RBC</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">1°C to 10°C</p>
        </div>
        <div className="guideline-item">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Platelets</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">20°C to 24°C</p>
        </div>
        <div className="guideline-item">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Plasma (Frozen)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">≤ -25°C</p>
        </div>
      </div>
    </div>
  );
};

function StatsPage() {
  const {
    port,
    setPort,
    reader,
    setReader,
    deviceInfo,
    setDeviceInfo,
    sensorData,
    setSensorData,
    isConnected,
    setIsConnected,
    error,
    setError,
    lastUpdateTime,
    setLastUpdateTime,
    bloodProduct,
    setBloodProduct
  } = useDevice();

  // Disconnect from the device
  const disconnectDevice = async () => {
    try {
      if (reader) {
        await reader.cancel();
        setReader(null);
      }
      if (port) {
        await port.close();
        setPort(null);
      }
      setIsConnected(false);
      setDeviceInfo(null);
      console.log("Device disconnected successfully");
    } catch (error) {
      console.error('Disconnect error:', error);
      setError(`Disconnect error: ${error.message}`);
    }
  };

  // Get device information
  const getDeviceInfo = async (port) => {
    try {
      const info = await port.getInfo();
      return `ESP32 Device (${info.usbVendorId}:${info.usbProductId})`;
    } catch (error) {
      console.warn('Could not get device info:', error);
      return 'Connected Device';
    }
  };

  // Read data from the serial port
  const readSerialData = async (port) => {
    try {
      // Create a TextDecoder to decode the bytes
      const decoder = new TextDecoder();
      let buffer = '';
      
      // Get a reader and store it in state
      const reader = port.readable.getReader();
      setReader(reader);
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // Reader has been canceled
          break;
        }
        
        // Decode the received bytes and add to buffer
        const text = decoder.decode(value);
        buffer += text;
        
        // Extract JSON messages between ### and $$$
        let startIndex = buffer.indexOf('###');
        let endIndex = buffer.indexOf('$$$');
        
        while (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
          const jsonString = buffer.substring(startIndex + 3, endIndex);
          try {
            const data = JSON.parse(jsonString);
            if (data.marker === 'SBB_DATA') {
              // Update data state with formatted values
              setSensorData({
                temperature: Number(data.temperature).toFixed(1),
                humidity: Number(data.humidity).toFixed(1),
                location: data.location || { lat: 0, lng: 0 }
              });
              setLastUpdateTime(new Date().toLocaleTimeString());
              console.log("Data updated:", data);
            }
          } catch (e) {
            console.warn('JSON parse error:', e);
          }
          
          // Remove the processed message from buffer
          buffer = buffer.substring(endIndex + 3);
          
          // Look for next message
          startIndex = buffer.indexOf('###');
          endIndex = buffer.indexOf('$$$');
        }
        
        // Prevent buffer from growing too large
        if (buffer.length > 500) {
          buffer = buffer.substring(buffer.length - 500);
        }
      }
      
    } catch (error) {
      console.error('Read error:', error);
      // Handle errors appropriately
      if (error.name === 'BufferOverrunError') {
        console.log("Recovering from buffer overrun...");
        // Try to reconnect to the port
        if (port.readable) {
          readSerialData(port);
        }
      } else {
        setError(`Read error: ${error.message}`);
        setIsConnected(false);
      }
    }
  };

  // Connect to the device
  const connectToDevice = async () => {
    try {
      // Reset any error states
      setError(null);
      
      // Check if Web Serial API is supported
      if (!navigator.serial) {
        throw new Error('Web Serial API not supported. Use Chrome or Edge browser.');
      }
      
      // First disconnect if already connected
      if (isConnected) {
        await disconnectDevice();
      }
      
      // Request a port
      const newPort = await navigator.serial.requestPort();
      
      // Open the port
      await newPort.open({ baudRate: 115200 });
      
      // Get device info
      const deviceName = await getDeviceInfo(newPort);
      setDeviceInfo(deviceName);
      
      setPort(newPort);
      setIsConnected(true);
      
      console.log("Connected to device successfully");
      
      // Start reading data
      readSerialData(newPort);
      
    } catch (error) {
      console.error('Connection error:', error);
      setError(`Connection error: ${error.message}`);
      setIsConnected(false);
    }
  };

  // Remove useEffect cleanup as we want to maintain connection
  useEffect(() => {
    // Only start reading if we have a port but no active reader
    if (port && isConnected && !reader) {
      readSerialData(port);
    }
  }, [port, isConnected, reader]);

  // Format location display
  const formatLocation = (location) => {
    if (!location || (location.lat === 0 && location.lng === 0)) {
      return "Not Available";
    }
    return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
  };

  // Location card component
  const LocationCard = ({ location }) => {
    const hasValidLocation = location && 
      (Math.abs(location.lat) > 0 || Math.abs(location.lng) > 0);

    const formatCoordinate = (coord) => {
      return coord.toFixed(6);
    };

    const getGoogleMapsUrl = (lat, lng) => {
      return `https://www.google.com/maps?q=${lat},${lng}`;
    };

    return (
      <div className="stats-card">
        <div className="card-header">
          <svg className="text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Location</h2>
        </div>
        <div className="card-content">
          {isConnected ? (
            hasValidLocation ? (
              <>
                <div className="location-coordinates">
                  <div className="coordinate">
                    <span className="label text-gray-600 dark:text-gray-400">Latitude:</span>
                    <span className="value text-gray-900 dark:text-gray-100">{formatCoordinate(location.lat)}°</span>
                  </div>
                  <div className="coordinate">
                    <span className="label text-gray-600 dark:text-gray-400">Longitude:</span>
                    <span className="value text-gray-900 dark:text-gray-100">{formatCoordinate(location.lng)}°</span>
                  </div>
                </div>
                <a
                  href={getGoogleMapsUrl(location.lat, location.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-map-button"
                >
                  <svg className="text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span className="text-primary-600 dark:text-primary-400">View on Maps</span>
                </a>
              </>
            ) : (
              <div className="no-location">
                <span className="text-gray-600 dark:text-gray-400">Acquiring GPS signal...</span>
                <div className="loading-spinner"></div>
              </div>
            )
          ) : (
            <div className="no-location">
              <span className="text-gray-600 dark:text-gray-400">Device not connected</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Add this function to check temperature ranges
  const checkTemperatureRange = (temp, product) => {
    switch(product) {
      case 'whole_blood':
      case 'red_blood_cells':
        return temp >= 1 && temp <= 10;
      case 'platelets':
        return temp >= 20 && temp <= 24;
      case 'plasma':
        return temp < -25;
      case 'testing':
        return temp >= 25 && temp <= 40;
      default:
        return true;
    }
  };

  // Add this function to get range text
  const getTemperatureRange = (product) => {
    switch(product) {
      case 'whole_blood':
      case 'red_blood_cells':
        return '1°C to 10°C';
      case 'platelets':
        return '20°C to 24°C';
      case 'plasma':
        return 'Below -25°C';
      case 'testing':
        return '25°C to 40°C';
      default:
        return 'Not specified';
    }
  };

  // Update the stats section layout
  return (
    <div className="stats-page">
      <div className="stats-container">
        <div className="page-header">
          <h1 className="page-title">Live Statistics</h1>
          <p className="page-description">
            Real-time monitoring of temperature, humidity, and location data
          </p>
        </div>

        {/* Connection Button */}
        <div className="flex justify-center mb-8">
          <button 
            onClick={isConnected ? disconnectDevice : connectToDevice}
            className={`btn ${isConnected ? 'btn-danger' : 'btn-primary'}`}
          >
            {isConnected ? 'Disconnect Device' : 'Connect Device'}
          </button>
        </div>

        {/* Product Selection */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="section-title">What are you transporting?</h2>
          <select
            value={bloodProduct}
            onChange={(e) => setBloodProduct(e.target.value)}
            className="select-menu"
          >
            <option value="whole_blood">Whole Blood</option>
            <option value="red_blood_cells">Red Blood Cells</option>
            <option value="platelets">Platelets</option>
            <option value="plasma">Plasma</option>
            <option value="testing">Testing</option>
          </select>
        </div>

        {/* Stats Grid - Main Parameters */}
        <div className="stats-grid mb-8">
          <div className={`stats-card ${
            isConnected && 
            sensorData.temperature !== null && 
            !checkTemperatureRange(parseFloat(sensorData.temperature), bloodProduct) 
              ? 'temperature-alert' 
              : ''
          }`}>
            <div className="card-header">
              <div className="card-icon">
                {/* Temperature icon */}
              </div>
              <h2 className="card-title">Temperature</h2>
            </div>
            <div className="value-display">
              {isConnected ? (
                sensorData.temperature !== null ? (
                  <>
                    {sensorData.temperature}
                    <span className="unit">°C</span>
                  </>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">N/A</span>
                )
              ) : (
                <span className="text-gray-600 dark:text-gray-400 text-sm">Device not connected</span>
              )}
            </div>
          </div>

          <div className="stats-card">
            <div className="card-header">
              <div className="card-icon">
                {/* Humidity icon */}
              </div>
              <h2 className="card-title">Humidity</h2>
            </div>
            <div className="value-display">
              {isConnected ? (
                sensorData.humidity !== null ? (
                  <>
                    {sensorData.humidity}
                    <span className="unit">%</span>
                  </>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">N/A</span>
                )
              ) : (
                <span className="text-gray-600 dark:text-gray-400 text-sm">Device not connected</span>
              )}
            </div>
          </div>

          <LocationCard location={sensorData.location} />
        </div>

        {/* Temperature Guidelines Section */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mt-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Transport Temperature Guidelines
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Maintaining proper temperature is crucial for blood component viability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Whole Blood & Red Blood Cells
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Should be transported at temperature range of 1°C to 10°C
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Platelets
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Require a temperature range of 20°C to 24°C
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Plasma (Frozen)
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Must remain frozen during transport, typically at ≤ -25°C
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StatsPage;
