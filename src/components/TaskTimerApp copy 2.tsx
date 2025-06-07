import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import "./TaskTimerApp.css";

const TaskTimerApp: React.FC = () => {

    const [taskName, setTaskName] = useState("Task checkbox");
    const [taskHistory, setTaskHistory] = useState<string[]>([]);
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [milliseconds, setMilliseconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<string[]>([]);
    const [hasStopped, setHasStopped] = useState(false);
    const [is24HourFormat, setIs24HourFormat] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timeInterval);
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setMilliseconds((prev) => prev + 10);
            }, 10);
            setHasStopped(false);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const hrs = Math.floor(mins / 60);
        const secs = totalSeconds % 60;
        const millis = ms % 1000;
        return `${hrs.toString().padStart(2, "0")}:${(mins % 60).toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${Math.floor(millis / 10).toString().padStart(2, "0")}`;
    };

    const getDayName = (date: Date): string =>
        date.toLocaleDateString("en-US", { weekday: "long" });

    const getDate = (date: Date): string => date.toLocaleDateString();

    const getTimeString = (date: Date): string =>
        date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: !is24HourFormat
        });

    const handleTaskNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setTaskName(e.target.value);
    };

    const saveTaskName = () => {
        setTaskHistory(prev => [...prev, taskName]);
        setIsEditingTask(false);
    };

    const handleStart = () => {
        setIsRunning(true);
        setHasStopped(false);
    };

    const handleStop = () => {
        setIsRunning(false);
        setHasStopped(true);
    };

    const handleReset = () => {
        setIsRunning(false);
        setMilliseconds(0);
        setLaps([]);
        setHasStopped(false);
    };

    const handleLap = () => {
        if (isRunning) setLaps((prev) => [...prev, formatTime(milliseconds)]);
    };

    const toggleTimeFormat = () => setIs24HourFormat(prev => !prev);

    return (
        <div className="task-timer-container" style={{ aspectRatio: "16 / 9", maxWidth: "100vw", margin: "auto" }}>
            <div className="header">
                <div className="date-info">
                    <div>Date: {getDate(currentTime)}</div>
                    <div>Day: {getDayName(currentTime)}</div>
                </div>

                <div className="task-section">
                    {isEditingTask ? (
                        <div className="task-edit">
                            <input
                                type="text"
                                value={taskName}
                                onChange={handleTaskNameChange}
                            />
                            <button onClick={saveTaskName}>Save</button>
                        </div>
                    ) : (
                        <div className="task-display">
                            <span>{taskName}</span>
                            <button onClick={() => setIsEditingTask(true)}>Edit</button>
                        </div>
                    )}
                </div>

                <div className="time-info">
                    <div className="time-label">
                        <span>Time</span>
                        <button onClick={toggleTimeFormat} className="toggle-button">
                            {is24HourFormat ? "12h" : "24h"}
                        </button>
                    </div>
                    <div className="time-value">{getTimeString(currentTime)}</div>
                </div>
            </div>

            <div className="timer-box">
                Timer
                <div>{formatTime(milliseconds)}</div>
            </div>

            <div className="button-row">
                <button
                    onClick={isRunning ? handleStop : hasStopped ? handleStart : handleStart}
                    className={isRunning ? "button-stop" : hasStopped ? "button-resume" : "button-start"}
                >
                    {isRunning ? "Stop" : hasStopped ? "Resume" : "Start"}
                </button>
                {hasStopped ? (
                    <button onClick={handleReset} className="button-reset">Reset</button>
                ) : (
                    <button
                        onClick={handleLap}
                        disabled={!isRunning}
                        className="button-lap"
                    >
                        Lap
                    </button>
                )}
            </div>

            {laps.length > 0 && (
                <div className="laps">
                    <strong>Laps:</strong>
                    <ul>
                        {laps.map((lap, index) => (
                            <li key={index}>{lap}</li>
                        ))}
                    </ul>
                </div>
            )}

            {taskHistory.length > 0 && (
                <div className="history">
                    <strong>Task History:</strong>
                    <ul>
                        {taskHistory.map((task, index) => (
                            <li key={index}>{task}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TaskTimerApp;
