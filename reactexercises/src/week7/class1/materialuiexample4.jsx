import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import {
 AppBar,
 Card,
 CardContent,
 CardHeader,
 IconButton,
 Menu,
 MenuItem,
 Toolbar,
 Typography,
} from "@mui/material";
import "../../App.css";
import MenuIcon from "@mui/icons-material/Menu";
const MaterialUIEx4Component = () => {
 const [item, setItem] = useState({ msg: null, anchorEl: null });
 const onMenuButtonClicked = (event) => {
 setItem({ msg: null, anchorEl: event.currentTarget });
 };
 const onClose = () => {
 setItem(null);
 };
 const onItem1Clicked = () => {
 setItem({ msg: "item 1 was clicked", anchorEl: null });
 };
 const onItem2Clicked = () => {
 setItem({ msg: "item 2 was clicked", anchorEl: null });
 };
 const onItem3Clicked = () => {
 setItem({ msg: "item 3 was clicked", anchorEl: null });
 };
 return (
 <ThemeProvider theme={theme}>
 <AppBar position="static">
 <Toolbar>
 <IconButton onClick={onMenuButtonClicked} color="inherit">
 <MenuIcon />
 </IconButton>
 <Menu
 id="simple-menu"
 anchorEl={item.anchorEl}
 open={Boolean(item.anchorEl)}
 onClose={onClose}
 >
 <MenuItem onClick={onItem1Clicked}>Menu Item 1</MenuItem>
 <MenuItem onClick={onItem2Clicked}>Menu Item 2</MenuItem>
 <MenuItem onClick={onItem3Clicked}>Menu Item 3</MenuItem>
 </Menu>
 <Typography>INFO3139 Exercises - Example 4</Typography>
 </Toolbar>
 </AppBar>
 <Card className="card">
 <CardHeader
 style={{ color: theme.palette.primary.main, textAlign: "center" }}
 title="Icons and Menus"
 />
 <CardContent>
 {item.msg && <Typography color="error">{item.msg}</Typography>}
 </CardContent>
 </Card>
 </ThemeProvider>
 );
};
export default MaterialUIEx4Component;