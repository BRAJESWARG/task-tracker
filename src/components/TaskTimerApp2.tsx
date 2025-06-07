import React, { useState } from "react";
import HeaderSection from "./HeaderSection";
import Stopwatch from "./Stopwatch";
import CountdownTimer from "./CountdownTimer";
import "./TaskTimerApp.css";

const TaskTimerApp: React.FC = () => {
    const [showStopwatch, setShowStopwatch] = useState(true);

    return (
        <div className="task-timer-container" style={{ aspectRatio: "16 / 9", maxWidth: "100vw", margin: "auto" }}>
            <HeaderSection
                onSelectStopwatch={() => setShowStopwatch(true)}
                onSelectCountdown={() => setShowStopwatch(false)}
            />
            {showStopwatch ? <Stopwatch /> : <CountdownTimer />}
        </div>
    );
};

export default TaskTimerApp;
