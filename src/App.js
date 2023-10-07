import { useState } from "react";
import breakSoundFile from "./alarm.mp3";
import "./App.css";

function App() {
  const [displayTime, setDisplayTime] = useState(5);
  const [breakTime, setBreakTime] = useState(3);
  const [sessionTime, setSessionTime] = useState(5);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const breakAudio = new Audio(breakSoundFile);

  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    if (!timerOn) {
      let countdown = displayTime;
      let currentOnBreak = onBreak;
      const updateTimer = () => {
        if (countdown <= 0) {
          playBreakSound();
          currentOnBreak = !currentOnBreak;
          setOnBreak(currentOnBreak);
          countdown = currentOnBreak ? breakTime : sessionTime;
        }
        setDisplayTime(countdown);
        countdown -= 1;
      };
      updateTimer();
      const intervalId = setInterval(updateTimer, 1000);
      localStorage.setItem("interval-id", intervalId.toString());
    } else {
      clearInterval(parseInt(localStorage.getItem("interval-id")));
    }
    setTimerOn(!timerOn);
  };

  console.log(onBreak);

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };
  return (
    <div
      style={{
        margin: "0 200px",
      }}
    >
      <div>
        <Length
          title={"break length"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
        />
        <Length
          title={"session length"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
        />
      </div>
      <h3>{onBreak ? "break" : "session"} </h3>
      <h1>{formatTime(displayTime)}</h1>
      <button onClick={controlTime}>{timerOn ? "pause" : "play"}</button>
      <button onClick={resetTime}>reset</button>
    </div>
  );
}

function Length({ title, changeTime, type, time, formatTime }) {
  return (
    <div>
      <h3>{title}</h3>
      <div>
        <button onClick={() => changeTime(-60, type)}>-</button>
        <h3>{formatTime(time)}</h3>
        <button onClick={() => changeTime(60, type)}>+</button>
      </div>
    </div>
  );
}

export default App;
