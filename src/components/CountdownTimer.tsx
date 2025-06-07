import React, { useEffect, useRef, useState } from "react";
import "./TaskTimerApp.css";

const CountdownTimer: React.FC = () => {

    const [countdownTime, setCountdownTime] = useState(0);
    const [countdownRunning, setCountdownRunning] = useState(false);
    const [inputCountdown, setInputCountdown] = useState(0);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (countdownRunning && countdownTime > 0) {
            countdownRef.current = setInterval(() => {
                setCountdownTime((prev) => {
                    if (prev <= 1000) {
                        setCountdownRunning(false);
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);
        } else if (!countdownRunning && countdownRef.current) {
            clearInterval(countdownRef.current);
        }

        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [countdownRunning]);

    const formatCountdown = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const hrs = Math.floor(mins / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, "0")}:${(mins % 60).toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const startCountdown = () => {
        setCountdownTime(inputCountdown * 1000);
        setCountdownRunning(true);
    };

    return (
        <div className="countdown-section">
            <h3>Countdown Timer</h3>
            <input
                type="number"
                value={inputCountdown}
                onChange={(e) => setInputCountdown(Number(e.target.value))}
                placeholder="Enter seconds"
            />
            <button onClick={startCountdown}>Start Countdown</button>
            <div className="countdown-display">{formatCountdown(countdownTime)}</div>
        </div>
    );
};

export default CountdownTimer;
