import React from "react";
import theme from "./theme";
//import { CardContent, Typography } from "@mui/material";
import "../App.css";
import logo from "../assets/logo.png";
import { ThemeProvider } from "@mui/material/styles";
import {
  AppBar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
} from "@mui/material";
const Project1components = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppBar color="primary"></AppBar>
      <Card style={{ marginTop: "20%" }}>
        <CardMedia style={{ textAlign: "center", paddingTop: "3vh" }}>
          <img className="photo" src={logo} alt="LOGO"></img>
        </CardMedia>
        <CardHeader
          title="World Wide Travel Alerts"
          color="primary"
          style={{ textAlign: "center" }}
        />
        <CardContent>
          <div className="copyRight" alt="copy">
            INFO3139 - 2023
          </div>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default Project1components;
