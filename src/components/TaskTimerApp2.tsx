import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import HeaderSection from "./HeaderSection";
import Stopwatch from "./Stopwatch";
import CountdownTimer from "./CountdownTimer";
import "./TaskTimerApp.css";

const TaskTimerApp: React.FC = () => {

    return (
        <div className="task-timer-container" style={{ aspectRatio: "16 / 9", maxWidth: "100vw", margin: "auto" }}>
            <HeaderSection />
            <Stopwatch />
            <CountdownTimer />
        </div>
    );
};

export default TaskTimerApp;
