import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import theme from "../theme";
import "../App.css";
import logo from "../assets/TeamMemberInfo.png";
const GRAPHURL = "http://localhost:5000/graphql";

const MemberInfo = (props) => {
  const initialState = {
    resArr: [],
    team: "",
    firstname: "",
    lastname: "",
    email: "",
    reset: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const buttonEnabled =
    state.team === undefined ||
    state.team === "" ||
    state.firstname === undefined ||
    state.firstname === "" ||
    state.lastname === undefined ||
    state.lastname === "" ||
    state.email === undefined ||
    state.email === "";
  const deleteButtonEnabled =
    state.lastname === undefined ||
    state.lastname === "" ||
    state.email === undefined ||
    state.email === "";

  useEffect(() => {
    fetchMemberInfo();
  }, []);

  const teamOnChange = (e) => {
    setState({ team: e.target.value });
  };

  const firstnameOnChange = (e) => {
    setState({ firstname: e.target.value });
  };

  const lastnameOnChange = (e) => {
    setState({ lastname: e.target.value });
  };

  const emailOnChange = (e) => {
    setState({ email: e.target.value });
  };

  const editSelectOnChange = (e, selection) => {
    selection
      ? setState({
          team: selection.team,
          firstname: selection.firstname,
          lastname: selection.lastname,
          email: selection.email,
        })
      : setState({
          team: "",
          firstname: "",
          lastname: "",
          email: "",
        });
  };

  const fetchMemberInfo = async () => {
    try {
      props.dataFromChild("running setup...");
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: "{getallteammembers{team,firstname,lastname,email}}",
        }),
      });
      let payload = await response.json();
      props.dataFromChild(
        `found ${payload.data.getallteammembers.length} teammembers`
      );
      console.log(payload.data.getallteammembers);
      setState({
        resArr: payload.data.getallteammembers,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const addMemberInfo = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { addteammember ( team: "${state.team}", firstname: "${state.firstname}" ,lastname: "${state.lastname}", email: "${state.email}" )
                                 { team, firstname, lastname, email } } `,
        }),
      });
      let payload = await response.json();
      if (payload && payload.data && payload.data.addteammember) {
        props.dataFromChild(
          `added info for ${payload.data.addteammember.name} project`
        );
      } else {
        console.log("Error: Failed to add team member");
        props.dataFromChild("Failed to add team member");
      }

      setState({
        team: "",
        firstname: "",
        lastname: "",
        email: "",
        reset: true,
      });
      fetchMemberInfo();
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const editMemberTeam = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { movemembertoteam (team: "${state.team}", lastname: "${state.lastname}", email: "${state.email}" )
                                { team, firstname, lastname, email } }`,
        }),
      });
      let payload = await response.json();
      console.log(payload);
      setState({
        team: "",
        firstname: "",
        lastname: "",
        email: "",
        reset: true,
      });
      fetchMemberInfo();
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const editMemberSurname = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { updatememberlastname (firstname: "${state.firstname}", lastname: "${state.lastname}", email: "${state.email}" )
                                { team, firstname, lastname, email } }`,
        }),
      });
      setState({
        team: "",
        firstname: "",
        lastname: "",
        email: "",
        reset: true,
      });
      fetchMemberInfo();
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const editMemberEmail = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { updatememberemail (firstname: "${state.firstname}", lastname: "${state.lastname}", email: "${state.email}" )
                                { team, firstname, lastname, email } }`,
        }),
      });
      setState({
        team: "",
        firstname: "",
        lastname: "",
        email: "",
        reset: true,
      });
      fetchMemberInfo();
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const deleteMemberInfo = async () => {
    try {
      props.dataFromChild("running setup...");
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` { deleteamember ( lastname: "${state.lastname}", email: "${state.email}" ) } `,
        }),
      });
      let payload = await response.json();
      props.dataFromChild(payload.data.deleteamember);
      setState({
        team: "",
        firstname: "",
        lastname: "",
        email: "",
        reset: true,
      });
      fetchMemberInfo();
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardMedia style={{ textAlign: "center", paddingTop: "3vh" }}>
          <img
            className="photo"
            src={logo}
            alt="LOGO"
            style={{ maxWidth: "30%", borderRadius: "10%" }}
          ></img>
        </CardMedia>
        <Typography
          variant="h4"
          align="center"
          style={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            paddingTop: "2vh",
          }}
        >
          Teammember Info
        </Typography>
        <CardContent>
          <TableContainer component={Paper}>
            <Table aria-label="member table">
              <TableBody>
                <TableRow key="headers">
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      color: theme.palette.primary.main,
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    Team Name
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      color: theme.palette.primary.main,
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    First Name
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      color: theme.palette.primary.main,
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    Last Name
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      color: theme.palette.primary.main,
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell component="th" scope="row"></TableCell>
                </TableRow>
                {state.resArr.map((row) => (
                  <TableRow key={state.resArr.indexOf(row)}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{
                        color: theme.palette.primary.main,
                        textAlign: "center",
                        fontSize: 14,
                      }}
                    >
                      {row.team}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{
                        color: theme.palette.primary.main,
                        textAlign: "center",
                        fontSize: 14,
                      }}
                    >
                      {row.firstname}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{
                        color: theme.palette.primary.main,
                        textAlign: "center",
                        fontSize: 14,
                      }}
                    >
                      {row.lastname}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{
                        color: theme.palette.primary.main,
                        textAlign: "center",
                        fontSize: 14,
                      }}
                    >
                      {row.email}
                    </TableCell>
                    <TableCell component="th" scope="row"></TableCell>
                  </TableRow>
                ))}
                <TableRow key="fillable">
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      color: theme.palette.primary.main,
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    <TextField
                      id="team-name-field"
                      onChange={teamOnChange}
                      value={state.team}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      color: theme.palette.primary.main,
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    <TextField
                      id="first-name-field"
                      onChange={firstnameOnChange}
                      value={state.firstname}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      color: theme.palette.primary.main,
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    <TextField
                      id="last-name-field"
                      onChange={lastnameOnChange}
                      value={state.lastname}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      color: theme.palette.primary.main,
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    <TextField
                      id="email-field"
                      onChange={emailOnChange}
                      value={state.email}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell component="th" scope="row" style={{ width: 200 }}>
                    <Button
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        marginRight: "10px",
                      }}
                      variant="contained"
                      onClick={addMemberInfo}
                      disabled={buttonEnabled}
                    >
                      ADD
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        marginRight: "10px",
                      }}
                      variant="contained"
                      onClick={deleteMemberInfo}
                      disabled={deleteButtonEnabled}
                    >
                      DELETE
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        marginTop: "10px",
                      }}
                      variant="contained"
                      onClick={editMemberTeam}
                      disabled={buttonEnabled}
                    >
                      Update Team
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        marginTop: "10px",
                      }}
                      variant="contained"
                      onClick={editMemberSurname}
                      disabled={buttonEnabled}
                    >
                      Update Surname
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        marginTop: "10px",
                      }}
                      variant="contained"
                      onClick={editMemberEmail}
                      disabled={buttonEnabled}
                    >
                      Update Email
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography
            variant="h5"
            align="center"
            style={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              paddingTop: "2vh",
            }}
          >
            Choose Teammember to Edit
          </Typography>
          <div align="center">
            <Autocomplete
              onChange={editSelectOnChange}
              key={state.reset}
              id="member"
              options={state.resArr}
              getOptionLabel={(option) =>
                option.firstname +
                " " +
                option.lastname +
                "; Team: " +
                option.team
              }
              style={{
                width: 350,
                height: 20,
                paddingTop: "2vh",
                paddingBottom: "10vh",
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="member info"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};
export default MemberInfo;
