import React, { useReducer, useEffect, useRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Card, CardContent, Typography } from "@mui/material";
import theme from "./theme";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CardHeader, CardMedia, AppBar } from "@mui/material";
import logo from "../assets/logo.png";
const AlertComponent = (props) => {
  const initialState = {
    resArr: [],
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAlerts = async () => {
    try {
      props.dataFromChild("running setup...");
      // const GRAPHURL = "http://localhost:5000/graphql";
      const GRAPHURL = "/graphql";
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ query: "{project1_setup{results}}" }),
      });
      let json = await response.json();
      props.dataFromChild("alerts collection setup completed");
      setState({
        resArr: json.data.project1_setup.results
          .replace(/([.])\s*(?=[A-Z])/g, "$1|")
          .split("|"),
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };
  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({
      msg: `results loaded`,
      contactServer: false,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Card style={{ width: "100%" }}>
          <CardMedia style={{ textAlign: "center", paddingTop: "3vh" }}>
            <img className="photo" src={logo} alt="LOGO"></img>
          </CardMedia>
          <CardHeader
            title="World Wide Travel Alerts"
            color="primary"
            style={{ textAlign: "center" }}
          />
        </Card>
      </AppBar>
      <CardContent>
        <Typography
          color="primary"
          style={{ fontSize: "20px", textAlign: "center" }}
        >
          Alert Setup - Details
        </Typography>
        <p></p>
        <div>
          <Typography color="error">{state.msg}</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" width="100%">
              <TableBody>
                {state.resArr.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography color="error" style={{ fontWeight: "bold" }}>
                        {item}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </CardContent>
    </ThemeProvider>
  );
};
export default AlertComponent;
