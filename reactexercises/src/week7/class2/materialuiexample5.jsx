import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import "../../App.css";
const MaterialUIEx5Component = () => {
 return (
 <ThemeProvider theme={theme}>
 <Card className="card">
 <CardHeader
 title="Exercise #5 - Routing"
 style={{ color: theme.palette.primary.main, textAlign: "center" }}
 />
 <CardContent>
 <br />
 <Typography
 color="primary"
 style={{ float: "right", paddingRight: "1vh", fontSize: "smaller" }}
 >
 &copy;Info3139 - 2023
 </Typography>
 </CardContent>
 </Card>
 </ThemeProvider>
 );
};
export default MaterialUIEx5Component;