import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

export default (url: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(url, {
      query: {
        token: localStorage.getItem("token")
      }
    });

    setSocket(newSocket);

    return () => { newSocket.disconnect() };
  }, [url]);

  return socket;
};
