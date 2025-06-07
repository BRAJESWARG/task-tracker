import React, { useEffect, useState, ChangeEvent } from "react";
import "./HeaderSection.css";

interface HeaderSectionProps {
    onSelectStopwatch: () => void;
    onSelectCountdown: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
    onSelectStopwatch,
    onSelectCountdown,
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [taskName, setTaskName] = useState("Task checkbox");
    const [taskHistory, setTaskHistory] = useState<string[]>([]);
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [is24HourFormat, setIs24HourFormat] = useState(false);

    useEffect(() => {
        const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timeInterval);
    }, []);

    const getDayName = (date: Date): string =>
        date.toLocaleDateString("en-US", { weekday: "long" });

    const getDate = (date: Date): string => date.toLocaleDateString();

    const getTimeString = (date: Date): string =>
        date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: !is24HourFormat,
        });

    const handleTaskNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setTaskName(e.target.value);
    };

    const saveTaskName = () => {
        setTaskHistory((prev) => [...prev, taskName]);
        setIsEditingTask(false);
    };

    const toggleTimeFormat = () => setIs24HourFormat((prev) => !prev);

    return (
        // <div className="header">
        <div className="header-section">
            <div className="row top-row">
                <div className="date-info">
                    <div>Date: {getDate(currentTime)}</div>
                    <div>Day: {getDayName(currentTime)}</div>
                </div>

                <div className="task-section">
                    {isEditingTask ? (
                        <div className="task-edit">
                            <input type="text" value={taskName} onChange={handleTaskNameChange} />
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
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={is24HourFormat}
                                onChange={toggleTimeFormat}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="time-value">{getTimeString(currentTime)}</div>
                </div>
            </div>

            <div className="row mode-buttons">
                {/* <div className="mode-buttons"> */}
                <button onClick={onSelectStopwatch} className="mode-btn">
                    Stopwatch
                </button>
                <button onClick={onSelectCountdown} className="mode-btn">
                    Countdown
                </button>
            </div>

            <div className="row task-history">
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
        </div>
    );
};

export default HeaderSection;
