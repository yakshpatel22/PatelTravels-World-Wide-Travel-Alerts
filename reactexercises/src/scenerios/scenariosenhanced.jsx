import { useReducer, useEffect } from "react";
import io from "socket.io-client";
import { ThemeProvider } from "@mui/material/styles";
import { Button, TextField, Typography, AppBar, Toolbar } from "@mui/material";
import theme from "./theme";
import ChatMsg from "./ChatMsg";
const ScenarioEnhanced = () => {
  const initialState = {
    messages: [],
    status: "",
    showjoinfields: true,
    alreadyexists: false,
    chatName: "",
    roomName: "",
    users: [],
    isTyping: false,
    typingMsg: "",
    message: "",
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
    socket.on("someoneleft", addMessage);
    socket.on("someoneistyping", onTyping);
    socket.on("newmessage", onNewMessage);
    setState({ socket: socket });
  };
  const onExists = (dataFromServer) => {
    setState({ status: dataFromServer });
  };
  // generic handler for all other messages:
  const addMessage = (dataFromServer) => {
    console.log(dataFromServer);
    let messages = state.messages;
    messages.push({
      userName: dataFromServer.from,
      message: dataFromServer.message,
      color: dataFromServer.color,
      timestamp: dataFromServer.timestamp,
    });
    setState({
      messages: messages,
      users: dataFromServer.users,
      showjoinfields: false,
      alreadyexists: false,
    });
  };
  const onTyping = (msg) => {
    if (msg.from !== state.chatName) {
      setState({
        typingMsg: msg.message,
      });
    }
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
  // enter key handler to send message
  const handleSendMessage = (e) => {
    if (state.message !== "") {
      state.socket.emit(
        "message",
        { from: state.chatName, message: state.message },
        (err) => {}
      );
      setState({ isTyping: false, message: "" });
    }
  };

  // keypress handler for message TextField
  const onMessageChange = (e) => {
    setState({ message: e.target.value });
    if (state.isTyping === false) {
      state.socket.emit("typing", {
        chatName: state.chatName,
        roomName: state.roomName,
      });
      setState({ isTyping: true }); // flag first byte only
    }
  };
  const onNewMessage = (msg) => {
    addMessage(msg);
    setState({ typingMsg: "" });
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
      <h3 style={{ textAlign: "center" }}>Lab 19 - Scenario Enhanced Test</h3>
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
        <TextField
          onChange={onMessageChange}
          placeholder="type something here"
          autoFocus={true}
          value={state.message}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
              e.target.blur();
            }
          }}
        />
      )}

      {!state.showjoinfields && (
        <div
          style={{ marginTop: "3vh", marginLeft: "2vw", fontWeight: "bold" }}
        >
          Current Messages
        </div>
      )}

      {!state.showjoinfields && (
        <div className="scenario-container">
          Messages in {state.roomName}
          {state.messages.map((message, index) => (
            <ChatMsg message={message} key={index} />
          ))}
        </div>
      )}
      {console.log(state.typingMsg)}
      {!state.showjoinfields && (
        <div>
          <Typography color="primary">{state.typingMsg}</Typography>
        </div>
      )}
    </ThemeProvider>
  );
};
export default ScenarioEnhanced;
