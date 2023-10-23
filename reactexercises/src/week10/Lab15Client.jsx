import React, { useReducer, useEffect } from "react";
import io from "socket.io-client";
import { ThemeProvider } from "@mui/material/styles";
import {
  CardContent,
  TextField,
  Button,
  Typography,
  Snackbar,
  Card,
} from "@mui/material";
import theme from "./theme";
import "../App.css";

const Lab15Client = () => {
  const initialState = {
    showMsg: false,
    snackbarMsg: "",
    msg: "",
    roomMsg: "",
    name: "",
    room: "",
    newclient: "",
    socket: null,
    join: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const handleNameInput = (e) => {
    setState({ name: e.target.value });
  };

  const handleRoomInput = (e) => {
    setState({ room: e.target.value });
  };

  const snackbarClose = () => {
    setState({ showMsg: false });
  };

  const emptyorundefined =
    state.name === undefined ||
    state.name === "" ||
    state.room === undefined ||
    state.room === "";

  const onJoinClicked = () => {
    if (state.socket.io._readyState !== "closed") {
      setState({ join: !state.join });
    } else {
      setState({
        snackbarMsg: "can't get connection - try later!",
        showMsg: true,
      });
    }
  };

  useEffect(() => {
    serverConnect();
    // React 18 Strictmode runs useEffects twice in development`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.join]);

  const serverConnect = () => {
    try {
      // connect to server locally
      const socket = io.connect("localhost:5000", {
        forceNew: true,
        transports: ["websocket"],
        autoConnect: true,
        reconnection: false,
        timeout: 5000,
      });
      if (!emptyorundefined) {
        socket.emit(
          "join",
          { name: state.name, room: state.room },
          (err) => {}
        );
        socket.on("welcome", onWelcome);
        socket.on("newclient", newClientJoined);
      }
      setState({ socket: socket });
      if (socket.io._readyState === "opening")
        // we'll see this if server is down or it'll get overwritten if its up
        setState({ snackbarMsg: "trying to get connection...", showMsg: true });
      else {
      }
    } catch (err) {
      console.log(err);
      setState({ snackbarMsg: "some other problem occurred", showMsg: true });
    }
  };

  const onWelcome = (welcomeMsgFromServer) => {
    setState({ snackbarMsg: welcomeMsgFromServer, showMsg: true });
  };

  const newClientJoined = (client) => {
    setState({ newClient: client });
  };

  return (
    <ThemeProvider theme={theme}>
      <Card style={{}}>
        <CardContent>
          <Typography style={{ fontSize: "20px", textAlign: "center" }}>
            Lab 15 - Socket.io
          </Typography>
          <p></p>
          <TextField
            placeholder=""
            value={state.name}
            onChange={handleNameInput}
          />
          <p style={{ margin: "0" }}>Enter user's name here</p>
          <TextField
            placeholder=""
            value={state.room}
            onChange={handleRoomInput}
          />
          <p style={{ margin: "0" }}>Enter room to join here</p>
          <p></p>
          <Button
            variant="contained"
            disabled={emptyorundefined}
            onClick={onJoinClicked}
          >
            Join
          </Button>
          <Snackbar
            open={state.showMsg}
            message={state.snackbarMsg}
            autoHideDuration={4000}
            onClose={snackbarClose}
          />
        </CardContent>
      </Card>
      <p>{state.newClient}</p>
    </ThemeProvider>
  );
};

export default Lab15Client;
