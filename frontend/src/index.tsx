import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import App from "./App";
import { ConfigData } from "./config_interface";

const ENDPOINT = "http://localhost:25566/";
//this will remain the same for now, but will be changed to the server's address and port
//once I figure out how to fix this bootstrap paradox issue
//since I can't get the endpoint without the config, but I can't get the config without the endpoint

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
