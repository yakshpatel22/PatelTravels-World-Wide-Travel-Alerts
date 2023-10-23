import Accessibility from "@mui/icons-material/Accessibility";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
const TopBar = (props) => {
  const onIconClicked = () => props.viewDialog(); // notify the parent
  return (
    <AppBar>
      <Toolbar color="primary">
        <Typography variant="h6" color="inherit">
          Case 2 - Exercises
        </Typography>
        <section style={{ height: 90, width: 90, marginLeft: "auto" }}>
          <IconButton onClick={onIconClicked}>
            <Accessibility style={{ color: "white", height: 70, width: 70 }} />
          </IconButton>
        </section>
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
