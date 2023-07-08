import React, { useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
const ENDPOINT = "http://localhost:5001"; // replace with your server's address and port

const App: React.FC = () => {
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    let socket: Socket;

    // Connect and setup event listener
    socket = io(ENDPOINT);
    socket.on("data", (data: any) => {
      setResponse(data);
    });

    // Cleanup the effect
    return () => {
      // Before the component is destroyed
      // we disconnect the socket
      socket.disconnect();
    }
  }, []);

  console.log(response);
  return (
      <div>
        {JSON.stringify(response)}
      </div>
  );
}

export default App;
