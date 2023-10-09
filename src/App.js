import { useState, useEffect } from "react";
import breakSoundFile from "./Assests/alarm.mp3";
import "./App.css";

import {
  AiFillPlusCircle,
  AiFillMinusCircle,
  AiFillGithub,
} from "react-icons/ai";
import { BsFillPauseCircleFill, BsFillPlayCircleFill } from "react-icons/bs";
import { RiRefreshFill } from "react-icons/ri";

function App() {
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const breakAudio = new Audio(breakSoundFile);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString(undefined, options);

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

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
        (breakTime >= 3600 && amount > 0) ||
        timerOn ||
        onBreak
      ) {
        return;
      }
      if (timerOn) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (
        (sessionTime <= 60 && amount < 0) ||
        (sessionTime >= 3600 && amount > 0) ||
        timerOn ||
        onBreak
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
    setOnBreak(false);
    if (timerOn) {
      playPause();
    }
  };

  const playPauseStyle = {
    fontSize: "30px",
    color: "#ca1b1b",
    cursor: "pointer",
  };

  return (
    <div className="container">
      <div className="clock">
        <div className="controller">
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
        <div className="display">
          <h3 id="timer-label" style={onBreak ? { color: "#ca1b1b" } : {}}>
            {onBreak ? "break !" : "session"}{" "}
          </h3>
          <p id="time-left">{formatTime(displayTime)}</p>
          <div className="display-btns">
            {timerOn ? (
              <BsFillPauseCircleFill
                style={playPauseStyle}
                id="start_stop"
                onClick={playPause}
              />
            ) : (
              <BsFillPlayCircleFill
                style={playPauseStyle}
                id="start_stop"
                onClick={playPause}
              />
            )}
            <RiRefreshFill
              id="reset"
              onClick={resetTime}
              style={{ fontSize: "30px", cursor: "pointer", color: "green" }}
            />
          </div>
        </div>
        <div className="date">
          <p>{formattedDate} </p>
        </div>
      </div>
      <div className="credit">
        coded & designed by amaan shamim khan
        <a rel="noreferrer" href="https://github.com/AmaanShamim/TC-react" target="_blank">
          <AiFillGithub id="git" />
        </a>
      </div>
    </div>
  );
}

function Length({
  titleid,
  title,
  changeTime,
  type,
  time,
  // formatTime,
  timerOn,
}) {
  return (
    <div className="contain-control">
      <h3 id={titleid}>{title}</h3>
      <div className="control-btns">
        <AiFillMinusCircle
          id={`${type}-decrement`}
          onClick={() => changeTime(-60, type)}
        />
        <p id={`${type}-length`}>{time / 60}</p>
        <AiFillPlusCircle
          id={`${type}-increment`}
          onClick={() => changeTime(60, type)}
        />
      </div>
    </div>
  );
}

export default App;
