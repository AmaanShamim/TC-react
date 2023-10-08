import { useState } from "react";
import breakSoundFile from "./alarm.mp3";
import "./App.css";
import { isDisabled } from "@testing-library/user-event/dist/utils";

function App() {
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
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
      if (
        (breakTime <= 60 && amount < 0) ||
        (breakTime >= 3600 && amount > 0)
      ) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (
        (sessionTime <= 60 && amount < 0) ||
        (sessionTime >= 3600 && amount > 0)
      ) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const playPause = () => {
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

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    playPause();
  };

  return (
    <div
      style={{
        margin: "0 200px",
      }}
    >
      <div>
        <Length
          titleid={"break-label"}
          title={"break length"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          // formatTime={formatTime}
          timerOn={timerOn}
        />
        <Length
          titleid={"session-label"}
          title={"session length"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          // formatTime={formatTime}
          timerOn={timerOn}
        />
      </div>
      <h3 id="timer-label">{onBreak ? "break" : "session"} </h3>
      <h1 id="time-left">{formatTime(displayTime)}</h1>
      <button id="start_stop" onClick={playPause}>
        {timerOn ? "pause" : "play"}
      </button>
      <button id="reset" onClick={resetTime}>
        reset
      </button>
    </div>
  );
}

function Length({
  titleid,
  title,
  changeTime,
  type,
  time,
  formatTime,
  timerOn,
}) {
  return (
    <div>
      <h3 id={titleid}>{title}</h3>
      <div>
        <button
          id={`${type}-decrement`}
          disabled={timerOn ? true : false}
          onClick={() => changeTime(-60, type)}
        >
          -
        </button>
        <h3 id={`${type}-length`}>{time / 60}</h3>
        <button
          id={`${type}-increment`}
          disabled={timerOn ? true : false}
          onClick={() => changeTime(60, type)}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default App;
