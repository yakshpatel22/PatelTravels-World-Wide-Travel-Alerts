// const rtns = require("./utilities.js");
// const {
//   gocalertsdata,
//   isocountriesdata,
//   alertcollection,
// } = require("./config");
//const dbRtns = require("./dbroutines"); // all database functions
// import dbRtns from "./dbroutines.js";
import { gocalertsdata, isocountriesdata, alertcollection } from "./config.js";
import rtns from "./utilities.js";
const loadDataFunction = async () => {
  let results = "";
  try {
    let db = await dbRtns.getDBInstance(); //get the connection instance
    let deletedResults = await dbRtns.deleteAll(db, alertcollection); //step 2
    results += `Deleted ${deletedResults.deletedCount} documents from the countries collection. `;
    let isoCountries = await rtns.getJSONFromWWWPromise(isocountriesdata);
    results += "Retrieved Country JSON from remote website. ";
    let alertJson = await rtns.getJSONFromWWWPromise(gocalertsdata);
    results += "Retrieved Alert JSON from remote website. ";
    let countryArray = await Promise.allSettled(
      isoCountries.map((info) => {
        let code = info["alpha-2"];
        let text = alertJson.data[code];
        if (text == null) text = "No travel alerts";
        else text = alertJson.data[code]["eng"]["advisory-text"];
        let date = alertJson.data[code];
        if (date == null) date = "";
        else date = alertJson.data[code]["date-published"]["date"];
        let country = `{"country": "${info["alpha-2"]}", "name":"${info["name"]}","text" : "${text}", "date": "${date}","region":"${info["region"]}","subregion":"${info["sub-region"]}"}`;
        country = JSON.parse(country);
        return dbRtns.addOne(db, alertcollection, country);
      })
    );
    let allcountries = await dbRtns.findAll(db, alertcollection, {}, {}); // empty criteria and projection
    results += `Added approximately ${allcountries.length} new documents to the alerts collection. `;
  } catch (err) {
    console.log(err);
  } finally {
    return { results };
  }
};

export default {
  loadDataFunction,
};
