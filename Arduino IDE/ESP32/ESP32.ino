#include <ArduinoJson.h>
#include <DHT.h>

// Pin definitions
#define DHTPIN 14
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// Previous values and thresholds
float lastTemp = 0;
float lastHum = 0;
bool firstReading = true;
unsigned long lastSentMillis = 0;
const float TEMP_THRESHOLD = 0.5;  // 0.5°C change
const float HUM_THRESHOLD = 1.0;   // 1% change
const unsigned long FORCE_UPDATE_INTERVAL = 5000;  // Force update every 5 seconds

void setup() {
  Serial.begin(115200);
  dht.begin();
  delay(2000);
  Serial.println("DHT22 Test Program");
  Serial.println("==================");
}

bool isSignificantChange(float newVal, float oldVal, float threshold) {
  return abs(newVal - oldVal) >= threshold;
}

void sendData(float temperature, float humidity) {
  // Create and send JSON
  StaticJsonDocument<200> doc;
  doc["marker"] = "SBB_DATA";
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["location"]["lat"] = 0;
  doc["location"]["lng"] = 0;

  Serial.print("###");
  serializeJson(doc, Serial);
  Serial.println("$$$");
  
  // Update last sent time
  lastSentMillis = millis();
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

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
    sendData(temperature, humidity);
    lastTemp = temperature;
    lastHum = humidity;
    firstReading = false;
  }
  // Send if significant change or forced update interval
  else if (isSignificantChange(temperature, lastTemp, TEMP_THRESHOLD) ||
           isSignificantChange(humidity, lastHum, HUM_THRESHOLD) ||
           (currentMillis - lastSentMillis >= FORCE_UPDATE_INTERVAL)) {
    
    if (currentMillis - lastSentMillis >= FORCE_UPDATE_INTERVAL) {
      Serial.println("Forcing update after interval...");
    } else {
      Serial.println("Significant change detected, sending update...");
    }
    
    sendData(temperature, humidity);
    lastTemp = temperature;
    lastHum = humidity;
  } else {
    Serial.println("No significant change, skipping update.");
    Serial.print("Current Temp: ");
    Serial.print(temperature);
    Serial.print("°C, Last Sent: ");
    Serial.print(lastTemp);
    Serial.println("°C");
  }

  delay(2000);
}