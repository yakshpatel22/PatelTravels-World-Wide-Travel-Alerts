import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Autocomplete,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
import theme from "./theme";
import "../../App.css";

const words = ["Hey", "I", "Build", "a", "sentence.", "Yaksh Patel"];
const Lab12 = () => {
  const [message, setMessage] = useState("");

  const onChange = (e, selectedOption) => {
    selectedOption
      ? setMessage(`${message} ${selectedOption}`)
      : setMessage("");
  };
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            INFO3139 - Lab12
          </Typography>
        </Toolbar>
      </AppBar>
      <Card className="card">
        <CardHeader title="Sentence Builder using  Autocomplete" />
        <CardContent>
          <Autocomplete
            id="words"
            options={words}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            onChange={onChange}
            renderInput={(params) => (
              <TextField
                {...params}
                id="input"
                placeholder="pick a word"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <p />
          <Typography
            variant="body2"
            style={{ marginTop: "1vh", marginBottom: "1vh" }}>
            The message is: {message}
          </Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default Lab12;
