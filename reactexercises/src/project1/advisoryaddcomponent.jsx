import React, { useReducer, useEffect, useRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import logo from "../assets/logo.png";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  TextField,
  Button,
  CardActions,
  Typography,
  Autocomplete,
  AppBar,
} from "@mui/material";
//import Autocomplete from "@material-ui/lab/Autocomplete";
import theme from "./theme";
import "../App.css";

const AdvisoryAdd = (props) => {
  // reset is for changing the key of autocomplete in order to re-render with default values
  const initialState = {
    countries: [],
    travellerName: "",
    selectedcountry: "",
    reset: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addAdvisory = async () => {
    try {
      //  const GRAPHURL = "http://localhost:5000/graphql";
      const GRAPHURL = "/graphql";
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `mutation {addadvisory(travellername: "${state.travellerName}", name: "${state.selectedcountry}") {travellername,name,date,text}}`,
        }),
      });
      const usaTime = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      });
      const time = new Date(usaTime);
      time.setHours(time.getHours() - 5);
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/New_York",
      };
      const formattedTime = time.toLocaleString("en-US", options);
      const formattedDate = time.toISOString().slice(0, 10);
      const currentDate = formattedDate.replace(/-/g, "/");
      let json = await response.json();
      props.dataFromChild(`added advisory on ${currentDate} ${formattedTime}`);
      setState({
        travellerName: "",
        selectedcountry: "",
        reset: true,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fetchCountries = async () => {
    try {
      props.dataFromChild("running setup...");
      //const GRAPHURL = "http://localhost:5000/graphql";
      const GRAPHURL = "/graphql";
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ query: "{countries}" }),
      });
      let json = await response.json();

      props.dataFromChild(`found ${json.data.countries.length} countries`);

      setState({
        countries: json.data.countries,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const onChange = (e, selectedOption) => {
    selectedOption
      ? setState({ selectedcountry: selectedOption })
      : setState({ selectedcountry: "" });
  };

  const handleTravelledNameInput = (e) => {
    setState({ travellerName: e.target.value });
  };

  const emptyorundefined =
    state.travellerName === undefined ||
    state.travellerName === "" ||
    state.selectedcountry === undefined ||
    state.selectedcountry === "";

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Card style={{ width: "100%" }}>
          <CardMedia style={{ textAlign: "center", paddingTop: "3vh" }}>
            <img className="photo" src={logo} alt="LOGO"></img>
          </CardMedia>
          <CardHeader
            title="World Wide Travel Alerts"
            color="primary"
            style={{ textAlign: "center" }}
          />
        </Card>
      </AppBar>
      <CardContent>
        <Typography
          color="primary"
          style={{ fontSize: "20px", textAlign: "center" }}
        >
          Add Advisory
        </Typography>
        <TextField
          label="Traveller's name"
          onChange={handleTravelledNameInput}
          value={state.travellerName}
          style={{ paddingTop: "2vh", paddingBottom: 0 }}
        />
        <br />
        <Autocomplete
          id="country"
          options={state.countries}
          getOptionLabel={(option) => option}
          style={{ width: 300, paddingTop: "2vh", paddingBottom: 0 }}
          onChange={onChange}
          key={state.reset}
          renderInput={(params) => (
            <TextField
              {...params}
              label="countries"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <CardActions style={{ justifyContent: "center" }}>
          <Button
            color="primary"
            variant="contained"
            onClick={addAdvisory}
            disabled={emptyorundefined}
          >
            ADD ADVISORY
          </Button>
        </CardActions>
      </CardContent>
    </ThemeProvider>
  );
};
export default AdvisoryAdd;
