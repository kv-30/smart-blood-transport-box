import { useEffect, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchHumidityData } from '../utils/apiMock';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

const HumidityChart = () => {
  const [humidityData, setHumidityData] = useState({
    labels: [],
    datasets: []
  });
  const [currentHumidity, setCurrentHumidity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchHumidityData();
        
        // Set current humidity (most recent reading)
        if (data.humidities.length > 0) {
          setCurrentHumidity(data.humidities[data.humidities.length - 1]);
        }
        
        // Format data for chart
        setHumidityData({
          labels: data.timestamps.map(ts => {
            const date = new Date(ts);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }),
          datasets: [
            {
              label: 'Humidity (%)',
              data: data.humidities,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              tension: 0.3,
            },
          ],
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching humidity data:", error);
        setLoading(false);
      }
    };

    getData();
    
    // Set up polling for real-time updates
    const interval = setInterval(getData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Humidity Over Time',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Humidity (%)'
        }
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading humidity data...</div>;
  }

  return (
    <div className="stat-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Humidity</h2>
        {currentHumidity !== null && (
          <div className="text-2xl font-bold">
            <span className={currentHumidity > 70 ? 'text-red-500' : (currentHumidity < 30 ? 'text-orange-500' : 'text-green-500')}>
              {currentHumidity.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <Line options={options} data={humidityData} height={50} />
      <div className="mt-4 text-sm text-gray-500">
        <p>Ideal range: 30% - 70%</p>
        <p>Updated every 30 seconds</p>
      </div>
    </div>
  );
};

export default HumidityChart;