import { useReducer, useEffect, useRef } from "react";
import io from "socket.io-client";
const SocketClient = (props) => {
  const initialState = { msg: "", roomMsg: "" };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const effectRan = useRef(false);
  useEffect(() => {
    if (effectRan.current) return; // React 18 Strictmode runs useEffects twice in development`
    serverConnect();
    effectRan.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
      socket.emit("join", { name: props.name, room: props.room }, (err) => {});
      socket.on("welcome", onWelcome);
      socket.on("newclient", newClientJoined);
      setState({ socket: socket });
      if (socket.io._readyState === "opening")
        // we'll see this if server is down or it'll get overwritten if its up
        setState({ msg: "trying to get connection..." });
    } catch (err) {
      console.log(err);
      setState({ msg: "some other problem occurred" });
    }
  };
  const onWelcome = (welcomeMsgFromServer) => {
    setState({ msg: welcomeMsgFromServer });
  };
  const newClientJoined = (joinMsgFromServer) => {
    setState({ roomMsg: joinMsgFromServer });
  };
  return (
    <div style={{ border: "solid" }}>
      <div>{state.msg}</div>
      {state.roomMsg ? (
        <div style={{ paddingTop: "2vh" }}>{state.roomMsg}</div>
      ) : null}
    </div>
  );
};
export default SocketClient;
