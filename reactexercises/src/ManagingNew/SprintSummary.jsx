import React, { useReducer, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  Autocomplete,
  CardHeader,
  CardContent,
  Snackbar,
  TextField,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DisplayBacklog from "./DisplayBacklog";
import theme from "./theme";
import "./SprintSummary.css";
const SprintSummary = () => {
  const initialState = {
    backlogs: [],
    dialogOpen: false,
    form: {
      sprint: "",
      asa: "",
      iwantto: "",
      sothatican: "",
      re: 0,
      rc: 0,
      member: "",
      actualhour: 0,
      subtasks: [],
      reestimate: 0,
    },
    snackbarOpen: false,
    snackbarMessage: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [backlogState, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    getBacklogs();
  }, []);

  const getBacklogs = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query:
            "query {getbacklog{_id,sprint,asa,iwantto,sothatican,re,rc,member,actualhour,subtask{description,actualhour,reestimate},reestimate}}",
        }),
      });
      let json = await response.json();
      setState({ backlogs: json.data.getbacklog });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddBacklog = async () => {
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `mutation {
            addBacklog(backlog: {
              sprint: "${backlogState.form.sprint}",
              asa: "${backlogState.form.asa}",
              iwantto: "${backlogState.form.iwantto}",
              sothatican: "${backlogState.form.sothatican}",
              re: ${backlogState.form.re},
              rc: ${backlogState.form.rc},
              member: "${backlogState.form.member}",
              actualhour: ${backlogState.form.actualhour},
              subtask: ${JSON.stringify(backlogState.form.subtasks)},
              reestimate: ${backlogState.form.reestimate}
            }) {
              _id
              sprint
              asa
              iwantto
              sothatican
              re
              rc
              member
              actualhour
              subtask {
                description
                actualhour
                reestimate
              }
              reestimate
            }
          }`,
        }),
      });
      const json = await response.json();
      setState({
        snackbarOpen: true,
        snackbarMessage: "Backlog added successfully",
        dialogOpen: false,
        form: {
          sprint: "",
          asa: "",
          iwantto: "",
          sothatican: "",
          re: 0,
          rc: 0,
          member: "",
          actualhour: 0,
          subtasks: [],
          reestimate: 0,
        },
        backlogs: [...backlogState.backlogs, json.data.addBacklog],
      });
      getBacklogs();
    } catch (error) {
      console.error(error);
      setState({
        snackbarOpen: true,
        snackbarMessage: "Failed to add backlog",
      });
    }
  };

  const handleDialogClose = () => {
    setState({
      dialogOpen: false,
      form: {
        sprint: "",
        asa: "",
        iwantto: "",
        sothatican: "",
        re: 0,
        rc: 0,
        member: "",
        actualhour: 0,
        subtasks: [],
        reestimate: 0,
      },
    });
  };

  const handleSnackbarClose = () => {
    setState({ snackbarOpen: false });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState({ form: { ...backlogState.form, [name]: value } });
  };

  const handleSubtaskChange = (event, index) => {
    const { name, value } = event.target;
    const subtasks = [...backlogState.form.subtasks];
    subtasks[index][name] = value;
    setState({ form: { ...backlogState.form, subtasks: subtasks } });
  };

  const handleAddSubtask = () => {
    const subtasks = [
      ...backlogState.form.subtasks,
      { description: "", actualhour: 0, reestimate: 0 },
    ];
    setState({ form: { ...backlogState.form, subtasks: subtasks } });
  };

  const handleRemoveSubtask = (index) => {
    const subtasks = [...backlogState.form.subtasks];
    subtasks.splice(index, 1);
    setState({ form: { ...backlogState.form, subtasks: subtasks } });
  };

  return (
    <Card className="card">
      <CardHeader
        title="Sprint Summary"
        style={{ color: theme.palette.primary.main, textAlign: "center" }}
      />
      <CardContent>
        <Button onClick={() => setState({ dialogOpen: true })}>
          Add Backlog
        </Button>
        <Table>
          <TableBody>
            {backlogState.backlogs.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <DisplayBacklog data={item} refreshMembers={getBacklogs} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={backlogState.dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Backlog</DialogTitle>
        <DialogContent>
          <TextField
            label="Sprint"
            name="sprint"
            value={backlogState.form.sprint}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="As a user, I want to..."
            name="asa"
            value={backlogState.form.asa}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="I want to..."
            name="iwantto"
            value={backlogState.form.iwantto}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="So that I can..."
            name="sothatican"
            value={backlogState.form.sothatican}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Estimate (RE)"
            name="re"
            type="number"
            value={backlogState.form.re}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Actual (RC)"
            name="rc"
            type="number"
            value={backlogState.form.rc}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Assigned Member"
            name="member"
            value={backlogState.form.member}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Actual Hour"
            name="actualhour"
            type="number"
            value={backlogState.form.actualhour}
            onChange={handleInputChange}
            fullWidth
          />
          <Table>
            <TableBody>
              {backlogState.form.subtasks.map((subtask, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      label="Subtask Description"
                      name="description"
                      value={subtask.description}
                      onChange={(event) => handleSubtaskChange(event, index)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Actual Hour"
                      name="actualhour"
                      type="number"
                      value={subtask.actualhour}
                      onChange={(event) => handleSubtaskChange(event, index)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Reestimate"
                      name="reestimate"
                      type="number"
                      value={subtask.reestimate}
                      onChange={(event) => handleSubtaskChange(event, index)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleRemoveSubtask(index)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleAddSubtask}>Add Subtask</Button>
          <TextField
            label="Reestimate"
            name="reestimate"
            type="number"
            value={backlogState.form.reestimate}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddBacklog}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={backlogState.snackbarOpen}
        message={backlogState.snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </Card>
  );
};

export default SprintSummary;
