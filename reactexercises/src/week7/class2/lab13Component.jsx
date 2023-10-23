import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  Snackbar,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import theme from "./theme";
import "../../App.css";
const Lab13Component = () => {
  const initialState = {
    msg: "",
    snackbarMsg: "",
    contactServer: false,
    users: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      setState({
        contactServer: true,
        snackbarMsg: "Attempting to load users from server...",
      });
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ query: "query { users{name,age,email} }" }),
      });
      let json = await response.json();
      setState({
        snackbarMsg: `users loaded`,
        users: json.data.users,
        contactServer: true,
        // names: json.users.map((y) => y.name),
      });
    } catch (error) {
      console.log(error);
      setState({
        msg: `Problem loading server data - ${error.message}`,
      });
    }
  };
  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({
      msg: `${state.users.length} users loaded`,
      contactServer: false,
    });
  };

  const onChange = (e, selectedOption) => {
    const user = state.users.find((x) => x.name === selectedOption);
    selectedOption
      ? setState({
          msg: `You selected ${user.name}. This user can be contacted at ${user.email}.`,
        })
      : setState({ msg: "" });
  };
  return (
    <ThemeProvider theme={theme}>
      <Card style={{ marginTop: "10vh" }}>
        <CardHeader
          title="Lab 13 - Search For User"
          style={{ color: theme.palette.primary.main, textAlign: "center" }}
        />
        <CardContent>
          <Autocomplete
            data-testid="autocomplete"
            options={state.users.map((x) => x.name)}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            onChange={onChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="available words"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <div>
            <Typography color="primary">{state.msg}</Typography>
          </div>
        </CardContent>
      </Card>
      <Snackbar
        open={state.contactServer}
        message={state.snackbarMsg}
        autoHideDuration={3000}
        onClose={snackbarClose}
      />
    </ThemeProvider>
  );
};
export default Lab13Component;
