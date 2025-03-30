#include <ArduinoJson.h>
#include <DHT.h>
#include <TinyGPS++.h>

// Pin definitions
#define DHTPIN 14
#define DHTTYPE DHT11
#define GPS_RX 16  // GPS RX pin connected to ESP32 TX2
#define GPS_TX 17  // GPS TX pin connected to ESP32 RX2

DHT dht(DHTPIN, DHTTYPE);
TinyGPSPlus gps;

// Previous values and thresholds
float lastTemp = 0;
float lastHum = 0;
float lastLat = 0;
float lastLng = 0;
bool firstReading = true;
unsigned long lastSentMillis = 0;
const float TEMP_THRESHOLD = 0.5;  // 0.5°C change
const float HUM_THRESHOLD = 1.0;   // 1% change
const float GPS_THRESHOLD = 0.0001; // Approximately 10 meters
const unsigned long FORCE_UPDATE_INTERVAL = 5000;  // Force update every 5 seconds

void setup() {
  Serial.begin(115200);   // Main serial for USB communication
  Serial2.begin(9600, SERIAL_8N1, GPS_RX, GPS_TX); // GPS serial
  dht.begin();
  delay(2000);
  Serial.println("Smart Blood Box Monitoring System");
  Serial.println("================================");
}

bool isSignificantChange(float newVal, float oldVal, float threshold) {
  return abs(newVal - oldVal) >= threshold;
}

bool isGPSValid() {
  return gps.location.isValid() && 
         gps.location.age() < 3000 && // Data not older than 3 seconds
         gps.satellites.value() >= 3;  // At least 3 satellites
}

void sendData(float temperature, float humidity, float latitude, float longitude) {
  // Create and send JSON
  StaticJsonDocument<200> doc;
  doc["marker"] = "SBB_DATA";
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["location"]["lat"] = latitude;
  doc["location"]["lng"] = longitude;
  doc["satellites"] = gps.satellites.value();

  Serial.print("###");
  serializeJson(doc, Serial);
  Serial.println("$$$");
  
  // Update last sent time
  lastSentMillis = millis();
}

void loop() {
  // Update GPS while available
  while (Serial2.available() > 0) {
    gps.encode(Serial2.read());
  }

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  float latitude = gps.location.lat();
  float longitude = gps.location.lng();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    delay(2000);
    return;
  }

  // Current time
  unsigned long currentMillis = millis();
  
  // Always send first reading
  if (firstReading) {
    Serial.println("Sending initial reading...");
    sendData(temperature, humidity, latitude, longitude);
    lastTemp = temperature;
    lastHum = humidity;
    lastLat = latitude;
    lastLng = longitude;
    firstReading = false;
  }
  // Send if significant change or forced update interval
  else if (isSignificantChange(temperature, lastTemp, TEMP_THRESHOLD) ||
           isSignificantChange(humidity, lastHum, HUM_THRESHOLD) ||
           isSignificantChange(latitude, lastLat, GPS_THRESHOLD) ||
           isSignificantChange(longitude, lastLng, GPS_THRESHOLD) ||
           (currentMillis - lastSentMillis >= FORCE_UPDATE_INTERVAL)) {
    
    if (currentMillis - lastSentMillis >= FORCE_UPDATE_INTERVAL) {
      Serial.println("Forcing update after interval...");
    } else {
      Serial.println("Significant change detected, sending update...");
    }
    
    sendData(temperature, humidity, latitude, longitude);
    lastTemp = temperature;
    lastHum = humidity;
    lastLat = latitude;
    lastLng = longitude;
  } else {
    Serial.println("No significant change, skipping update.");
    Serial.print("Current Temp: ");
    Serial.print(temperature);
    Serial.print("°C, Last Sent: ");
    Serial.print(lastTemp);
    Serial.println("°C");
  }

  delay(2000);
