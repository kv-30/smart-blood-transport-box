// Mock data for temperature readings
const generateTemperatureData = () => {
    const timestamps = [];
    const temperatures = [];
    const now = new Date();
    
    // Generate data for the last 24 hours with readings every hour
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now);
      timestamp.setHours(now.getHours() - i);
      timestamps.push(timestamp.toISOString());
      
      // Generate realistic temperature data (4-6°C with some variation)
      const baseTemp = 5;
      const variation = Math.random() * 1.5 - 0.75; // Random variation between -0.75 and +0.75
      temperatures.push(baseTemp + variation);
    }
    
    return { timestamps, temperatures };
  };
  
  // Mock data for humidity readings
  const generateHumidityData = () => {
    const timestamps = [];
    const humidities = [];
    const now = new Date();
    
    // Generate data for the last 24 hours with readings every hour
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now);
      timestamp.setHours(now.getHours() - i);
      timestamps.push(timestamp.toISOString());
      
      // Generate realistic humidity data (40-60% with some variation)
      const baseHumidity = 50;
      const variation = Math.random() * 10 - 5; // Random variation between -5 and +5
      humidities.push(baseHumidity + variation);
    }
    
    return { timestamps, humidities };
  };
  
  // Mock data for GPS location
  const generateLocationData = () => {
    // Base coordinates (can be changed to any desired location)
    const baseLatitude = 37.7749; // San Francisco latitude
    const baseLongitude = -122.4194; // San Francisco longitude
    
    const locations = [];
    const timestamps = [];
    const now = new Date();
    
    // Generate location data for the last 6 hours
    for (let i = 5; i >= 0; i--) {
      const timestamp = new Date(now);
      timestamp.setHours(now.getHours() - i);
      timestamps.push(timestamp.toISOString());
      
      // Add small random variation to create a path
      const latVariation = (Math.random() * 0.01 - 0.005) * i;
      const lngVariation = (Math.random() * 0.01 - 0.005) * i;
      
      locations.push({
        lat: baseLatitude + latVariation,
        lng: baseLongitude + lngVariation
      });
    }
    
    return { 
      locations, 
      timestamps,
      address: "Medical Center, 123 Hospital St, San Francisco, CA" 
    };
  };
  
  // Mock API functions that simulate fetching data from the server
  export const fetchTemperatureData = () => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve(generateTemperatureData());
      }, 500);
    });
  };
  
  export const fetchHumidityData = () => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve(generateHumidityData());
      }, 500);
    });
  };
  
  export const fetchLocationData = () => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve(generateLocationData());
      }, 500);
    });
  };