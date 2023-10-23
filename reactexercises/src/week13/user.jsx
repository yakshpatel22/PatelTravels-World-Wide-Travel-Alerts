import { useEffect, useRef } from "react";
import { ListItem } from "@mui/material";
const User = (props) => {
  const userRef = useRef(null);
  useEffect(() => {
    userRef.current.scrollIntoView();
  }, []);
  return (
    <ListItem ref={userRef} style={{ textAlign: "left" }}>
      <div>
        <div style={{ fontWeight: "bold" }}>Name: {props.user.name}</div>
        <div>Age:{props.user.age}</div>
        <div>Email:{props.user.email}</div>
      </div>
    </ListItem>
  );
};
export default User;
