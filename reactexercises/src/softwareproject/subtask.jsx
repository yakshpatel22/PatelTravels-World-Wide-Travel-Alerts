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
import logo from "../assets/Subtask.png";

const GRAPHURL = "http://localhost:5000/graphql";
const Subtask = (props) => {
  const initialState = {
    resArr: [],
    storyArr: [],
    memberArr: [],
    userstory: "",
    subtask: "",
    assignedmember: "",
    status: "",
    reset: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const buttonEnabled =
    state.userstory === undefined ||
    state.userstory === "" ||
    state.subtask === undefined ||
    state.subtask === "";
  const editButtonEnabled =
    state.userstory === undefined ||
    state.userstory === "" ||
    state.subtask === undefined ||
    state.subtask === "" ||
    state.assignedmember === undefined ||
    state.assignedmember === "" ||
    state.status === undefined ||
    state.status === "";

  useEffect(() => {
    fetchUserStories();
    fetchSubtaskInfo();
    fetchMemberInfo();
  }, []);

  const currentStoryOnChange = (e, selection) => {
    selection
      ? setState({ userstory: selection.userstory })
      : setState({ userstory: "" });
  };

  const subtaskOnChange = (e) => {
    setState({ subtask: e.target.value });
  };

  const assignedmemberOnChange = (e, selection) => {
    selection
      ? setState({
          assignedmember: selection.firstname + " " + selection.lastname,
        })
      : setState({ assignedmember: "" });
  };

  const statusOnChange = (e) => {
    setState({ status: e.target.value });
  };

  const editSelectOnChange = (e, selection) => {
    selection
      ? setState({
          userstory: selection.userstory,
          subtask: selection.subtask,
          assignedmember: selection.assignedmember,
          status: selection.status,
        })
      : setState({
          userstory: "",
          subtask: "",
          assignedmember: "",
          status: "",
        });
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
        storyArr: payload.data.getalluserstory,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fetchSubtaskInfo = async () => {
    try {
      props.dataFromChild("running setup...");
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: "{getallsubtasks{subtask,userstory,assignedmember,status}}",
        }),
      });
      let payload = await response.json();
      props.dataFromChild(
        `found ${payload.data.getallsubtasks.length} projects`
      );
      console.log(payload.data.getallsubtasks);
      setState({
        resArr: payload.data.getallsubtasks,
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

  const addSubtask = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { addsubtask ( userstory: "${state.userstory}", subtask: "${state.subtask}", "assignedmember" : "${state.assignedmember}" )
                            { userstory, subtask, assignedmember, status } } `,
        }),
      });
      let payload = await response.json();
      if (
        payload &&
        payload.data &&
        payload.data.addsubtask &&
        payload.data.addsubtask.userstory
      ) {
        props.dataFromChild(`added info for ${state.userstory} project`);
      } else {
        props.dataFromChild("failed to add subtask");
      }
      fetchSubtaskInfo();

      setState({
        userstory: "",
        subtask: "",
        assignedmember: "",
        status: "",
        reset: true,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const editSubtask = async () => {
    try {
      await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { assignmembertosubtask ( subtask: "${state.subtask}", assignedmember: "${state.assignedmember}", userstory: "${state.userstory}" )
                            { userstory, subtask, assignedmember, status } } `,
        }),
      });
      await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` mutation { updatesubtaskstatus ( subtask: "${state.subtask}", status: "${state.status}", userstory: "${state.userstory}" )
                            { userstory, subtask, assignedmember, status } } `,
        }),
      });
      setState({
        userstory: "",
        subtask: "",
        assignedmember: "",
        status: "",
        reset: true,
      });
      fetchSubtaskInfo();
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const deleteSubtask = async () => {
    try {
      props.dataFromChild("running setup...");
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: ` { deletesubtaskbyuserstory ( userstory:"${state.userstory}", subtask:"${state.subtask}" ) } `,
        }),
      });
      let payload = await response.json();
      props.dataFromChild(payload.data.deletesubtaskbyuserstory);
      setState({
        userstory: "",
        subtask: "",
        assignedmember: "",
        status: "",
        reset: true,
      });
      fetchSubtaskInfo();
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
          Subtask Info
        </Typography>
        <CardContent>
          <TableContainer component={Paper}>
            <Table aria-label="subtask table">
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
                    Subtask
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
                    Assigned member
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
                      {row.assignedmember}
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
                      onChange={currentStoryOnChange}
                      id="userstory"
                      options={state.storyArr}
                      getOptionLabel={(option) => option.userstory}
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
                      id="subtask-field"
                      onChange={subtaskOnChange}
                      value={state.subtask}
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
                        onClick={addSubtask}
                        disabled={buttonEnabled}
                      >
                        ADD
                      </Button>
                      <Button
                        style={{
                          backgroundColor: "#4CAF50",
                          color: "#fff",
                        }}
                        variant="contained"
                        onClick={editSubtask}
                        disabled={editButtonEnabled}
                      >
                        EDIT
                      </Button>
                      <Button
                        style={{
                          backgroundColor: "#4CAF50",
                          color: "#fff",
                        }}
                        variant="contained"
                        onClick={deleteSubtask}
                        disabled={buttonEnabled}
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
            Choose Sub Task to Edit
          </Typography>
          <div align="center">
            <Autocomplete
              onChange={editSelectOnChange}
              key={state.reset}
              id="subtask"
              options={state.resArr}
              getOptionLabel={(option) => option.subtask}
              style={{
                width: 600,
                height: 20,
                paddingTop: "2vh",
                paddingBottom: "10vh",
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subtask info"
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
export default Subtask;
