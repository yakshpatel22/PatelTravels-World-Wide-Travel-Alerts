import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
 Toolbar,
 Card,
 AppBar,
 CardHeader,
 CardContent,
 Typography,
} from "@mui/material";
import theme from "./theme";
import "../App.css";
const MaterialUIEx1Component = () => {
 return (
 <ThemeProvider theme={theme}>
 <AppBar color="secondary" style={{ marginBottom: "5vh" }}>
 <Toolbar>
 <Typography variant="h6" color="inherit">
 INFO3139 - MaterialUI
 </Typography>
 </Toolbar>
 </AppBar><Card className="card">
 <CardHeader title="Exercise #1" />
 <CardContent>Cool stuff goes here</CardContent>
 </Card>
 </ThemeProvider>
 );
};
export default MaterialUIEx1Component;