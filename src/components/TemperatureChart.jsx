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
import { fetchTemperatureData } from '../utils/apiMock';

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

const TemperatureChart = () => {
  const [temperatureData, setTemperatureData] = useState({
    labels: [],
    datasets: []
  });
  const [currentTemp, setCurrentTemp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchTemperatureData();
        
        // Set current temperature (most recent reading)
        if (data.temperatures.length > 0) {
          setCurrentTemp(data.temperatures[data.temperatures.length - 1]);
        }
        
        // Format data for chart
        setTemperatureData({
          labels: data.timestamps.map(ts => {
            const date = new Date(ts);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }),
          datasets: [
            {
              label: 'Temperature (°C)',
              data: data.temperatures,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              tension: 0.3,
            },
          ],
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching temperature data:", error);
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
        text: 'Temperature Over Time',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 40,
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading temperature data...</div>;
  }

  return (
    <div className="stat-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Temperature</h2>
        {currentTemp !== null && (
          <div className="text-2xl font-bold">
            <span className={currentTemp > 10 ? (currentTemp > 25 ? 'text-red-500' : 'text-green-500') : 'text-blue-500'}>
              {currentTemp.toFixed(1)}°C
            </span>
          </div>
        )}
      </div>
      <Line options={options} data={temperatureData} height={50} />
      <div className="mt-4 text-sm text-gray-500">
        <p>Safe range: 2°C - 8°C</p>
        <p>Updated every 30 seconds</p>
      </div>
    </div>
  );
};

export default TemperatureChart;