import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import cryptoRandomString from 'crypto-random-string';

export default (url: string, type: string = "AUTH"): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = type === 'AUTH' ? io(url, {
      query: {
        token: localStorage.getItem("token")
      }
    }) : io(url, {
      query: {
        tempToken: type
      }
    })

    setSocket(newSocket);

    return () => { newSocket.disconnect() };
  }, [url]);

  return socket;
};
