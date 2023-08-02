import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import App from "./App";
import { ConfigData } from "./config_interface";

const ENDPOINT = "http://localhost:25566/"; // replace with your server's address and port

console.log(`${process.env.REACT_APP_PUBLIC_URL}`);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

function AppWrapper() {
    const [appConfiguration, setAppConfiguration] = useState<ConfigData | null>(null);

    useEffect(() => {
        axios.get(ENDPOINT)
            .then((response: any) => {
                console.log('Response:', response.data);
                // Assuming the response data is of type ConfigData, update the state
                setAppConfiguration(response.data);
            })
            .catch((error: any) => {
                console.error('Error:', error.message);
            });
    }, []);

    // Render the App component only when appConfiguration is available
    if (appConfiguration) {
        return (
            <React.StrictMode>
                <App appConfiguration={appConfiguration} />
            </React.StrictMode>
        );
    } else {
        // Render a loading or fallback UI while waiting for the response
        return <div>Loading...</div>;
    }
}

root.render(<AppWrapper />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
