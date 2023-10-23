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
import logo from "../assets/SprintInfo.png";
const GRAPHURL = "http://localhost:5000/graphql";
const Sprint = (props) => {
  const initialState = {
    resArr: [],
    projectArr: [],
    sprint: "",
    numberofuserstory: "",
    team: "",
    project: "",
    storypoints: "",
    reset: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const buttonEnabled =
    state.sprint === undefined ||
    state.sprint === "" ||
    state.numberofuserstory === undefined ||
    state.numberofuserstory === "" ||
    state.team === undefined ||
    state.team === "" ||
    state.project === undefined ||
    state.project === "" ||
    state.storypoints === undefined ||
    state.storypoints === "";

  useEffect(() => {
    fetchProjectInfo();
  }, []);

  const currentProjectOnChange = (e, selection) => {
    selection
      ? setState({ project: selection.name })
      : setState({ project: "" });
    selection ? fetchSprintInfo(selection.name) : fetchSprintInfo("");
  };

  const sprintOnChange = (e) => {
    setState({ sprint: e.target.value });
  };

  const projectOnChange = (e) => {
    setState({ project: e.target.value });
  };

  const teamOnChange = (e) => {
    setState({ team: e.target.value });
  };

  const storiesOnChange = (e) => {
    setState({ numberofuserstory: e.target.value });
  };

  const pointsOnChange = (e) => {
    setState({ storypoints: e.target.value });
  };

  const editSelectOnChange = (e, selection) => {
    selection
      ? setState({
          sprint: selection.sprint,
          numberofuserstory: selection.numberofuserstory,
          project: selection.project,
          team: selection.team,
          storypoints: selection.storypoints,
        })
      : setState({
          sprint: "",
          numberofuserstory: "",
          project: "",
          team: "",
          storypoints: "",
        });
  };

  const fetchProjectInfo = async () => {
    try {
      props.dataFromChild("running setup...");
      setState({
        sprint: "",
        numberofuserstory: "",
        project: "",
        team: "",
        storypoints: "",
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
      if (payload && payload.data && payload.data.getallproject) {
        props.dataFromChild(
          `found ${payload.data.getallproject.length} projects`
        );
        setState({
          projectArr: payload.data.getallproject,
        });
      } else {
        props.dataFromChild("Invalid response:", payload);
      }
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fetchSprintInfo = async (project) => {
    try {
      props.dataFromChild("running setup...");
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{getallsprintsperproject(project:"${project}"){project,team,sprint,numberofuserstory,storypoints}}`,
        }),
      });
      let payload = await response.json();
      props.dataFromChild(
        `found ${payload.data.getallsprintsperproject.length} sprints`
      );
      console.log(payload.data.getallsprintsperproject);
      setState({
        resArr: payload.data.getallsprintsperproject,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const addSprintInfo = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { addsprint ( project: "${state.project}", team: "${state.team}", sprint: "${state.sprint}", numberofuserstory: ${state.numberofuserstory}, storypoints: ${state.storypoints} )
                            { project, team, sprint, numberofuserstory, storypoints } } `,
        }),
      });
      let payload = await response.json();
      if (payload && payload.data && payload.data.addsprint) {
        props.dataFromChild(
          `added info for sprint ${payload.data.addsprint.sprint} for ${payload.data.addsprint.project}`
        );
      } else {
        props.dataFromChild("Error: Unable to add sprint");
      }
      fetchSprintInfo(state.project);

      setState({
        sprint: "",
        numberofuserstory: "",
        project: "",
        team: "",
        storypoints: "",
        reset: true,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const editSprintInfo = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { updatesprint ( project: "${state.project}", sprint: "${state.sprint}", numberofuserstory: ${state.numberofuserstory} )
                            { project, team, sprint, numberofuserstory, storypoints } } `,
        }),
      });
      let payload = await response.json();
      if (payload && payload.data && payload.data.updatesprint) {
        props.dataFromChild(
          `updated info for sprint ${payload.data.updatesprint.sprint} for ${payload.data.updatesprint.project}`
        );
      } else {
        props.dataFromChild("Error: Unable to update sprint");
      }
      fetchSprintInfo(state.project);

      setState({
        sprint: "",
        numberofuserstory: "",
        project: "",
        team: "",
        storypoints: "",
        reset: true,
      });
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
          Sprint Info
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
                    Project
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
                    Team
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
                    Number of User Stories
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
                    Story Points
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
                      {row.project}
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
                      {row.numberofuserstory}
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
                      {row.storypoints}
                    </TableCell>
                    <TableCell></TableCell>
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
                    {state.project}
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
                      id="sprint-field"
                      onChange={sprintOnChange}
                      value={state.sprint}
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
                      id="team-field"
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
                      id="userstory-field"
                      onChange={storiesOnChange}
                      value={state.numberofuserstory}
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
                      id="storypoints-field"
                      onChange={pointsOnChange}
                      value={state.storypoints}
                      type="number"
                    />
                  </TableCell>

                  <TableCell component="th" scope="row">
                    <Button
                      style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                      variant="contained"
                      onClick={addSprintInfo}
                      disabled={buttonEnabled}
                    >
                      ADD
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        marginLeft: "10px",
                      }}
                      variant="contained"
                      onClick={editSprintInfo}
                      disabled={buttonEnabled}
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
            Choose Sprint to Edit
          </Typography>
          <div align="center">
            <Autocomplete
              onChange={editSelectOnChange}
              id="sprint"
              options={state.resArr}
              getOptionLabel={(option) =>
                option.sprint + " for " + option.project
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
                  label="sprint info"
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
export default Sprint;
