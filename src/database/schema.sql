-- Create database
CREATE DATABASE IF NOT EXISTS smart_blood_box;
USE smart_blood_box;

-- Create readings table
CREATE TABLE IF NOT EXISTS readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    blood_product ENUM('whole_blood', 'red_blood_cells', 'platelets', 'plasma', 'testing'),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Commands to display data
-- Display all readings
SELECT * FROM readings;

-- Display latest reading
SELECT * FROM readings ORDER BY timestamp DESC LIMIT 1;

-- Display readings from last 24 hours
SELECT * FROM readings 
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY timestamp DESC;

-- Display average temperature and humidity by blood product
SELECT 
    blood_product,
    AVG(temperature) as avg_temperature,
    AVG(humidity) as avg_humidity,
    COUNT(*) as total_readings
FROM readings
GROUP BY blood_product;
