import { useEffect } from 'react';
import { useDevice } from '../context/DeviceContext';

export function Cleanup() {
  const { isConnected, reader, port, setIsConnected, setReader, setPort } = useDevice();

  useEffect(() => {
    const cleanup = async () => {
      if (isConnected) {
        if (reader) {
          await reader.cancel();
          setReader(null);
        }
        if (port) {
          await port.close();
          setPort(null);
        }
        setIsConnected(false);
      }
    };

    window.addEventListener('beforeunload', cleanup);
    return () => {
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, [isConnected, reader, port]);

  return null;
}