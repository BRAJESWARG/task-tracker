import React, { useEffect, useState } from "react";
import "./CountdownTimer.css";

const CountdownTimer: React.FC = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [initialTime, setInitialTime] = useState(0);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (running && totalTime > 0) {
            timer = setInterval(() => {
                setTotalTime((prev) => {
                    if (prev <= 1000) {
                        clearInterval(timer!);
                        setRunning(false);
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [running, totalTime]);

    const handleStart = () => {
        const timeInMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
        setInitialTime(timeInMs);
        setTotalTime(timeInMs);
        setEndTime(new Date(Date.now() + timeInMs));
        setRunning(true);
        setPaused(false);
    };

    const handleStop = () => {
        setRunning(false);
        setPaused(true);
    };

    const handleResume = () => {
        setRunning(true);
        setPaused(false);
        setEndTime(new Date(Date.now() + totalTime));
    };

    const handleReset = () => {
        setRunning(false);
        setPaused(false);
        setTotalTime(0);
        setInitialTime(0);
        setEndTime(null);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
    };

    const formatTime = (time: number) => {
        const sec = Math.floor((time / 1000) % 60);
        const min = Math.floor((time / 60000) % 60);
        const hr = Math.floor(time / 3600000);
        return `${hr.toString().padStart(2, "0")}:${min
            .toString()
            .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    };

    const isTimeSet = hours > 0 || minutes > 0 || seconds > 0;

    return (
        <div className="countdown-timer">
            <h2>Countdown Timer</h2>

            {!running && !paused && (
                <div className="time-selectors">
                    <select value={hours} onChange={(e) => setHours(Number(e.target.value))}>
                        {[...Array(24)].map((_, i) => (
                            <option key={i} value={i}>
                                {i.toString().padStart(2, "0")}
                            </option>
                        ))}
                    </select>
                    <span>:</span>
                    <select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
                        {[...Array(60)].map((_, i) => (
                            <option key={i} value={i}>
                                {i.toString().padStart(2, "0")}
                            </option>
                        ))}
                    </select>
                    <span>:</span>
                    <select value={seconds} onChange={(e) => setSeconds(Number(e.target.value))}>
                        {[...Array(60)].map((_, i) => (
                            <option key={i} value={i}>
                                {i.toString().padStart(2, "0")}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="button-row">
                {!running && !paused && (
                    <button onClick={handleStart} disabled={!isTimeSet}>
                        Start
                    </button>
                )}
                {running && (
                    <>
                        <button onClick={handleStop}>Stop</button>
                        <button onClick={handleReset}>Reset</button>
                    </>
                )}
                {!running && paused && (
                    <>
                        <button onClick={handleResume}>Resume</button>
                        <button onClick={handleReset}>Reset</button>
                    </>
                )}
            </div>

            <div className="display">{formatTime(totalTime)}</div>

            {initialTime > 0 && !paused && (
                <div className="countdown-info">
                    <p>Total Duration: {formatTime(initialTime)}</p>
                    {endTime && (
                        <p>
                            Ends At: {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CountdownTimer;
