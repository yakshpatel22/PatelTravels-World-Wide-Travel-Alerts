import SocketClient from "./socketclient";
// note - using a functional component here
const AllRooms = () => (
  <div>
    <SocketClient name="some geek" room="geeks" />
    <SocketClient name="some nerd" room="nerds" />
    <SocketClient name="bigger nerd" room="nerds" />
    <SocketClient name="bigger geek" room="geeks" />
  </div>
);
export default AllRooms;
