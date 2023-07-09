import React, { useEffect, useState } from 'react';

interface ScoreboardProps {
    endpoint: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ endpoint }) => {
    return (
        <div>
            {JSON.stringify(endpoint)}
        </div>
    );
}

export default Scoreboard;
