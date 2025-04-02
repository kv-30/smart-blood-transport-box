import React, { createContext, useState, useContext } from 'react';

export const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
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
  const [bloodProduct, setBloodProduct] = useState('whole_blood');

  return (
    <DeviceContext.Provider value={{
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
    }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);