import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import theme from "./theme";
import "../App.css";
import TopBar from "./topbar";
const Week13Exercise2 = () => {
  const [open, setOpen] = useState(false);
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  return (
    <ThemeProvider theme={theme}>
      <TopBar viewDialog={handleOpenDialog} />
      <Dialog open={open} onClose={handleCloseDialog} style={{ margin: 20 }}>
        <DialogTitle style={{ textAlign: "center" }}>
          Some Dialog Info
        </DialogTitle>
        <DialogContent>Yaksh Patel</DialogContent>
      </Dialog>
      <Typography
        variant="h5"
        color="inherit"
        style={{ marginTop: "12vh", width: "100vw", textAlign: "center" }}
      >
        Exercise #2
      </Typography>
    </ThemeProvider>
  );
};
export default Week13Exercise2;
