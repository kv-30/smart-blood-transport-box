import React, { useState, useEffect } from 'react';
import '../styles/pages/StatsPage.css';

function StatsPage() {
  const [port, setPort] = useState(null);
  const [reader, setReader] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    location: { lat: 0, lng: 0 }
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

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

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnectDevice();
      }
    };
  }, [isConnected]);

  // Format location display
  const formatLocation = (location) => {
    if (!location || (location.lat === 0 && location.lng === 0)) {
      return "Not Available";
    }
    return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
  };

  // Location card component
  const LocationCard = ({ location }) => {
    const hasLocation = location && (location.lat !== 0 || location.lng !== 0);
    
    return (
      <div className="stats-card">
        <h2>Location</h2>
        <div className="stat-value">
          {formatLocation(location)}
        </div>
        {hasLocation && (
          <a
            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="view-map-link"
          >
            View on Map
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="stats-page">
      <div className="stats-container">
        {/* Page Title */}
        <div className="page-title">
          <h1>Live Statistics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time monitoring of temperature, humidity, and location data
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger">
            <p>{error}</p>
          </div>
        )}

        {/* Connection Status and Button */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className={`status-indicator ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
              {isConnected ? `Connected to ${deviceInfo || 'Device'}` : "Disconnected"}
            </span>
            {lastUpdateTime && 
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last update: {lastUpdateTime}
              </span>
            }
          </div>
          <button 
            className={`btn ${isConnected ? 'btn-danger' : 'btn-primary'}`}
            onClick={isConnected ? disconnectDevice : connectToDevice}
          >
            {isConnected ? "Disconnect Device" : "Connect Device"}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stats-card">
            <div className="card-header">
              <h2 className="card-title">Temperature</h2>
            </div>
            <div className="value-display">
              {sensorData.temperature !== null ? sensorData.temperature : "N/A"}
              <span className="unit">°C</span>
            </div>
          </div>

          <div className="stats-card">
            <div className="card-header">
              <h2 className="card-title">Humidity</h2>
            </div>
            <div className="value-display">
              {sensorData.humidity !== null ? sensorData.humidity : "N/A"}
              <span className="unit">%</span>
            </div>
          </div>

          <div className="stats-card">
            <div className="card-header">
              <h2 className="card-title">Location</h2>
            </div>
            <div className="value-display text-base">
              {formatLocation(sensorData.location)}
            </div>
            {sensorData.location && (sensorData.location.lat !== 0 || sensorData.location.lng !== 0) && (
              <a
                href={`https://www.google.com/maps?q=${sensorData.location.lat},${sensorData.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline mt-4"
              >
                View on Map
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
