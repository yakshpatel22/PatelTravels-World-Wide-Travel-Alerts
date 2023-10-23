import * as cfg from "./config.js";
import * as utils from "./utilities.js";
import * as dbRtns from "./db_routines.js";

const getCounts = async () => {
  let results = "";
  try {
    const db = await dbRtns.getDBInstance();
    let countryJson = await dbRtns.getJSONFromWWWPromise(cfg.countryJson);
    let alertJson = await dbRtns.getJSONFromWWWPromise(cfg.alertJson);

    console.log("Retrieved Alert JSON from remote web site.");
    console.log("Retrieved Country JSON from remote GitHub.");
    let resul = await dbRtns.deleteAll(db, cfg.collect);
    console.log(
      `deleted ${resul.deletedCount} documents from alerts collection`
    );
    results += `deleted  ${resul.deletedCount} existing documents from alerts collection.Retrieved Alert JSON from remote web site.Retrieved Country JSON from remote GitHub.`;

    let alert = [];
    countryJson.forEach((result) => {
      let alertsDataObj = alertJson.data[result["alpha-2"]];
      if (alertsDataObj) {
        alert.push({
          country: result["alpha-2"],
          name: result.name,
          text: alertsDataObj["eng"]["advisory-text"],
          date: alertsDataObj["date-published"]["date"],
          region: result.region,
          subregion: result["sub-region"],
        });
      } else {
        alert.push({
          country: result["alpha-2"],
          name: result.name,
          text: "No travel alerts",
          date: "",
          region: result.region,
          subregion: result["sub-region"],
        });
      }
    });

    resul = await dbRtns.addMany(db, cfg.collect, alert);
    console.log(
      `added ${resul.insertedCount} documents to the alerts collection`
    );
    results += ` Added ${resul.insertedCount} documents to the alerts collection`;
  } catch (error) {
    console.log(error.message);
  } finally {
    return { results: results };
  }
};

export { getCounts };
