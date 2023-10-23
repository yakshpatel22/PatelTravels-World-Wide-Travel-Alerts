import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Button, TextField, Typography, AppBar, Toolbar } from "@mui/material";
import { io } from "socket.io-client";
import theme from "./theme";

const Scenario123Test = () => {
  const [state, setState] = useState({
    chatName: "",
    roomName: "",
    messages: [],
    status: "",
    showjoinfields: true,
  });

  const socketRef = useRef(null);

  if (!socketRef.current) {
    socketRef.current = io.connect("localhost:5000", {
      forceNew: true,
      transports: ["websocket"],
      autoConnect: true,
      reconnection: false,
      timeout: 5000,
    });
  }

  useEffect(() => {
    if (state.joining) {
      socketRef.current.on("nameexists", onExists);
      socketRef.current.on("welcome", onWelcome);

      return () => {
        socketRef.current.off("nameexists", onExists);
        socketRef.current.off("welcome", onWelcome);
      };
    }
  }, [state.joining]);

  useEffect(() => {
    if (!state.showjoinfields) {
      socketRef.current.on("someonejoined", addMessageToList);
      socketRef.current.on("someoneleft", addMessageToList);

      return () => {
        socketRef.current.off("someonejoined", addMessageToList);
        socketRef.current.off("someoneleft", addMessageToList);
      };
    }
  }, [state.showjoinfields]);

  const onNameChange = (e) => {
    setState({ ...state, chatName: e.target.value, status: "" });
  };

  const onWelcome = (msg) => {
    addMessageToList(msg);

    // Set 'showjoinfields' to false and 'joining' to false when the user has successfully joined
    setState((prevState) => ({
      ...prevState,
      showjoinfields: false,
      joining: false,
    }));
  };

  const onRoomChange = (e) => {
    setState({ ...state, roomName: e.target.value });
  };

  const handleJoin = () => {
    // Add a new state property 'joining' and set it to true when the join button is clicked
    setState({ ...state, joining: true });

    socketRef.current.emit("join", {
      chatName: state.chatName,
      roomName: state.roomName,
    });
  };

  const addMessageToList = (msg) => {
    setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, msg],
    }));
  };

  const onExists = (msg) => {
    setState({ ...state, status: msg, joining: false }); // Set 'joining' to false when the name exists
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            INFO3139 - Socket IO
          </Typography>
        </Toolbar>
      </AppBar>
      <h3 style={{ textAlign: "center" }}>Lab 18 - Scenario 1 2 3 Test</h3>
      {state.showjoinfields && (
        <div style={{ padding: "3vw", margin: "3vw" }}>
          <TextField
            onChange={onNameChange}
            placeholder="Enter unique name"
            autoFocus={true}
            required
            value={state.chatName}
            error={state.status !== ""}
            helperText={state.status}
          />
          <p></p>
          <TextField
            onChange={onRoomChange}
            placeholder="Enter room name"
            required
            value={state.roomName}
          />
          <p></p>
          <Button
            variant="contained"
            data-testid="submit"
            color="primary"
            style={{ marginLeft: "3%" }}
            onClick={() => handleJoin()}
            disabled={state.chatName === "" || state.roomName === ""}
          >
            Join
          </Button>
        </div>
      )}
      {!state.showjoinfields && (
        <div
          style={{ marginTop: "3vh", marginLeft: "2vw", fontWeight: "bold" }}
        >
          Current Messages
        </div>
      )}
      {state.messages.map((message, index) => (
        <Typography style={{ marginLeft: "5vw" }} key={index}>
          {message}
        </Typography>
      ))}
    </ThemeProvider>
  );
};

export default Scenario123Test;
