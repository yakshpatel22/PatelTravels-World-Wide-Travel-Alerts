import { useEffect, useReducer } from "react";
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
import logo from "../assets/Retro.png";
const GRAPHURL = "http://localhost:5000/graphql";

const Retrospective = (props) => {
  const initialState = {
    resArr: [],
    projectArr: [],
    sprintArr: [],
    storyArr: [],
    subtaskArr: [],
    project: "",
    sprint: "",
    userstory: "",
    subtask: "",
    storypoints: "",
    originalhours: "",
    actualhours: "",
    reestimatehours: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const buttonEnabled =
    state.project === undefined ||
    state.project === "" ||
    state.sprint === undefined ||
    state.sprint === "" ||
    state.userstory === undefined ||
    state.userstory === "" ||
    state.subtask === undefined ||
    state.subtask === "" ||
    state.originalhours === undefined ||
    state.originalhours === "" ||
    state.actualhours === undefined ||
    state.actualhours === "" ||
    state.reestimatehours === undefined ||
    state.reestimatehours === "";
  const updateButtonEnabled =
    state.project === undefined ||
    state.project === "" ||
    state.sprint === undefined ||
    state.sprint === "" ||
    state.userstory === undefined ||
    state.userstory === "" ||
    state.subtask === undefined ||
    state.subtask === "" ||
    state.originalhours === undefined ||
    state.originalhours === "" ||
    state.actualhours === undefined ||
    state.actualhours === "" ||
    state.reestimatehours === undefined ||
    state.reestimatehours === "";

  useEffect(() => {
    fetchProjectInfo();
  }, []);

  const sprintOnChange = (e, selection) => {
    selection
      ? setState({ sprint: selection.sprint })
      : setState({ sprint: "" });
  };

  const userstoryOnChange = (e, selection) => {
    selection
      ? setState({ userstory: selection.userstory })
      : setState({ userstory: "" });
    selection ? fetchSubtasks(selection.userstory) : fetchSubtasks("");
  };

  const subtaskOnChange = (e, selection) => {
    selection
      ? setState({ subtask: selection.subtask })
      : setState({ subtask: "" });
  };

  const storypointsOnChange = (e) => {
    setState({ storypoints: e.target.value });
  };

  const originalhoursOnChange = (e) => {
    setState({ originalhours: e.target.value });
  };

  const actualhoursOnChange = (e) => {
    setState({ actualhours: e.target.value });
  };

  const reestimatehoursOnChange = (e) => {
    setState({ reestimatehours: e.target.value });
  };

  const currentProjectOnChange = (e, selection) => {
    selection
      ? setState({ project: selection.name })
      : setState({ project: "" });
    if (selection) {
      fetchRetrospectives(selection.name);
      fetchSprints(selection.name);
      fetchStories();
    } else {
      fetchRetrospectives("");
      fetchSprints("");
      fetchStories("");
    }
  };

  const editSelectOnChange = (e, selection) => {
    selection
      ? setState({
          project: selection.project,
          sprint: selection.sprint,
          userstory: selection.userstory,
          subtask: selection.subtask,
          storypoints: selection.storypoints,
          originalhours: selection.originalhours,
          actualhours: selection.actualhours,
          reestimatehours: selection.reestimatehours,
        })
      : setState({
          project: "",
          sprint: "",
          userstory: "",
          subtask: "",
          storypoints: "",
          originalhours: "",
          actualhours: "",
          reestimatehours: "",
        });
  };

  const fetchRetrospectives = async (project) => {
    try {
      props.dataFromChild("running setup...");
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` { getallretroforproject ( project: "${project}" )
                  { project,sprint,userstory,subtask,originalstorypoints,originalhours,actualhours,reestimatehours } }`,
        }),
      });
      let payload = await response.json();
      console.log(payload);
      if (payload && payload.data && payload.data.getallretroforproject) {
        props.dataFromChild(
          `found ${payload.data.getallretroforproject.length} retrospectives`
        );
        console.log(payload.data.getallretroforproject);
        setState({
          resArr: payload.data.getallretroforproject,
        });
      } else {
        // handle error
        props.dataFromChild("Failed to fetch restrospective");
      }
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fetchProjectInfo = async () => {
    try {
      props.dataFromChild("running setup...");
      setState({
        project: "",
        sprint: "",
        userstory: "",
        subtask: "",
        storypoints: "",
        originalhours: "",
        actualhours: "",
        reestimatehours: "",
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
      props.dataFromChild(`Problem loading server data.`);
    }
  };

  const fetchSprints = async (project) => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{getallsprintsperproject(project:"${project}"){sprint,numberofuserstory,project,team,storypoints}}`,
        }),
      });
      let payload = await response.json();
      props.dataFromChild(
        `found ${payload.data.getallsprintsperproject.length} sprints`
      );
      setState({
        sprintArr: payload.data.getallsprintsperproject,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fetchStories = async () => {
    try {
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
      setState({
        storyArr: payload.data.getalluserstory,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fetchSubtasks = async (userstory) => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` { getallsubtaskbyuserstory ( userstory:"${userstory}" )
                    { subtask,userstory,status,assignedmember } } `,
        }),
      });
      let payload = await response.json();
      props.dataFromChild(
        `found ${payload.data.getallsubtaskbyuserstory.length} subtasks`
      );
      setState({
        subtaskArr: payload.data.getallsubtaskbyuserstory,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const addRetrospective = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { addsprintretrospective ( project: "${state.project}", team: "${state.team}", sprint: "${state.sprint}", userstory: "${state.userstory}", subtask: "${state.subtask}", actualhours: ${state.actualhours}, reestimatehours: ${state.reestimatehours} )
                            { project, sprint, userstory, subtask, originalstorypoints, originalhours, actualhours, reestimatehours } } `,
        }),
      });
      let payload = await response.json();
      console.log(payload);

      if (payload && payload.data && payload.data.addsprintretrospective) {
        props.dataFromChild(
          `found ${payload.data.addsprintretrospective.length} retrospectives`
        );
        console.log(payload.data.addsprintretrospective);
      } else {
        // handle error
        props.dataFromChild("Failed to fetch restrospective");
      }
      fetchRetrospectives(state.project);

      setState({
        project: "",
        sprint: "",
        userstory: "",
        subtask: "",
        storypoints: "",
        originalhours: "",
        actualhours: "",
        reestimatehours: "",
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const updateRetrospective = async () => {
    try {
      await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { updateretrospectivereestimates ( project: "${state.project}", sprint: "${state.sprint}", userstory: "${state.userstory}", subtask: "${state.subtask}", reestimatehours: ${state.reestimatehours} )
                    { project, sprint, userstory, subtask, originalstorypoints, originalhours, actualhours, reestimatehours } } `,
        }),
      });
      setState({
        project: "",
        sprint: "",
        userstory: "",
        subtask: "",
        storypoints: "",
        originalhours: "",
        actualhours: "",
        reestimatehours: "",
      });
      fetchRetrospectives();
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
          Sprint Retrospective
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
            <Table aria-label="retro table">
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
                    Project Name
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
                    Sprint Name
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
                    Subtasks
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
                    Original Hours (Est)
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
                    Actual Hours
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
                    Re-Estimate to Complete
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
                      {row.subtask}
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
                    <TableCell
                      component="th"
                      scope="row"
                      style={{
                        color: theme.palette.primary.main,
                        textAlign: "center",
                        fontSize: 14,
                      }}
                    >
                      {row.originalhours}
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
                      {row.actualhours}
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
                      {row.reestimatehours}
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
                    <Autocomplete
                      onChange={sprintOnChange}
                      id="sprint"
                      options={state.sprintArr}
                      getOptionLabel={(option) => option.sprint}
                      style={{
                        width: 175,
                        height: 20,
                        paddingTop: "2vh",
                        paddingBottom: "10vh",
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="sprints"
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
                      options={state.storyArr}
                      getOptionLabel={(option) => option.userstory}
                      style={{
                        width: 375,
                        height: 20,
                        paddingTop: "2vh",
                        paddingBottom: "10vh",
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="user stories"
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
                      onChange={subtaskOnChange}
                      id="subtask"
                      options={state.subtaskArr}
                      getOptionLabel={(option) => option.subtask}
                      style={{
                        width: 375,
                        height: 20,
                        paddingTop: "2vh",
                        paddingBottom: "10vh",
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="subtasks"
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
                      id="oghours-field"
                      onChange={storypointsOnChange}
                      value={state.storypoints}
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
                      id="oghours-field"
                      onChange={originalhoursOnChange}
                      value={state.originalhours}
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
                      id="actualhours-field"
                      onChange={actualhoursOnChange}
                      value={state.actualhours}
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
                      id="reestimatehours-field"
                      onChange={reestimatehoursOnChange}
                      value={state.reestimatehours}
                      type="number"
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Button
                      style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                      variant="contained"
                      onClick={addRetrospective}
                      disabled={buttonEnabled}
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
                      onClick={updateRetrospective}
                      disabled={updateButtonEnabled}
                    >
                      UPDATE
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
            Choose Retrospective to Edit
          </Typography>
          <div align="center">
            <Autocomplete
              onChange={editSelectOnChange}
              id="sprint"
              options={state.resArr}
              getOptionLabel={(option) => option.subtask}
              style={{
                width: 650,
                height: 20,
                paddingTop: "2vh",
                paddingBottom: "10vh",
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="retrospectives"
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
export default Retrospective;
