class ESP32Service {
  constructor() {
    this.port = null;
    this.reader = null;
    this.onDataCallback = null;
  }

  async connect() {
    try {
      // Request a port and open a connection
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 115200 });

      const decoder = new TextDecoderStream();
      this.port.readable.pipeTo(decoder.writable);
      this.reader = decoder.readable.getReader();

      console.log('Serial port opened');

      // Read data from the serial port
      this.readLoop();
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  async readLoop() {
    try {
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) {
          break; // Reader has been closed
        }
        if (this.onDataCallback) {
          try {
            const parsedData = JSON.parse(value);
            this.onDataCallback(parsedData);
          } catch (e) {
            console.error('Error parsing data:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error reading data:', error);
    }
  }

  onData(callback) {
    this.onDataCallback = callback;
  }

  async disconnect() {
    if (this.reader) {
      await this.reader.cancel();
      this.reader = null;
    }
    if (this.port) {
      await this.port.close();
      this.port = null;
    }
    console.log('Serial port closed');
  }
}

export const esp32Service = new ESP32Service();