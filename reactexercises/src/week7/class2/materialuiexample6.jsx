import React, { useReducer } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
 Card,
 CardHeader,
 CardContent,
 IconButton,
 Snackbar,
 TextField,
} from "@mui/material";
import theme from "./theme";
import "../../App.css";
import AddCircle from "@mui/icons-material/AddCircle";
const MaterialUIEx6Component = () => {
 const initialState = {
 showMsg: false,
 snackbarMsg: "",
 name: "",
 age: 0,
 email: "",
 };
 const reducer = (state, newState) => ({ ...state, ...newState });
 const [state, setState] = useReducer(reducer, initialState);
const onAddClicked = async () => {
 let user = {
 name: state.name,
 age: state.age,
 email: state.email,
 };
 let myHeaders = new Headers();
 myHeaders.append("Content-Type", "application/json");
 try {
 let query = JSON.stringify({
 query: `mutation {adduser(name: "${user.name}",age: ${user.age}, email: "${user.email}" )
{ name, age, email }}`,
 });
 console.log(query);
 let response = await fetch("http://localhost:5000/graphql", {
 method: "POST",
 headers: {
 "Content-Type": "application/json; charset=utf-8",
 },
 body: query,
 });
 let json = await response.json();
 setState({
 showMsg: true,
 snackbarMsg: `User ${json.data.adduser.name} added`,
 name: "",
 age: 0,
 email: "",
 });
 } catch (error) {
 setState({
 snackbarMsg: `${error.message} - user not added`,
 showMsg: true,
 });
 }
 };
 const snackbarClose = () => {
 setState({ showMsg: false });
 };
 const handleNameInput = (e) => {
 setState({ name: e.target.value });
 };
 const handleAgeInput = (e) => {
 let age = parseInt(e.target.value);
 age > 0 ? setState({ age: age }) : setState({ age: 0 });
 };
 const handleEmailInput = (e) => {
 setState({ email: e.target.value });
 };
 const emptyorundefined =
 state.name === undefined ||
 state.name === "" ||
 state.age === undefined ||
 state.age === 0 ||
 state.email === undefined ||
 state.email === "";
 return (
 <ThemeProvider theme={theme}>
 <Card className="card">
 <CardHeader
 title="MaterialUIEx6 - Add A User"
 color="inherit"
 style={{ textAlign: "center" }}
 />
 <CardContent>
 <TextField
 onChange={handleNameInput}
 placeholder="Enter user's name here"
 value={state.name}
 />
 <p></p>
 <TextField
 onChange={handleAgeInput}
 placeholder="Enter user's age here"
 value={state.age}
 />
 <p></p>
 <TextField
 onChange={handleEmailInput}
 value={state.email}
 placeholder="Enter user's email here"
 />
 <p></p>
 <IconButton
 color="secondary"
 style={{ marginTop: 50, float: "right" }}
 onClick={onAddClicked}
 disabled={emptyorundefined}
 >
 <AddCircle fontSize="large" />
 </IconButton>
 <Snackbar
 open={state.showMsg}
 message={state.snackbarMsg}
 autoHideDuration={4000}
 onClose={snackbarClose}
 />
 </CardContent>
 </Card>
 </ThemeProvider>
 );
};
export default MaterialUIEx6Component;