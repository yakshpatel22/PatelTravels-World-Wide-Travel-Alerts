//CASESTUDY APP.JSX :-
// import React, { useState, useReducer } from "react";
// import { Routes, Route, NavLink, redirect } from "react-router-dom";
// import MenuIcon from "@mui/icons-material/Menu";
// import { ThemeProvider } from "@mui/material/styles";
// import theme from "./week7/class1/theme";
// import {
//   Toolbar,
//   AppBar,
//   Menu,
//   MenuItem,
//   IconButton,
//   Typography,
//   Snackbar,
// } from "@mui/material";
// import Project1components from "./project1/project1components";
// import AlertComponent from "./project1/alertComponent";
// import AdvisoryAdd from "./project1/advisoryaddcomponent";
// import AdvisoryList from "./project1/listadvisorycomponent";

// const App = () => {
//   const initialState = {
//     snackBarMsg: "",
//     msgFromParent: "data from parent",
//     gotData: false,
//     anchorEl: null,
//   };
//   const reducer = (state, newState) => ({ ...state, ...newState });
//   const [state, setState] = useReducer(reducer, initialState);
//   const handleClose = () => {
//     setState({ anchorEl: null });
//   };
//   const handleClick = (event) => {
//     setState({ anchorEl: event.currentTarget });
//   };
//   const snackbarClose = () => {
//     setState({ gotData: false });
//   };
//   const msgFromChild = (msg) => {
//     setState({ snackBarMsg: msg, gotData: true });
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <AppBar>
//         <Toolbar>
//           <Typography variant="h6" color="inherit">
//             INFO3139 - Case#1
//           </Typography>
//           <IconButton
//             onClick={handleClick}
//             color="inherit"
//             style={{ marginLeft: "auto", paddingRight: "1vh" }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Menu
//             anchorEl={state.anchorEl}
//             open={Boolean(state.anchorEl)}
//             onClose={handleClose}
//           >
//             <MenuItem component={NavLink} to="/home" onClick={handleClose}>
//               Home
//             </MenuItem>
//             <MenuItem component={NavLink} to="/reset" onClick={handleClose}>
//               Reset Data
//             </MenuItem>
//             <MenuItem component={NavLink} to="/advisory" onClick={handleClose}>
//               Add Advisory
//             </MenuItem>
//             <MenuItem component={NavLink} to="/list" onClick={handleClose}>
//               List Advisory
//             </MenuItem>
//           </Menu>
//         </Toolbar>
//       </AppBar>
//       <Routes>
//         <Route path="/" element={<Project1components />} />
//         <Route path="/home" element={<Project1components />} />
//         <Route
//           path="/reset"
//           element={<AlertComponent dataFromChild={msgFromChild} />}
//         />
//         <Route
//           path="/advisory"
//           element={<AdvisoryAdd dataFromChild={msgFromChild} />}
//         />
//         <Route
//           path="/list"
//           element={<AdvisoryList dataFromChild={msgFromChild} />}
//         />
//       </Routes>
//       <Snackbar
//         open={state.gotData}
//         message={state.snackBarMsg}
//         autoHideDuration={3000}
//         onClose={snackbarClose}
//       />
//     </ThemeProvider>
//   );
// };
// export default App;
// import React from "react";
// import Lab12 from "./week7/class1/lab12";
// const App = () => <Lab12 />
// export default App;

// import Scenario1Test from "./project2/Scenario1Test";
// function App() {
//   return (
//     <div>
//       <Scenario1Test />
//     </div>
//   );
// }
// export default App;

// import SprintSummary from "./ManagingNew/SprintSummary";
// function App() {
//   return (
//     <div>
//       <SprintSummary />
//     </div>
//   );
// }
// export default App;
// import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHandshake } from "@fortawesome/free-solid-svg-icons";
// import { Routes, Route, NavLink } from "react-router-dom";
// import MenuIcon from "@mui/icons-material/Menu";
// import { ThemeProvider } from "@mui/material/styles";
// import theme from "./theme";
// import {
//   Toolbar,
//   AppBar,
//   Menu,
//   MenuItem,
//   IconButton,
//   Typography,
//   Link,
// } from "@mui/material";
// import LoginComponent from "./3112Frontend/LoginComponent";
// import MainpageComponent from "./3112Frontend/MainpageComponent";

// const Footer = () => {
//   return (
//     <AppBar
//       position="fixed"
//       style={{ top: "auto", bottom: 0, backgroundColor: "#686A6C" }}
//     >
//       <Toolbar style={{ display: "flex", justifyContent: "flex-end" }}>
//         <Typography
//           variant="h6"
//           color="inherit"
//           style={{ fontSize: 14, textAlign: "right" }}
//         >
//           &copy;HES Software Company
//         </Typography>
//       </Toolbar>
//     </AppBar>
//   );
// };

// const styles = {
//   toolbar: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   typography: {
//     marginRight: "5rem",
//   },
// };

