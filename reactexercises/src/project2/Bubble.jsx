import { useEffect, useRef } from "react";
import { ListItem } from "@mui/material";
import Triangle from "./Triangle";
const Bubble = (props) => {
  const userRef = useRef(null);
  useEffect(() => {
    userRef.current.scrollIntoView();
  }, []);

  const alignBubble = props.isOwnMessage ? "right" : "left";
  const alignTriangle = props.isOwnMessage ? "auto 0 0 auto" : "0 auto auto 0";

  return (
    <ListItem ref={userRef} style={{ textAlign: alignBubble }}>
      <div
        className={`userBubble ${props.isOwnMessage ? "ownMessage" : ""}`}
        style={{ backgroundColor: props.message.color }}
      >
        <span className="timestamp">
          {props.message.from} Says @{props.message.timestamp}:
        </span>
        <br />
        <div>
          {props.message.chatName} {props.message.roomName}
          {props.message.text}
        </div>
      </div>
      <div
        style={{
          content: "",
          position: "absolute",
          bottom: "-2vh",
          left: props.isOwnMessage ? "calc(100% - 30px)" : 10,
          borderWidth: props.isOwnMessage ? "15px 15px 0" : "15px 15px 0 ",
          borderStyle: "solid",
          borderColor: `${props.message.color} transparent`,
        }}
      />
    </ListItem>
  );
};
export default Bubble;
