function mapper(value, baseMin, baseMax, targetMin, targetMax) {
  return (
    (value - baseMin) * (targetMax - targetMin) / (baseMax - baseMin) +
    targetMin);

}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRad = (angleInDegrees - 90) * Math.PI / 180;

  return {
    x: centerX + radius * Math.cos(angleInRad),
    y: centerY + radius * Math.sin(angleInRad) };

}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
  "M",
  start.x,
  start.y,
  "A",
  radius,
  radius,
  0,
  largeArcFlag,
  0,
  end.x,
  end.y].
  join(" ");

  return d;
}

function SVGCircle({ arcAngle, pp }) {
  return (
    React.createElement("svg", { className: "svg-container" },
    pp &&
    React.createElement("path", {
      stroke: "#5a8d78",
      fill: "none",
      strokeWidth: "16",
      d: describeArc(125, 125, 100, 0, arcAngle) })));




}

function Ticker({ value, range, label, display, pp }) {
  let { max, min } = range;

  return (
    React.createElement("div", { className: "ticker-container" },
    React.createElement("div", { id: "time-left", className: "ticker-value" },
    display),

    React.createElement("div", { id: "timer-label", className: "ticker-label" },
    label),

    React.createElement(SVGCircle, { pp: pp, arcAngle: mapper(value, min, max, 0, 360) })));


}

function TimerControls({
  session,
  brake,
  updateSession,
  updateBrake,
  togglePP,
  pp,
  handleReset })
{
  return (
    React.createElement("div", { className: "controls-container" },
    React.createElement("div", { id: "session-cunt" },
    React.createElement("div", null,
    React.createElement("button", { id: "session-increment", onClick: updateSession.bind(null, 1) },
    React.createElement("i", { class: "fas fa-angle-up" })),

    React.createElement("button", { id: "session-decrement", onClick: updateSession.bind(null, -1) },
    React.createElement("i", { class: "fas fa-angle-down" }))),


    React.createElement("div", { id: "session-label" }, "Session length"),
    React.createElement("div", { id: "session-length" }, session)),

    React.createElement("div", { id: "break-cunt" },
    React.createElement("div", null,
    React.createElement("button", { id: "break-increment", onClick: updateBrake.bind(null, 1) },
    React.createElement("i", { class: "fas fa-angle-up" })),

    React.createElement("button", { id: "break-decrement", onClick: updateBrake.bind(null, -1) },
    React.createElement("i", { class: "fas fa-angle-down" }))),


    React.createElement("div", { id: "break-label" }, "Break Length"),
    React.createElement("div", { id: "break-length" }, brake)),

    React.createElement("div", { id: "play-pause" },
    pp ?
    React.createElement("div", null,
    React.createElement("button", { id: "start_stop", onClick: togglePP },
    React.createElement("i", { class: "fas fa-pause" }))) :



    React.createElement("div", null,
    React.createElement("button", { id: "start_stop", onClick: togglePP },
    React.createElement("i", { class: "fas fa-play" }))),



    React.createElement("div", null,
    React.createElement("button", { id: "reset", onClick: handleReset },
    React.createElement("i", { class: "fas fa-redo" }))))));





}

function formatTimer(seconds) {
  let secs = seconds % 60;
  secs = (secs + "").length == 2 ? secs : "0" + secs;
  let minutes = Math.floor(seconds / 60);
  minutes = (minutes + "").length == 2 ? minutes : "0" + minutes;
  return minutes + ":" + secs;
}

function Timer() {
  let [current, setCurrent] = React.useState(1500);
  let [session, setSession] = React.useState(1500);
  let [brake, setBrake] = React.useState(300);
  let [status, setStatus] = React.useState("Session");
  let [timerID, setTimer] = React.useState("");
  let [pp, setPP] = React.useState(false);

  function handleReset() {
    setStatus("Session");
    setPP(false);
    ap();
    setSession(1500);
    setBrake(300);
    setCurrent(session);
  }

  function updateSession(change) {
    change = change * 60;
    if (!pp)
    setSession((session) =>
    session + change < 60 ?
    60 :
    session + change > 3600 ?
    3600 :
    session + change);

  }

  function updateBrake(change) {
    change *= 60;
    if (!pp) {
      setBrake((brake) =>
      brake + change < 60 ? 60 : brake + change > 3600 ? 3600 : brake + change);

    }
  }

  function togglePP() {
    setPP(pp => !pp);
  }

  function ap() {
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  }

  function pnp() {
    const audio = document.getElementById("beep");
    audio.currentTime = 0;
    audio.play();
  }

  React.useEffect(() => {
    if (pp) {
      temp = setInterval(() => {
        setCurrent(current => current - 1);
      }, 1000);
      setTimer(temp);
    } else {
      clearInterval(timerID);
    }
  }, [pp]);

  React.useEffect(() => {
    if (current === 0 && status === "Session") {
      pnp();
      setStatus("Break");
      setCurrent(brake);
    } else if (current === 0 && status === "Break") {
      pnp();
      setStatus("Session");
      setCurrent(session);
    }
  });

  React.useEffect(() => {
    if (status === "Session") setCurrent(session);
  }, [session]);

  React.useEffect(() => {
    if (status === "Break") setCurrent(brake);
  }, [brake]);

  return (
    React.createElement("div", { className: "container" },
    React.createElement("audio", {
      id: "beep",
      src: "https://cdn.glitch.com/9f6b5e6b-e1e9-4b62-ade7-785077f08218%2Fbitch_banalo.mp3?v=1594956781262",
      type: "audio/mp3",
      hidden: true }),

    React.createElement(Ticker, {
      pp: pp,
      value: current,
      display: formatTimer(current),
      range: {
        max: status === "Session" ? session : brake,
        min: 0 },

      label: status }),

    React.createElement(TimerControls, {
      session: Math.floor(session / 60),
      brake: Math.floor(brake / 60),
      updateSession: updateSession,
      updateBrake: updateBrake,
      handleReset: handleReset,
      togglePP: togglePP,
      pp: pp })));



}

function App() {
  return React.createElement(Timer, null);
}

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));