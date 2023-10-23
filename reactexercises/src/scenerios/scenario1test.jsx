import { useReducer, useEffect } from "react";
import io from "socket.io-client";
import { ThemeProvider } from "@mui/material/styles";
import { Button, TextField, Typography, AppBar, Toolbar } from "@mui/material";
import theme from "./theme";
const Scenario1Test = () => {
  const initialState = {
    messages: [],
    status: "",
    showjoinfields: true,
    alreadyexists: false,
    chatName: "",
    roomName: "",
    users: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(() => {
    serverConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const serverConnect = () => {
    // connect to server
    const socket = io.connect("localhost:5000", {
      forceNew: true,
      transports: ["websocket"],
      autoConnect: true,
      reconnection: false,
      timeout: 5000,
    });
    socket.on("nameexists", onExists);
    socket.on("welcome", addMessage);
    socket.on("someonejoined", addMessage);
    setState({ socket: socket });
  };
  const onExists = (dataFromServer) => {
    setState({ status: dataFromServer });
  };
  // generic handler for all other messages:
  const addMessage = (dataFromServer) => {
    let messages = state.messages;
    messages.push({
      userName: dataFromServer.userName,
      message: dataFromServer.message,
    });
    setState({
      messages: messages,
      users: dataFromServer.users,
      showjoinfields: false,
      alreadyexists: false,
    });
  };
  // handler for join button click
  const handleJoin = () => {
    state.socket.emit("join", {
      chatName: state.chatName,
      roomName: state.roomName,
    });
  };
  // handler for name TextField entry
  const onNameChange = (e) => {
    setState({ chatName: e.target.value, status: "" });
  };
  // handler for room TextField entry
  const onRoomChange = (e) => {
    setState({ roomName: e.target.value });
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
      <h3 style={{ textAlign: "center" }}>Lab 18 - Scenario 1 Test</h3>
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
          {message.message}
        </Typography>
      ))}
    </ThemeProvider>
  );
};
export default Scenario1Test;
