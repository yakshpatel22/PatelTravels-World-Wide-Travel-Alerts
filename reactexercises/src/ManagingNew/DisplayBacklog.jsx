import React, { useReducer, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  CardContent,
  TextField,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import theme from "./theme";
import "./DisplayBacklog.css";
const DisplayBacklog = (props) => {
  const newSubtask = {
    description: "",
    descBool: false,
    actualhour: 0,
    hourBool: false,
    reestimate: 0,
    reBool: false,
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [newSub, setNew] = useReducer(reducer, props);
  // State to handle modal open status
  const [open, setOpen] = useState(false);

  const EditTask = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query:
            "mutation($_id: String, $sprint: String, $asa: String, $iwantto: String, $sothatican: String, $re: Float, $rc: Float, $member: String, $actualhour: Float, $subtask: [ISubtask], $reestimate: Float) { editbacklog(_id: $_id, sprint: $sprint, asa: $asa, iwantto: $iwantto, sothatican: $sothatican, re: $re, rc: $rc, member: $member, actualhour: $actualhour, subtask: $subtask, reestimate: $reestimate) {_id} }",
          variables: {
            _id: props.data._id,
            sprint: props.data.sprint,
            asa: props.data.asa,
            iwantto: props.data.iwantto,
            sothatican: props.data.sothatican,
            re: props.data.re,
            rc: props.data.rc,
            member: props.data.member,
            actualhour: props.data.actualhour,
            subtask: props.data.subtask,
            reestimate: props.data.reestimate,
          },
        }),
      });
      await response;
    } catch (error) {
      console.log(error);
    }
    props.refreshMembers();
  };

  const DeleteBacklog = async () => {
    try {
      let response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          query: `mutation($_id: String!) {
              deleteBacklog(_id: $_id) {
                _id
              }
            }`,
          variables: {
            _id: props.data._id,
          },
        }),
      });
      await response;
    } catch (error) {
      console.log(error);
    }
    props.refreshMembers();
  };
  const addSubTask = () => {
    props.data.subtask.push(newSub);
    console.log(props.data.subtask);
    setNew({
      description: "",
      descBool: false,
      actualhour: 0,
      hourBool: false,
      reestimate: 0,
      reBool: false,
    });
  };
  const DeleteSubtask = (index) => {
    let removed = props.data.subtask.splice(index, 1);
  };

  const onChangeSprint = (e) => {
    if (e !== null) {
      props.data.sprint = e;
    }
  };
  const onChangeRE = (e) => {
    if (e !== null) {
      props.data.re = e;
    }
  };
  const onChangeRC = (e) => {
    if (e !== null) {
      props.data.rc = e;
    }
  };
  const onChangeASA = (e) => {
    if (e !== null) {
      props.data.asa = e;
    }
  };
  const onChangeIWANTTO = (e) => {
    if (e !== null) {
      props.data.iwantto = e;
    }
  };
  const onChangeSOTHAT = (e) => {
    if (e !== null) {
      props.data.sothatican = e;
    }
  };
  const onChangeMember = (e) => {
    if (e !== null) {
      props.data.member = e;
    }
  };
  const onChangeReestimate = (e) => {
    if (e !== null) {
      props.data.reestimate = e;
    }
  };
  const onChangeTotalHours = (e) => {
    if (e !== null) {
      props.data.actualhour = e;
    }
  };
  const onChangeDescription = (e, index) => {
    if (index === undefined) {
      setNew({ description: e, descBool: true });
    } else {
      if (e !== null) {
        props.data.subtask[index].description = e;
      }
    }
  };
  const onChangeSubHours = (e, index) => {
    if (index === undefined) {
      setNew({ actualhour: e, hourBool: true });
    } else {
      if (e !== null) {
        props.data.subtask[index].actualhour = e;
      }
    }
  };
  const onChangeSubRe = (e, index) => {
    if (index === undefined) {
      setNew({ reestimate: e, reBool: true });
    } else {
      if (e !== null) {
        props.data.subtask[index].reestimate = e;
      }
    }
  };
  return (
    <CardContent>
      <br />
      <div>
        <TextField
          onChange={(e) => onChangeSprint(e.target.value)}
          placeholder="Enter a sprint"
          defaultValue={props.data.sprint}
          label="Sprint"
        ></TextField>
        <TextField
          onChange={(e) => onChangeRE(e.target.value)}
          placeholder="Enter the relative estimate"
          defaultValue={props.data.re}
          type="number"
          label="Relative Estimate"
        ></TextField>
        <TextField
          onChange={(e) => onChangeRC(e.target.value)}
          placeholder="Enter the relative cost"
          defaultValue={props.data.rc}
          type="number"
          label="Relative Cost"
        ></TextField>
      </div>
      <div>
        <TextField
          onChange={(e) => onChangeASA(e.target.value)}
          placeholder="Enter the 'as a'"
          defaultValue={props.data.asa}
          label="As a"
        ></TextField>
        <TextField
          onChange={(e) => onChangeIWANTTO(e.target.value)}
          placeholder="Enter the 'I want to'"
          defaultValue={props.data.iwantto}
          label="I want to"
        ></TextField>
        <TextField
          onChange={(e) => onChangeSOTHAT(e.target.value)}
          placeholder="Enter the 'so that I can'"
          defaultValue={props.data.sothatican}
          label="So that I can"
        ></TextField>
      </div>
      <div>
        <TextField
          onChange={(e) => onChangeMember(e.target.value)}
          placeholder="Enter the member"
          defaultValue={props.data.member}
          label="Member"
        ></TextField>
        <TextField
          onChange={(e) => onChangeReestimate(e.target.value)}
          placeholder="Enter the re-estimate"
          defaultValue={props.data.reestimate}
          type="number"
          label="Re-estimate"
        ></TextField>
        <TextField
          onChange={(e) => onChangeTotalHours(e.target.value)}
          placeholder="Enter the total hours"
          defaultValue={props.data.actualhour}
          type="number"
          label="Actual Hours"
        ></TextField>
      </div>
      <ThemeProvider theme={theme}>
        <div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Actual Hours</TableCell>
                <TableCell>Re-estimate</TableCell>
              </TableRow>
              {props.data.subtask?.map((item, index) => (
                <TableRow key={item.description}>
                  <TableCell>
                    <TextField
                      onChange={(e) =>
                        onChangeDescription(e.target.value, index)
                      }
                      placeholder="Enter the description"
                      defaultValue={item.description}
                    ></TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={(e) => onChangeSubHours(e.target.value, index)}
                      placeholder="Enter the total hours"
                      defaultValue={item.actualhour}
                      type="number"
                    ></TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={(e) => onChangeSubRe(e.target.value, index)}
                      placeholder="Enter the total hours"
                      defaultValue={item.reestimate}
                      type="number"
                    ></TextField>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => DeleteSubtask(index)}>
                      Delete Subtask
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <TextField
                    onChange={(e) => onChangeDescription(e.target.value)}
                    placeholder="Enter the description"
                    defaultValue={newSub.description}
                  ></TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    onChange={(e) => onChangeSubHours(e.target.value)}
                    placeholder="Enter the total hours"
                    type="number"
                    defaultValue={newSub.actualhour}
                  ></TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    onChange={(e) => onChangeSubRe(e.target.value)}
                    placeholder="Enter the re-estimate"
                    type="number"
                    defaultValue={newSub.reestimate}
                  ></TextField>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={addSubTask}
                    disabled={
                      !newSub.descBool || !newSub.hourBool || !newSub.reBool
                    }
                  >
                    Add Subtask
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </ThemeProvider>
      <div>
        <Button onClick={EditTask}>Edit Task</Button>

        <Button onClick={DeleteBacklog}>Delete Task</Button>
      </div>
    </CardContent>
  );
};
export default DisplayBacklog;
