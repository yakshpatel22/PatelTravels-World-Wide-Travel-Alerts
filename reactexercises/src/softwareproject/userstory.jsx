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
import logo from "../assets/UserStory.png";
const GRAPHURL = "http://localhost:5000/graphql";

const UserStory = (props) => {
  const initialState = {
    resArr: [],
    projectArr: [],
    sprintArr: [],
    backlogArr: [],
    memberArr: [],
    project: "",
    userstory: "",
    sprint: "",
    status: "",
    numberofsubtasks: "",
    userpoints: "",
    assignedmember: "",
    reset: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const addButtonEnabled =
    state.userstory === undefined ||
    state.userstory === "" ||
    state.sprint === undefined ||
    state.sprint === "" ||
    state.userpoints === undefined ||
    state.userpoints === "";
  const editButtonEnabled =
    state.userstory === undefined ||
    state.userstory === "" ||
    state.sprint === undefined ||
    state.sprint === "" ||
    state.status === undefined ||
    state.status === "" ||
    state.numberofsubtasks === undefined ||
    state.numberofsubtasks === "" ||
    state.userpoints === undefined ||
    state.userpoints === "";

  useEffect(() => {
    fetchProjectInfo();
    fetchUserStories();
    fetchMemberInfo();
  }, []);

  const currentProjectOnChange = (e, selection) => {
    selection
      ? setState({ project: selection.name })
      : setState({ project: "" });
    if (selection) {
      fetchSprintInfo(selection.name);
      fetchBacklogs(selection.name);
    } else {
      fetchSprintInfo("");
      fetchBacklogs("");
    }
  };

  const userstoryOnChange = (e, selection) => {
    selection
      ? setState({ userstory: selection.iwantto })
      : setState({ userstory: "" });
  };

  const sprintOnChange = (e, selection) => {
    selection
      ? setState({ sprint: selection.sprint })
      : setState({ sprint: "" });
  };

  const statusOnChange = (e) => {
    setState({ status: e.target.value });
  };

  const numberofsubtasksOnChange = (e) => {
    setState({ numberofsubtasks: e.target.value });
  };

  const userpointsOnChange = (e) => {
    setState({ userpoints: e.target.value });
  };

  const assignedmemberOnChange = (e, selection) => {
    selection
      ? setState({
          assignedmember: selection.firstname + " " + selection.lastname,
        })
      : setState({ assignedmember: "" });
  };

  const editSelectOnChange = (e, selection) => {
    selection
      ? setState({
          userstory: selection.userstory,
          sprint: selection.sprint,
          status: selection.status,
          numberofsubtasks: selection.numberofsubtasks,
          userpoints: selection.userpoints,
          assignedmember: selection.assignedmember,
        })
      : setState({
          userstory: "",
          sprint: "",
          status: "",
          numberofsubtasks: "",
          userpoints: "",
          assignedmember: "",
        });
  };

  const fetchProjectInfo = async () => {
    try {
      setState({
        userstory: "",
        sprint: "",
        status: "",
        numberofsubtasks: "",
        userpoints: "",
        assignedmember: "",
      });
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query:
            "{getallproject{name,description,teamname,numberofteammembers,numberofsprints,velocity,storypointsconversion,costperhour}}",
        }),
      });
      let payload = await response.json();
      props.dataFromChild(
        `found ${payload.data.getallproject.length} projects`
      );
      setState({
        projectArr: payload.data.getallproject,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fetchBacklogs = async (project) => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{getallbacklogbyproject(project:"${project}"){project,priority,userrole,iwantto,ican,relativeestimate,estimatedcost}}`,
        }),
      });
      let payload = await response.json();
      setState({
        backlogArr: payload.data.getallbacklogbyproject,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fetchSprintInfo = async (project) => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{getallsprintsperproject(project:"${project}"){project,team,sprint,numberofuserstory,storypoints}}`,
        }),
      });
      let payload = await response.json();
      setState({
        sprintArr: payload.data.getallsprintsperproject,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fetchUserStories = async () => {
    try {
      props.dataFromChild("running setup...");
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query:
            "{getalluserstory{userstory,sprint,status,numberofsubtasks,userpoints,assignedmember}}",
        }),
      });
      let payload = await response.json();
      props.dataFromChild(
        `found ${payload.data.getalluserstory.length} stories`
      );
      console.log(payload.data.getalluserstory);
      setState({
        resArr: payload.data.getalluserstory,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fetchMemberInfo = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: "{getallteammembers{team,firstname,lastname,email}}",
        }),
      });
      let payload = await response.json();
      console.log(payload.data.getallteammembers);
      setState({
        memberArr: payload.data.getallteammembers,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const addUserStory = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { adduserstory ( userstory: "${state.userstory}", sprint: "${state.sprint}", userpoints: ${state.userpoints} )
                            { userstory, sprint, status, numberofsubtasks, userpoints, assignedmember } } `,
        }),
      });
      let payload = await response.json();

      if (
        payload &&
        payload.data &&
        payload.data.adduserstory &&
        payload.data.adduserstory.userstory
      ) {
        props.dataFromChild(`added info for ${state.userstory}`);
      } else {
        props.dataFromChild("Unexpected response from server");
      }
      fetchUserStories();

      setState({
        userstory: "",
        sprint: "",
        status: "",
        numberofsubtasks: "",
        userpoints: "",
        assignedmember: "",
        reset: true,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const editProjectInfo = async () => {
    try {
      await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { updateusertorystatus ( userstory: "${state.userstory}", status: "${state.status}" )
                            { userstory, sprint, status, numberofsubtasks, userpoints, assignedmember } } `,
        }),
      });
      await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { updateusertorysubtasks ( userstory: "${state.userstory}", numberofsubtasks: ${state.numberofsubtasks} )
                            { userstory, sprint, status, numberofsubtasks, userpoints, assignedmember } } `,
        }),
      });
      await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { moveuserstorytosprint ( userstory: "${state.userstory}", sprint: "${state.sprint}" )
                            { userstory, sprint, status, numberofsubtasks, userpoints, assignedmember } } `,
        }),
      });
      console.log(state.assignedmember);
      await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { assignmembertouserstory ( userstory: "${state.userstory}", assignedmember: "${state.assignedmember}" )
                            { userstory, sprint, status, numberofsubtasks, userpoints, assignedmember } } `,
        }),
      });
      setState({
        userstory: "",
        sprint: "",
        status: "",
        numberofsubtasks: "",
        userpoints: "",
        assignedmember: "",
        reset: true,
      });
      fetchUserStories();
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
          User Story Info
        </Typography>
        <CardContent>
          <Autocomplete
            onChange={currentProjectOnChange}
            id="project"
            options={state.projectArr}
            getOptionLabel={(option) => option.name + " by " + option.teamname}
            style={{
              width: 350,
              height: 20,
              paddingTop: "2vh",
              paddingBottom: "10vh",
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="project info"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <TableContainer component={Paper}>
            <Table aria-label="project table">
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
                    Sprint
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
                    User Story
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
                    Status
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
                    No. Of Tasks
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
                    User Points
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
                    Assigned Member
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
                      {row.sprint}
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
                      {row.userstory}
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
                      {row.status}
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
                      {row.numberofsubtasks}
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
                      {row.userpoints}
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
                      {row.assignedmember}
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
                    <Autocomplete
                      onChange={sprintOnChange}
                      id="sprint"
                      options={state.sprintArr}
                      getOptionLabel={(option) =>
                        option.sprint + ";" + option.project
                      }
                      style={{
                        width: 350,
                        height: 20,
                        paddingTop: "2vh",
                        paddingBottom: "5vh",
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="sprint"
                          variant="outlined"
                          fullWidth
                        />
                      )}
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
                    <Autocomplete
                      onChange={userstoryOnChange}
                      id="userstory"
                      options={state.backlogArr}
                      getOptionLabel={(option) => option.iwantto}
                      style={{
                        width: 600,
                        height: 20,
                        paddingTop: "2vh",
                        paddingBottom: "5vh",
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="user story"
                          variant="outlined"
                          fullWidth
                        />
                      )}
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
                      id="status-field"
                      onChange={statusOnChange}
                      value={state.status}
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
                      id="subtasks-number-field"
                      onChange={numberofsubtasksOnChange}
                      value={state.numberofsubtasks}
                      type="number"
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
                      id="userpoints-field"
                      onChange={userpointsOnChange}
                      value={state.userpoints}
                      type="number"
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
                    <Autocomplete
                      onChange={assignedmemberOnChange}
                      id="member"
                      options={state.memberArr}
                      getOptionLabel={(option) =>
                        option.firstname + " " + option.lastname
                      }
                      style={{
                        width: 150,
                        height: 20,
                        paddingTop: "2vh",
                        paddingBottom: "5vh",
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="member"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </TableCell>

                  <TableCell component="th" scope="row">
                    <Button
                      style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                      variant="contained"
                      onClick={addUserStory}
                      disabled={addButtonEnabled}
                    >
                      ADD
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        marginTop: "10px",
                      }}
                      variant="contained"
                      onClick={editProjectInfo}
                      disabled={editButtonEnabled}
                    >
                      EDIT
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
            Choose User Story to Edit
          </Typography>
          <div align="center">
            <Autocomplete
              onChange={editSelectOnChange}
              key={state.reset}
              id="user story"
              options={state.resArr}
              getOptionLabel={(option) => option.userstory}
              style={{
                width: 600,
                height: 20,
                paddingTop: "2vh",
                paddingBottom: "10vh",
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="user story info"
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
export default UserStory;
