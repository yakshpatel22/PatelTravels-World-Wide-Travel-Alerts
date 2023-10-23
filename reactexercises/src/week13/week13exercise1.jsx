import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  AppBar,
  Card,
  CardHeader,
  CardContent,
  Toolbar,
  Typography,
} from "@mui/material";
import theme from "./theme";
import "../App.css";
import UserList from "./userlist";
import userjson from "./user.json";
const Week13Exercise1 = () => {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState([]);
  useEffect(() => {
    setUsers(userjson);
    setMsg(`${userjson.length} users loaded`);
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <AppBar>
        <Toolbar color="primary">
          <Typography variant="h6" color="inherit">
            Case 2 - Exercises
          </Typography>
        </Toolbar>
      </AppBar>
      <Card className="card">
        <CardHeader
          title="Exercise #1"
          color="inherit"
          style={{ textAlign: "center" }}
        />
        <CardContent>
          <Typography
            color="error"
            style={{ marginBottom: "3vh", textAlign: "center" }}
          >
            {msg}
          </Typography>
          {users ? (
            <div className="usersList">
              <UserList users={users} />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};
export default Week13Exercise1;
