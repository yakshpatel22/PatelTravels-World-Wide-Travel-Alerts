import React from "react";
import "./trafficlight.css";
import TrafficLight from "./trafficlight.jsx";

const Street = () => {
  return (
    <div>
      <p style={{ fontWeight: "bold", textAlign: "center" }}>Lab 17</p>
      <div className="flex-container">
        <TrafficLight street="Yaksh" />
        <TrafficLight street="Patel" />
        <TrafficLight street="Info3139" />
      </div>
    </div>
  );
};

export default Street;
