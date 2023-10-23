import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardMedia,
} from "@mui/material";
import { styled } from "@mui/material/styles"; // if you want to use the `styled` function
import theme from "./theme";
import "../App.css";
import logo from "../assets/logo1.png";
const HomeComponent = () => {
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
        <CardHeader
          title="Code Monkeys"
          style={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
            textAlign: "center",
          }}
        />
        <CardContent>
          <br />
          <Typography
            color="Code Monkeys"
            style={{
              fontWeight: "bold",

              float: "right",
              paddingRight: "1vh",
              fontSize: "medium",
            }}
          >
            &copy;Code Monkeys
          </Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default HomeComponent;
