import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Typography,
  Grid,
  Autocomplete,
  AppBar,
} from "@mui/material";

import logo from "../assets/logo.png";
import theme from "./theme";
import "../App.css";

const AdvisoryList = (props) => {
  const initialState = {
    autoCompleteArr: [],
    radioValue: "traveller",
    arrForTable: [],
    autoCompleteKey: "",
    textFieldLabel: "traveller",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  //const GRAPHURL = "http://localhost:5000/graphql";
  const GRAPHURL = "/graphql";
  useEffect(() => {
    fetchTravellers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAlertsBySubRegions = async (subregion) => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{alertsforsubregion(subregion:"${subregion}") {country,name,text,date,region,subregion}}`,
        }),
      });
      let json = await response.json();
      props.dataFromChild(
        `found ${json.data.alertsforsubregion.length} alerts for ${subregion}`
      );
      setState({
        arrForTable: json.data.alertsforsubregion,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fetchSubRegion = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{subregions}`,
        }),
      });
      let json = await response.json();

      props.dataFromChild(`found ${json.data.subregions.length} sub regions`);

      setState({
        autoCompleteArr: json.data.subregions,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fectchAlertsByRegions = async (region) => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{alertsforregion(region:"${region}") {country,name,text,date,region,subregion}}`,
        }),
      });
      let json = await response.json();
      props.dataFromChild(
        `found ${json.data.alertsforregion.length} alerts for ${region}`
      );
      setState({
        arrForTable: json.data.alertsforregion,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const fetchRegion = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{regions}`,
        }),
      });
      let json = await response.json();
      props.dataFromChild(`found ${json.data.regions.length} regions`);

      setState({
        autoCompleteArr: json.data.regions,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };
  const fetchAlertsByTravllers = async (traveller) => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          query: `{alertsfortravellers(travellername:"${traveller}"){travellername,name,date,text}}`,
        }),
      });
      let json = await response.json();
      props.dataFromChild(
        `found ${json.data.alertsfortravellers.length} alerts for ${traveller}`
      );

      setState({
        arrForTable: json.data.alertsfortravellers,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };
  const fetchTravellers = async () => {
    try {
      let response = await fetch(GRAPHURL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ query: "{travellers}" }),
      });
      let json = await response.json();
      props.dataFromChild(`found ${json.data.travellers.length} travellers`);
      setState({
        autoCompleteArr: json.data.travellers,
      });
    } catch (error) {
      console.log(error);
      props.dataFromChild(`Problem loading server data - ${error.message}`);
    }
  };

  const onChangeAutocomplete = (e, selectedOption) => {
    if (selectedOption) {
      if (state.textFieldLabel === "traveller")
        fetchAlertsByTravllers(selectedOption);
      else if (state.textFieldLabel === "region")
        fectchAlertsByRegions(selectedOption);
      else if (state.textFieldLabel === "sub-region")
        fetchAlertsBySubRegions(selectedOption);
    }
  };

  const handleChange = (event) => {
    if (event.target.value === "traveller") fetchTravellers();
    else if (event.target.value === "region") fetchRegion();
    else if (event.target.value === "sub-region") fetchSubRegion();

    setState({
      radioValue: event.target.value,
      autoCompleteKey: event.target.value,
      textFieldLabel: event.target.value,
      arrForTable: [],
    });
  };

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

      <Typography
        color="primary"
        style={{ fontSize: "20px", textAlign: "center" }}
      >
        {" "}
        List Advisories By:
      </Typography>
      <RadioGroup
        aria-label="position"
        name="position"
        value={state.radioValue}
        onChange={handleChange}
      >
        <div style={{ display: "flex" }}>
          <FormControlLabel
            value="traveller"
            control={<Radio color="primary" />}
            label="Traveller"
            labelPlacement="start"
          />

          <FormControlLabel
            value="region"
            control={<Radio color="primary" />}
            label="Region"
            labelPlacement="start"
          />
          <FormControlLabel
            value="sub-region"
            control={<Radio color="primary" />}
            label="Sub-Region"
            labelPlacement="start"
          />
        </div>
      </RadioGroup>
      <Autocomplete
        id="travellers"
        options={state.autoCompleteArr}
        getOptionLabel={(option) => option}
        style={{ width: 300, paddingTop: "2vh", paddingBottom: 0 }}
        onChange={onChangeAutocomplete}
        key={state.autoCompleteKey}
        renderInput={(params) => (
          <TextField
            {...params}
            label={state.textFieldLabel}
            variant="outlined"
            fullWidth
          />
        )}
      />
      <CardContent>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          style={{ paddingTop: "3vh", paddingBottom: "2vh" }}
        >
          <Typography
            color="primary"
            style={{ fontWeight: "bold", marginLeft: 20 }}
          >
            Country
          </Typography>
          <Typography
            color="primary"
            style={{ fontWeight: "bold", marginLeft: 60 }}
          >
            Alert Information
          </Typography>
        </Grid>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {state.arrForTable.map((row) => (
                <TableRow key={Math.random().toString()}>
                  <TableCell
                    style={{ color: "rgba(16, 130, 104, 1)" }}
                    component="th"
                    scope="row"
                  >
                    {row.name}
                  </TableCell>
                  <TableCell
                    style={{ color: "rgba(16, 130, 104, 1)" }}
                    component="th"
                    scope="row"
                  >
                    {row.text} <br /> {row.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </ThemeProvider>
  );
};

export default AdvisoryList;
