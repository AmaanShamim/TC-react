import { useState, useEffect } from "react";
import breakSoundFile from "./Assests/alarm.mp3";
import "./App.css";

import {
  AiFillPlusCircle,
  AiFillMinusCircle,
  AiFillGithub,
  AiFillInfoCircle,
  AiFillCloseCircle,
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
  const [info, setInfo] = useState(false);
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
    <>
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
          <a
            rel="noreferrer"
            href="https://github.com/AmaanShamim/TC-react"
            target="_blank"
          >
            <AiFillGithub id="git" />
          </a>
        </div>
      </div>
      <div className="info-btn">
        <AiFillInfoCircle onClick={() => {setInfo(true)}} />
      </div>
      {info && (
        <div className="info-container">
          <Info setInfo={setInfo} />
        </div>
      )}
    </>
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

function Info({ setInfo }) {
  return (
    <>
      <div className="info-header">
        <h1>User Manual: Task Spinner</h1>
        <AiFillCloseCircle className="close-info-btn" onClick={() => {setInfo(false)}} />
      </div>
      <h2 className="heading2">Introduction</h2>
      <p className="info-para">
        Welcome to the User Manual for the Task Spinner, a versatile time
        management tool designed to boost productivity by making your work or
        study sessions more efficient and effective. This innovative device
        features three key components: Break Length, Session Length, and
        Display, each aimed at helping you optimize your time management for
        better results. Whether you're aiming for efficient work periods or
        well-deserved breaks, the Task Spinner will be your trusted companion in
        achieving your goals.
      </p>
      <h2 className="heading2">Getting Started</h2>
      <ul className="info-para">
        <li>Powering On: Press the play button to start.</li>
        <li>
          Period Indicator: The display also indicates whether the timer is in
          "Break" or "Session" mode.
        </li>
        <li>
          Initial Setup: Set your desired Break Length and Session Length by
          using the respective buttons. Use the Reset button to clear any
          previous settings.
        </li>
      </ul>
      <h2 className="heading2">Using the Timer</h2>
      <ul className="info-para">
        <li>
          Break Length Component: Adjust break duration with the buttons,
          displayed in real-time.
        </li>
        <li>
          Session Length Component: Customize session duration and view it on
          the display.
        </li>
        <li>Display Component: Shows countdown and session/break mode.</li>
        <li>
          Reset Button: It clears active session or break settings, returning
          the Task Spinner to its initial state.
        </li>
      </ul>
    </>
  );
}

export default App;
