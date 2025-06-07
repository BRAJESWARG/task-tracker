import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import './TaskTimerApp.css';

const TaskTimerApp: React.FC = () => {
  const [taskName, setTaskName] = useState("Task checkbox");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [milliseconds, setMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<string[]>([]);
  const [hasStopped, setHasStopped] = useState(false);
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

  const handleTaskNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTaskName(e.target.value);
  };

  const handleStart = () => setIsRunning(true);

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
    <div className="w-[16rem] min-h-[16rem] border-2 border-red-400 p-2 font-sans">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs">
          <div>Date: {getDate(currentTime)}</div>
          <div>Day: {getDayName(currentTime)}</div>
        </div>
        <input
          className="text-center border border-gray-400 text-sm px-1 py-0.5"
          type="text"
          value={taskName}
          onChange={handleTaskNameChange}
        />
        <div className="text-xs text-right">
          <div>Time</div>
          <div className="text-green-600">{isRunning ? "Ongoing" : "Stopped"}</div>
        </div>
      </div>
      <div className="border border-blue-400 text-center text-xl py-4 mb-2">
        {formatTime(milliseconds)}
      </div>
      <div className="flex justify-between text-xs mb-2">
        <button className="border px-2 py-1" onClick={handleStart}>Start</button>
        <button className="border px-2 py-1" onClick={handleStop}>Stop</button>
        {!hasStopped ? (
          <button className="border px-2 py-1" onClick={handleLap}>Lap</button>
        ) : (
          <button className="border px-2 py-1" onClick={handleReset}>Reset</button>
        )}
      </div>
      {laps.length > 0 && (
        <div className="text-xs mt-2">
          <strong>Laps:</strong>
          <ul className="list-decimal ml-4">
            {laps.map((lap, index) => (
              <li key={index}>{lap}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskTimerApp;