// const App = () => {
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <AppBar>
//         <Toolbar style={styles.toolbar}>
//           <Typography
//             component={NavLink}
//             to="/"
//             variant="h6"
//             color="inherit"
//             textAlign={"left"}
//             style={{ fontSize: 27, ...styles.typography }}
//           >
//             <FontAwesomeIcon icon={faHandshake} /> sprinTCompass
//           </Typography>

//           <div className="menu-items">
//             <MenuItem
//               style={{ fontWeight: "bold" }}
//               component={NavLink}
//               to="/home"
//             >
//               Home
//             </MenuItem>
//             <MenuItem
//               style={{ fontWeight: "bold" }}
//               component={NavLink}
//               to="/login"
//             >
//               Login
//             </MenuItem>
//           </div>

//           <IconButton id="menubtn" onClick={handleClick} color="inherit">
//             <MenuIcon />
//           </IconButton>

//           <Menu
//             id="simple-menu"
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleClose}
//           >
//             <MenuItem component={NavLink} to="/home" onClick={handleClose}>
//               Home
//             </MenuItem>
//             <MenuItem component={NavLink} to="/login" onClick={handleClose}>
//               Login
//             </MenuItem>
//           </Menu>
//         </Toolbar>
//       </AppBar>
//       <Routes>
//         <Route path="/" element={<MainpageComponent />} />
//         <Route path="/home" element={<MainpageComponent />} />
//         <Route path="/login" element={<LoginComponent />} />
//       </Routes>

//       <Footer />
//     </ThemeProvider>
//   );
// };

//export default App;
import React, { useState, useReducer } from "react";
import { Routes, Route, Link, Outlet, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import HomeComponent from "./softwareproject/homecomponent";
import ProjectInfo from "./softwareproject/projectinfo";
import MemberInfo from "./softwareproject/memberinfo";
import Sprint from "./softwareproject/sprint";
import Userstory from "./softwareproject/userstory";
import Subtask from "./softwareproject/subtask";
import Retrospective from "./softwareproject/retrospective";
import Backlog from "./softwareproject/backlog.jsx";
import ReportComponent from "./softwareproject/reportcomponent";
import {
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Snackbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./App.css";
import theme from "./theme";
const App = () => {
  const initialState = {
    gotData: false,
    anchorEl: null,
    snackBarMsg: "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setState({ anchorEl: event.currentTarget });
  };

  const handleClose = () => {
    setState({ anchorEl: null });
  };

  const snackbarClose = () => {
    setState({ gotData: false });
  };

  const msgFromChild = (msg) => {
    setState({ snackBarMsg: msg, gotData: true });
  };

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              INFO3112 - Final Project
            </Typography>
            <IconButton
              onClick={handleClick}
              color="inherit"
              sx={{ marginLeft: "auto", paddingRight: "1vh" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={state.anchorEl}
              open={Boolean(state.anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={Link} to="/home" onClick={handleClose}>
                Home
              </MenuItem>
              <MenuItem component={Link} to="/info" onClick={handleClose}>
                Project Info
              </MenuItem>
              <MenuItem
                component={Link}
                to="/teammembers"
                onClick={handleClose}
              >
                Member Info
              </MenuItem>
              <MenuItem component={Link} to="/backlog" onClick={handleClose}>
                Backlog
              </MenuItem>
              <MenuItem component={Link} to="/sprints" onClick={handleClose}>
                Sprint Info
              </MenuItem>
              <MenuItem
                component={Link}
                to="/userstories"
                onClick={handleClose}
              >
                User Story Info
              </MenuItem>
              <MenuItem component={Link} to="/subtasks" onClick={handleClose}>
                Subtask Info
              </MenuItem>
              <MenuItem
                component={Link}
                to="/retrospectives"
                onClick={handleClose}
              >
                Retrospectives
              </MenuItem>
              <MenuItem component={Link} to="/report" onClick={handleClose}>
                Report
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Snackbar
          open={state.gotData}
          message={state.snackBarMsg}
          autoHideDuration={4000}
          onClose={snackbarClose}
        />
        <Routes>
          <Route path="/" element={<HomeComponent sendData={msgFromChild} />} />
          <Route
            path="/home"
            element={<HomeComponent sendData={msgFromChild} />}
          />
          <Route
            path="/info"
            element={<ProjectInfo dataFromChild={msgFromChild} />}
          />
          <Route
            path="/teammembers"
            element={<MemberInfo dataFromChild={msgFromChild} />}
          />
          <Route
            path="/backlog"
            element={<Backlog dataFromChild={msgFromChild} />}
          />
          <Route
            path="/sprints"
            element={<Sprint dataFromChild={msgFromChild} />}
          />
          <Route
            path="/userstories"
            element={<Userstory dataFromChild={msgFromChild} />}
          />
          <Route
            path="/subtasks"
            element={<Subtask dataFromChild={msgFromChild} />}
          />
          <Route
            path="/retrospectives"
            element={<Retrospective dataFromChild={msgFromChild} />}
          />
          <Route
            path="/report"
            element={<ReportComponent dataFromChild={msgFromChild} />}
          />
        </Routes>
      </ThemeProvider>
    </div>
  );
};
export default App;
