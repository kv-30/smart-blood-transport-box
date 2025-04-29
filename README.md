# Smart Blood Transport Box - Real-time Medical Transport Monitoring System

## Overview
Smart Blood Box is a web-based monitoring system designed for medical transport applications. It provides real-time tracking of temperature, humidity, and location data for sensitive medical supplies during transport using an ESP32-based sensor system.

## Features
- Real-time temperature and humidity monitoring
- GPS location tracking
- Dark/Light mode support
- Responsive design for all devices
- Web Serial API integration for direct device communication
- Interactive data visualization
- Automatic data updates
- Error handling and recovery

## Tech Stack
### Frontend
- React.js
- React Router DOM
- CSS3 with modern animations
- Web Serial API

### Hardware
- ESP32 microcontroller
- DHT11 temperature/humidity sensor
- GPS module
- USB connectivity

## Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Modern web browser (Chrome/Edge) with Web Serial API support
- Arduino IDE (for ESP32 programming)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/smart-blood-box.git
cd smart-blood-box
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Arduino Setup
1. Open Arduino IDE
2. Install required libraries:
   - DHT sensor library -Adafruit
   - Tiny GPS plus-Mikal Hart
   - Tiny Gps-ESP32 - Mikal Hart
   - Arduino Json -Benoit Blanchon
3. Install the following Drivers:
   - CH340 
   - CP210x
4. Upload the provided Arduino code to ESP32

## Project Structure
```
smart-blood-box/
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # Reusable React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── styles/        # CSS styles
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
├── public/            # Public assets
└── server/            # Backend server files
```

## Usage

### 1. Connect Device
1. Power on the ESP32 device
2. Open the web application
3. Click "Connect Device"
4. Select the appropriate COM port
5. Wait for connection confirmation

### 2. Monitor Data
- View real-time temperature readings
- Monitor humidity levels
- Track device location (if GPS enabled)
- Check connection status and last update time

### 3. Dark Mode
- Toggle between light and dark modes using the theme switch
- System automatically remembers your preference

## Hardware Setup

### Components Required
- ESP32 Development Board
- DHT11 Temperature/Humidity Sensor
- GPS Module (optional)
- USB Cable
- 10K Resistor (for DHT22)

### Wiring Diagram
```
DHT11 Pin Layout:
VCC  → Vin
DATA → GPI14 (with 10K pullup)
GND  → GND
```

## Troubleshooting

### Common Issues
1. Connection Failures
   - Ensure Arduino Serial Monitor is closed
   - Check USB cable connection
   - Verify correct COM port selection

2. No Data Display
   - Check sensor connections
   - Verify Arduino code is uploaded
   - Check serial output format

3. Buffer Overrun
   - Refresh the page
   - Reconnect the device
   - Check Arduino transmission rate

### Error Messages
- "Web Serial API not supported": Use Chrome or Edge browser
- "Failed to read from DHT sensor": Check sensor connections
- "Buffer overrun": Disconnect and reconnect device

## Development

### Adding New Features
1. Create new components in `src/components`
2. Add styles in `src/styles`
3. Update routing in `App.jsx`
4. Test thoroughly

### Building for Production
```bash
npm run build
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## Contact
- LinkedIn: [Kaivalya Thakare](https://www.linkedin.com/in/kaivalya-thakare-9305b128b/)
- LinkedIn: [Sanskruti Divase](https://linkedin.com/in/sanskruti-divase-455a1529a/)
- LinkedIn: [Shubhada Shinde](https://www.linkedin.com/in/shubhada-shinde-074225323/)

## Acknowledgments
- React.js community
- Arduino community
- ESP32 developers


---

**Note**: This project requires a modern browser with Web Serial API support (Chrome/Edge) for device communication.


