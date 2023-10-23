import React, { useEffect, useState } from "react";
import "./trafficlight.css";
import io from "socket.io-client";

const Trafficlight = (props) => {
  const [color, setColor] = useState("red");
  const [status, setStatus] = useState("connecting...");

  //connect to server locally

  useEffect(() => {
    const socket = io.connect();
    // const socket = io.connect("localhost:5000", {
    //   forceNew: true,
    //   transports: ["websocket"],
    //   autoConnect: true,
    //   reconnection: false,
    //   timeout: 5000,
    // });
    socket.on("connect", () => {
      setStatus("connected");
      socket.emit("join", props.street);
    });

    socket.on("turnLampOn", (lampData) => {
      socket.disconnect();
      handleTurnLampOn(lampData);
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  // lamp handler code, lamp data from server
  const handleTurnLampOn = async (lampData) => {
    while (true) {
      // loop until browser closes
      // wait on current colour, then set next color
      await waitSomeSeconds(lampData.green, "green");
      await waitSomeSeconds(lampData.yellow, "yellow");
      await waitSomeSeconds(lampData.red, "red");
      //green and yellow lamps go here
    }
  };

  const waitSomeSeconds = (waitTime, nextColorToIlluminate) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setColor(nextColorToIlluminate); // update state variable
        resolve();
      }, waitTime);
    });
  };

  const getStateColor = (c) => (color === c ? color : "white");

  return (
    <div>
      <p>{status}</p>
      <div className="light">
        <div
          className="lamp"
          style={{ backgroundColor: getStateColor("red"), margin: ".5rem" }}
        />
        <div
          className="lamp"
          style={{ backgroundColor: getStateColor("yellow"), margin: ".5rem" }}
        />
        <div
          className="lamp"
          style={{ backgroundColor: getStateColor("green"), margin: ".5rem" }}
        />
        <div style={{ textAlign: "center", fontName: "Helvetica" }}>
          {props.street}
        </div>
      </div>
    </div>
  );
};

export default Trafficlight;
