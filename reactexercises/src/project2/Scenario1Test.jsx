import React, { useEffect, useRef, useState, useReducer } from "react";
import io from "socket.io-client";
import { ThemeProvider } from "@mui/material/styles";
import {
  Button,
  ListItemIcon,
  IconButton,
  Card,
  List,
  CardContent,
  Typography,
  TextField,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  ListItem,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import theme from "./theme";
import "../App.css";
import ChatMsg from "./ChatMsg";
import Bubble from "./Bubble";
import TopBar from "./TopBar";
import logo from "../assets/chatitup.png";
import PersonIcon from "@mui/icons-material/Person";
const Scenario1Test = () => {
  const initialState = {
    chatName: "",
    roomName: "",
    status: "",
    messages: [],
    showjoinfields: true,
    isTyping: false,
    typingMsg: "",
    message: "",
    users: [],
    rooms: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    serverConnect();
  }, []);

  const serverConnect = () => {
    // const socket = io.connect("localhost:5000", {
    //   forceNew: true,
    //   transports: ["websocket"],
    //   autoConnect: true,
    //   reconnection: false,
    //   timeout: 5000,
    // });
    // connect to server
    const socket = io.connect();
    // Set the socket in the state
    setState({ socket: socket });

    // Set up the event listeners
    socket.on("nameexists", onExists);
    socket.on("welcome", addMessageToList);
    socket.on("someonejoined", addMessageToList);
    socket.on("someoneleft", addMessageToList);
    socket.on("someoneistyping", onTyping);
    socket.on("newmessage", onNewMessage);
    socket.on("radio", (data) => {
      let room = [...data];
      setState({ rooms: room });
    });
    socket.on("roomsAndUsers", onRoomsAndUsersUpdate);
  };

  const onTyping = (msg) => {
    if (msg.from !== state.chatName) {
      setState({
        typingMsg: msg.text,
      });
    }
  };
  const onRoomsAndUsersUpdate = (data) => {
    const { rooms, users } = data;
    setState({ rooms, users });
  };

  const onNewMessage = (msg) => {
    addMessageToList(msg);
    setState({ typingMsg: "" });
  };
  const handleJoin = () => {
    state.socket.emit("join", {
      chatName: state.chatName,
      roomName: state.roomName,
    });
  };

  const addMessageToList = (msg) => {
    let messages = state.messages;
    messages.push(msg);
    setState({
      messages: messages,
      showjoinfields: false,
      isTyping: false,
      typingMsg: "",
    });
  };

  const onExists = (msg) => {
    setState({ status: msg });
  };

  const onNameChange = (e) => {
    setState({ chatName: e.target.value, status: "" });
  };

  const onRoomChange = (e) => {
    setState({ roomName: e.target.value, status: "" });
  };

  // keypress handler for message TextField
  // keypress handler for message TextField
  const onMessageChange = (e) => {
    setState({ message: e.target.value });
    if (state.isTyping === false) {
      state.socket.emit("typing", { from: state.chatName }, (err) => {});
      setState({ isTyping: true }); // flag first byte only
    }
  };
  // enter key handler to send message
  const handleSendMessage = (e) => {
    if (state.message !== "") {
      state.socket.emit(
        "message",
        { from: state.chatName, text: state.message },
        (err) => {}
      );
      setState({ isTyping: false, message: "" });
    }
  };
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const emptyorundefined =
    state.chatName === undefined ||
    state.chatName === "" ||
    state.roomName === undefined ||
    state.roomName === "";
  const roomChange = (e) => {
    setState({ roomName: e.target.value });
  };
  const getUniqueRooms = () => {
    return [...new Set(state.rooms)];
  };
  return (
    <ThemeProvider theme={theme}>
      <TopBar
        showjoinfields={state.showjoinfields}
        viewDialog={handleOpenDialog}
      />
      <Dialog open={open} onClose={handleCloseDialog} style={{ margin: 20 }}>
        <DialogTitle style={{ textAlign: "center", color: "green" }}>
          Who's On?
        </DialogTitle>
        <DialogContent>
          <List>
            {state.users
              .filter((user) => user.chatName !== "Admin")
              .map((user, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <IconButton edge="start" color="inherit" aria-label="user">
                      <PersonIcon style={{ color: user.color }} />
                    </IconButton>
                  </ListItemIcon>
                  <Typography>
                    {user.chatName} in room {user.roomName}
                  </Typography>
                </ListItem>
              ))}
          </List>
        </DialogContent>
      </Dialog>

      <Card className="card">
        <CardContent sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar
            src={logo}
            alt="logo"
            sx={{ width: 200, height: 150, borderRadius: "0px" }}
          />
        </CardContent>
        <CardContent>
          {state.showjoinfields ? (
            <div>
              <TextField
                onChange={onNameChange}
                placeholder="Enter unique name"
                autoFocus={true}
                required
                value={state.chatName}
                error={state.status !== ""}
                helperText={
                  state.chatName === "" ? "Enter the Chat Name" : state.status
                }
                sx={{ "& .MuiFormHelperText-root": { color: "red" } }}
              />

              <br />
              <br />
              <p>Join Existing or Enter Room Name</p>
              <RadioGroup value={state.roomName} onChange={roomChange}>
                {getUniqueRooms().map((room) => (
                  <FormControlLabel
                    key={room}
                    value={room}
                    control={<Radio />}
                    label={room}
                  />
                ))}
              </RadioGroup>
              <br />
              <br />
              <br />
              <TextField
                onChange={onRoomChange}
                placeholder="Enter room name"
                autoFocus={true}
                required
                value={state.roomName}
                helperText={
                  state.roomName === "" ? "Enter the room name" : null
                }
                sx={{ "& .MuiFormHelperText-root": { color: "red" } }}
              />

              <br />
              <br />
              <Button
                variant="contained"
                data-testid="submit"
                color="primary"
                onClick={() => handleJoin()}
                disabled={state.chatName === "" || state.roomName === ""}
              >
                Join
              </Button>
            </div>
          ) : null}

          {!state.showjoinfields ? (
            <div>
              <div>
                {state.messages.map((message, index) => (
                  <Bubble
                    message={message}
                    key={index}
                    isOwnMessage={message.from === state.chatName}
                  />
                ))}
              </div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />

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
              <div>
                <Typography color="red">{state.typingMsg}</Typography>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};
export default Scenario1Test;
