import React from "react";
import "../App.css";
const ChatMsg = (props) => {
  console.log(props);
  return (
    <div
      className="scenario-message"
      style={{ backgroundColor: props.message.color, textAlign: "left" }}
    >
      <span className="timestamp">
        {props.message.userName} Says @{props.message.timestamp}:
      </span>
      <br />
      {props.message.message}
      {console.log(props.message)}
    </div>
  );
};
export default ChatMsg;
