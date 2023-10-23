import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
 Autocomplete,
 Card,
 CardHeader,
 CardContent,
 Typography,
 TextField,
} from "@mui/material";
import theme from "./theme";
import "../../App.css";
const MaterialUIEx2Component = () => {
 const [selection, setSelection] = useState("");
 const onChange = (e, selectedOption) => {
 selectedOption
 ? setSelection(`You selected ${selectedOption}`)
 : setSelection("");
 };
 return (
 <ThemeProvider theme={theme}>
 <Card className="card">
 <CardHeader
 title="Exercise #2 - Autocomplete"
 style={{ textAlign: "center" }}
 />
 <CardContent>
 <Autocomplete
 id="fruits"
 options={fruits}
 getOptionLabel={(option) => option}
 style={{ width: 300 }}
 onChange={onChange}
 renderInput={(params) => (
 <TextField
 {...params}
 label="available fruits"
 variant="outlined"
 fullWidth
 />
 )}
 />
 <p />
 <Typography variant="h6" color="error">
 {selection}
 </Typography>
 </CardContent>
 </Card>
 </ThemeProvider>
 );
};
const fruits = ['Apple', 'Apricot', 'Avocado', 'Banana', 'Bilberry', 'Blackberry',
 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Blood Orange', 'Cantaloupe',
 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry', 'Coconut', 'Cranberry', 'Clementine',
 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Goji berry',
 'Gooseberry', 'Grape', 'Grapefruit', 'Guava', 'Honeydew', 'Huckleberry', 'Jabouticaba',
 'Jackfruit', 'Jambul', 'Jujube', 'Juniper berry', 'Kiwi fruit', 'Kumquat', 'Lemon',
 'Lime', 'Loquat', 'Lychee', 'Nectarine', 'Mango', 'Marion berry', 'Melon', 'Miracle fruit',
 'Mulberry', 'Mandarine', 'Olive', 'Orange', 'Papaya', 'Passionfruit', 'Peach', 'Pear',
 'Persimmon', 'Physalis', 'Plum', 'Pineapple', 'Pumpkin', 'Pomegranate', 'Pomelo',
 'Purple Mangosteen', 'Quince', 'Raspberry', 'Raisin', 'Rambutan', 'Redcurrant', 'Salal berry',
 'Satsuma', 'Star fruit', 'Strawberry', 'Squash', 'Salmonberry', 'Tamarillo', 'Tamarind',
 'Tomato', 'Tangerine', 'Ugli fruit', 'Watermelon'];
export default MaterialUIEx2Component;