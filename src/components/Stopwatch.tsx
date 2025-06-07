import React, { useEffect, useRef, useState } from "react";
import "./TaskTimerApp.css";

const Stopwatch: React.FC = () => {

    const [milliseconds, setMilliseconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<string[]>([]);
    const [hasStopped, setHasStopped] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
        return `${hrs.toString().padStart(2, "0")}:${(mins % 60)
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${Math.floor(
                millis / 10
            )
                .toString()
                .padStart(2, "0")}`;
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

    return (
        <>
            <div className="timer-box">
                Stopwatch
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
                    <button onClick={handleReset} className="button-reset">
                        Reset
                    </button>
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
        </>
    );
};

export default Stopwatch;
