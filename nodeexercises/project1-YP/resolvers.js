// const dbRtns = require("./dbroutines");
// const { alertcollection, advisorycollection } = require("./config");
// const setupAlert = require("./setupalerts");
import dbRtns from "./db_routines.js";
import { alertcollection, advisorycollection } from "./config.js";
import setupAlert from "./setupalerts.js";
const resolvers = {
  Query: {
    alerts: async () => {
      let db = await dbRtns.getDBInstance();
      return await dbRtns.findAll(db, alertcollection, {}, {});
    },
    alertsforregion: async (args) => {
      let db = await dbRtns.getDBInstance();
      return await dbRtns.findAll(db, alertcollection, { region: args.region });
    },
    alertsforsubregion: async (args) => {
      let db = await dbRtns.getDBInstance();
      return await dbRtns.findAll(db, alertcollection, {
        subregion: args.subregion,
      });
    },
    regions: async () => {
      let db = await dbRtns.getDBInstance();
      return await dbRtns.findUniqueValues(db, alertcollection, "region");
    },
    subregions: async () => {
      let db = await dbRtns.getDBInstance();
      return await dbRtns.findUniqueValues(db, alertcollection, "subregion");
    },
    setupalert: async (args) => {
      args = await setupAlert.loadDataFunction();
      return args;
    },
    addadvisory: async (args) => {
      let db = await dbRtns.getDBInstance();
      // This new Date is only for getting the month in 2 digit format
      var usaTime = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      });
      usaTime = new Date(usaTime);
      var timeStr = new Date() + 3600000 * -5.0;
      var timeArr = timeStr.split(" ");
      var timeinput =
        timeArr[3] +
        "-" +
        ("0" + usaTime.toLocaleString()[0]).slice(-2) +
        "-" +
        timeArr[2] +
        " " +
        timeArr[4];

      // get all alerts add the specified alert infor to mongodb
      let alerts = await dbRtns.findAll(db, alertcollection, {}, {});
      let alertObj = alerts.find((element) => element.name === args.name);
      let alertInfo = alertObj.text;

      let advisory = {
        travellername: args.travellername,
        name: args.name,
        date: timeinput,
        text: alertInfo,
      };
      let results = await dbRtns.addOne(db, advisorycollection, advisory);
      return results.insertedCount === 1 ? advisory : null;
    },
    countries: async () => {
      let db = await dbRtns.getDBInstance();
      let results = await dbRtns.findAll(db, alertcollection, {}, {});
      let arr = results.map((x) => x.name);
      const resultSet = new Set();
      arr.forEach((x) => resultSet.add(x));
      return resultSet;
    },
    advisories: async () => {
      let db = await dbRtns.getDBInstance();
      return await dbRtns.findAll(db, advisorycollection, {}, {});
    },
    travellers: async () => {
      let db = await dbRtns.getDBInstance();
      let results = await dbRtns.findAll(db, advisorycollection, {}, {});
      let arr = results.map((x) => x.travellername);
      const resultSet = new Set();
      arr.forEach((x) => resultSet.add(x));
      return resultSet;
    },
    alertsfortravellers: async (args) => {
      let db = await dbRtns.getDBInstance();
      return await dbRtns.findAll(
        db,
        advisorycollection,
        { travellername: args.travellername },
        {}
      );
    },
  },
};
export { resolvers };
