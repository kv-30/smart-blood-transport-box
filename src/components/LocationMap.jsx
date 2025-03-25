import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { fetchLocationData } from '../utils/apiMock';
import "../styles/components/LocationMap.css";

const LocationMap = () => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [locationHistory, setLocationHistory] = useState([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchLocationData();
        
        // Set current location (most recent)
        if (data.locations.length > 0) {
          const currentLocation = data.locations[data.locations.length - 1];
          setLocation(currentLocation);
          
          // Get approximate address (this would be a reverse geocoding API in a real app)
          setAddress(data.address || 'Location information unavailable');
        }
        
        // Set location history
        setLocationHistory(data.locations);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching location data:", error);
        setLoading(false);
      }
    };

    getData();
    
    // Set up polling for real-time updates
    const interval = setInterval(getData, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Loading location data...</div>;
  }

  return (
    <div className="stat-card">
      <div className="location-info">
        <h2 className="title">Current Location</h2>
        <p className="address">{address}</p>
        <p className="coordinates">
          Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </p>
      </div>
      
      <div className="map-container">
        <MapContainer center={[location.lat, location.lng]} zoom={13} className="map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.lat, location.lng]}>
            <Popup>
              Smart Blood Transport Box <br />
              Last updated: {new Date().toLocaleTimeString()}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <div className="update-info">
        <p>Updated every minute</p>
      </div>
    </div>
  );
};

export default LocationMap;
