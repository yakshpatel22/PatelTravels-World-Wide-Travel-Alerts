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
import theme from "./theme";
import "../App.css";
import logo from "../assets/ProjectInfo.png";
const GRAPHURL = "http://localhost:5000/graphql";

const ProjectInfo = (props) => {
  const initialState = {
    resArr: [],
    name: "",
    description: "",
    numberofteammembers: "",
    teamname: "",
    numberofsprints: "",
    velocity: "",
    storypointsconversion: "",
    costperhour: "",
    reset: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const buttonEnabled =
    state.name === undefined ||
    state.name === "" ||
    state.description === undefined ||
    state.description === "" ||
    state.numberofteammembers === undefined ||
    state.numberofteammembers === "" ||
    state.teamname === undefined ||
    state.teamname === "" ||
    state.numberofsprints === undefined ||
    state.numberofsprints === "" ||
    state.velocity === undefined ||
    state.velocity === "" ||
    state.storypointsconversion === undefined ||
    state.storypointsconversion === "" ||
    state.costperhour === undefined ||
    state.costperhour === "";
  const deleteButtonEnabled =
    state.name === undefined ||
    state.name === "" ||
    state.teamname === undefined ||
    state.teamname === "";

  useEffect(() => {
    fetchProjectInfo();
  }, []);

  const nameOnChange = (e) => {
    setState({ name: e.target.value });
  };

  const descOnChange = (e) => {
    setState({ description: e.target.value });
  };

  const numberofteammembersOnChange = (e) => {
    setState({ numberofteammembers: e.target.value });
  };

  const teamnameOnChange = (e) => {
    setState({ teamname: e.target.value });
  };

  const sprintsOnChange = (e) => {
    setState({ numberofsprints: e.target.value });
  };

  const velocityOnChange = (e) => {
    setState({ velocity: e.target.value });
  };

  const storypointOnChange = (e) => {
    setState({ storypointsconversion: e.target.value });
  };

  const costperhourOnChange = (e) => {
    setState({ costperhour: e.target.value });
  };

  const editSelectOnChange = (e, selection) => {
    selection
      ? setState({
          name: selection.name,
          description: selection.description,
          teamname: selection.teamname,
          numberofteammembers: selection.numberofteammembers,
          numberofsprints: selection.numberofsprints,
          velocity: selection.velocity,
          storypointsconversion: selection.storypointsconversion,
          costperhour: selection.costperhour,
        })
      : setState({
          name: "",
          description: "",
          teamname: "",
          numberofteammembers: "",
          numberofsprints: "",
          velocity: "",
          storypointsconversion: "",
          costperhour: "",
        });
  };

  const fetchProjectInfo = async () => {
    try {
      props.dataFromChild("running setup...");
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query:
            "{getallproject{name,description,teamname,numberofteammembers,numberofsprints,velocity,storypointsconversion,costperhour}}",
        }),
      });
      let payload = await response.json();
      console.log(payload);
      props.dataFromChild(
        `found ${payload.data.getallproject.length} projects`
      );
      console.log(payload.data);
      setState({
        resArr: payload.data.getallproject,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const addProjectInfo = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `mutation { 
          addproject (
            name: "${state.name}", 
            description: "${state.description}", 
            teamname: "${state.teamname}", 
            numberofteammembers: ${state.numberofteammembers}, 
            numberofsprints: ${state.numberofsprints}, 
            velocity: ${state.velocity}, 
            storypointsconversion: ${state.storypointsconversion}, 
            costperhour: ${state.costperhour} 
          ) {
            name, 
            description, 
            teamname, 
            numberofteammembers, 
            numberofsprints, 
            velocity, 
            storypointsconversion, 
            costperhour 
          } 
        }`,
        }),
      });
      let payload = await response.json();
      console.log(payload);

      if (payload.data && payload.data.addproject) {
        // check if data is not null
        props.dataFromChild(
          `added info for ${payload.data.addproject.name} project`
        );
      } else {
        props.dataFromChild("Failed to add project");
      }

      setState({
        name: "",
        description: "",
        teamname: "",
        numberofteammembers: "",
        numberofsprints: "",
        velocity: "",
        storypointsconversion: "",
        costperhour: "",
        reset: true,
      });
      fetchProjectInfo();
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const editProjectInfo = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { updateproject ( name: "${state.name}", description: "${state.description}", teamname: "${state.teamname}", numberofteammembers: ${state.numberofteammembers}, numberofsprints: ${state.numberofsprints}, velocity: ${state.velocity}, storypointsconversion: ${state.storypointsconversion}, costperhour: ${state.costperhour} )
                            { name, description, teamname, numberofteammembers, numberofsprints, velocity, storypointsconversion, costperhour } } `,
        }),
      });
      let payload = await response.json();
      console.log(payload);
      if (payload.data && payload.data.updateproject) {
        // check if data is not null
        props.dataFromChild(
          `updated info for ${payload.data.updateproject.name} project`
        );
      } else {
        props.dataFromChild("Failed to update project");
      }
      setState({
        name: "",
        description: "",
        teamname: "",
        numberofteammembers: "",
        numberofsprints: "",
        velocity: "",
        storypointsconversion: "",
        costperhour: "",
        reset: true,
      });
      fetchProjectInfo();
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const deleteProjectInfo = async () => {
    try {
      props.dataFromChild("running setup...");
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` { deletespecificproject ( name:"${state.name}", teamname:"${state.teamname}" ) } `,
        }),
      });
      let payload = await response.json();
      console.log(payload);
      props.dataFromChild(payload.data.deletespecificproject);
      setState({
        name: "",
        description: "",
        teamname: "",
        numberofteammembers: "",
        numberofsprints: "",
        velocity: "",
        storypointsconversion: "",
        costperhour: "",
        reset: true,
      });
      fetchProjectInfo();
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
          Project Info
        </Typography>
        <CardContent>
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
                    Description
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
                    Team Number
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
                    Number of Sprints
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
                    Velocity
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
                    Storypoint Hours
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
                    Cost Per Hour
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
                      {row.name}
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
                      {row.description}
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
                      {row.teamname}
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
                      {row.numberofteammembers}
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
                      {row.numberofsprints}
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
                      {row.velocity}
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
                      {row.storypointsconversion}
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
                      {row.costperhour}
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
                      id="project-name-field"
                      onChange={nameOnChange}
                      value={state.name}
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
                      id="description-field"
                      onChange={descOnChange}
                      value={state.description}
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
                      id="team-name-field"
                      onChange={teamnameOnChange}
                      value={state.teamname}
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
                      id="team-number-field"
                      onChange={numberofteammembersOnChange}
                      value={state.numberofteammembers}
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
                      id="sprints-field"
                      onChange={sprintsOnChange}
                      value={state.numberofsprints}
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
                      id="velocity-field"
                      onChange={velocityOnChange}
                      value={state.velocity}
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
                      id="story-point-field"
                      onChange={storypointOnChange}
                      value={state.storypointsconversion}
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
                      id="cost-per-hour-field"
                      onChange={costperhourOnChange}
                      value={state.costperhour}
                      type="number"
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                        variant="contained"
                        onClick={addProjectInfo}
                        disabled={buttonEnabled}
                      >
                        ADD
                      </Button>
                      <Button
                        style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                        variant="contained"
                        onClick={editProjectInfo}
                        disabled={buttonEnabled}
                      >
                        EDIT
                      </Button>
                      <Button
                        style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                        variant="contained"
                        onClick={deleteProjectInfo}
                        disabled={deleteButtonEnabled}
                      >
                        DELETE
                      </Button>
                    </div>
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
            Choose Project to Edit
          </Typography>
          <div align="center">
            <Autocomplete
              onChange={editSelectOnChange}
              key={state.reset}
              id="project"
              options={state.resArr}
              getOptionLabel={(option) =>
                option.name + " by " + option.teamname
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
                  label="project info"
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
export default ProjectInfo;
