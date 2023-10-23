import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Toolbar, Card, AppBar, CardHeader, CardContent, Typography, TextField, Button } from "@mui/material";
import theme from "./theme";
import "../App.css";

const Lab11 = () => {
  const [message, setMessage] = useState("The message is:");
  const [word, setWord] = useState("");

  const handleAddWord = () => {
    if (word.trim() !== "") {
      setMessage(message + " " + word);
      setWord("");
    }
  };

  const handleClearMessage = () => {
    setMessage("The message is:");
    setWord("");
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar color="secondary" style={{ marginBottom: "5vh" }}>
        <Toolbar>
          <Typography variant="h6" color="inherit">
            INFO3139 - Lab11
          </Typography>
        </Toolbar>
      </AppBar>
      <Card className="card">
        <CardHeader title="Sentence Builder" />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p" style={{ marginBottom: "2vh" }}>
            {message}
          </Typography>
          <div style={{ display: "flex" }}>
            <TextField placeholder="Add Word"
 label="Word" value={word} onChange={(event) => setWord(event.target.value)} style={{ marginRight: "2vh" }} />
            <Button data-testid="addbutton" variant="contained" color="primary" onClick={handleAddWord}>
              Submit
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClearMessage} style={{ marginLeft: "2vh" }}>
              Clear Msg
            </Button>
          </div>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default Lab11;