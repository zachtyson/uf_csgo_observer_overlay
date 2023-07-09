import React from 'react';

interface ScoreboardProps {
    data: any; // Update the type according to your data structure
}

const Scoreboard: React.FC<ScoreboardProps> = (props) => {
    const { data } = props; // Access the data prop

    // Use the data object in your component
    if(!data) return (<div>Loading...</div>);
    return (
        <div>
            {/* Render your Scoreboard component */}
        </div>
    );
}

export default Scoreboard;
