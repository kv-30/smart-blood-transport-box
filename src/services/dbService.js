import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.REACT_APP_DB_HOST || 'localhost',
  user: process.env.REACT_APP_DB_USER || 'root',
  password: process.env.REACT_APP_DB_PASSWORD || '',
  database: process.env.REACT_APP_DB_NAME || 'smart_blood_box'
};

let connection = null;

export async function initDB() {
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Create tables if they don't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sensor_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        temperature DECIMAL(5,2),
        humidity DECIMAL(5,2),
        latitude DECIMAL(10,6),
        longitude DECIMAL(10,6),
        blood_product VARCHAR(50),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

export async function logSensorData(data) {
  try {
    if (!connection) {
      await initDB();
    }

    const [result] = await connection.execute(
      'INSERT INTO sensor_data (temperature, humidity, latitude, longitude, blood_product) VALUES (?, ?, ?, ?, ?)',
      [
        data.temperature,
        data.humidity,
        data.location.lat,
        data.location.lng,
        data.bloodProduct
      ]
    );

    return result;
  } catch (error) {
    console.error('Error logging sensor data:', error);
    return null;
  }
}
