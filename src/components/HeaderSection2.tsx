import React, { useEffect, useState } from "react";
import "./HeaderSection.css";

interface HeaderSectionProps {
    selectedMode: string;
    setSelectedMode: (mode: string) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ selectedMode, setSelectedMode }) => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [taskName, setTaskName] = useState("My Task");
    const [isEditing, setIsEditing] = useState(false);
    const [taskHistory, setTaskHistory] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setDate(now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
            setTime(now.toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        if (taskName.trim()) {
            const endTime = Date.now();
            if (startTime) {
                const spent = Math.floor((endTime - startTime) / 1000);
                const h = Math.floor(spent / 3600);
                const m = Math.floor((spent % 3600) / 60);
                const s = spent % 60;
                const spentTime = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
                    .toString()
                    .padStart(2, "0")}`;
                setTaskHistory((prev) => [...prev, `${taskName} - ${spentTime}`]);
            }
            setStartTime(Date.now());
        }
    };

    return (
        <div className="header-section">
            <div className="row top-row">
                <div className="date">{date}</div>
                <div className="task">
                    {isEditing ? (
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            onBlur={handleSaveClick}
                            autoFocus
                        />
                    ) : (
                        <>
                            <span>{taskName}</span>
                            <button onClick={handleEditClick} className="edit-button">✏️</button>
                        </>
                    )}
                </div>
                <div className="time">{time}</div>
            </div>

            <div className="row mode-buttons">
                <button
                    className={selectedMode === "stopwatch" ? "active" : ""}
                    onClick={() => setSelectedMode("stopwatch")}
                >
                    Stopwatch
                </button>
                <button
                    className={selectedMode === "countdown" ? "active" : ""}
                    onClick={() => setSelectedMode("countdown")}
                >
                    Countdown
                </button>
            </div>

            <div className="row task-history">
                <h3>Task History</h3>
                <ul>
                    {taskHistory.map((task, index) => (
                        <li key={index}>{task}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HeaderSection;
