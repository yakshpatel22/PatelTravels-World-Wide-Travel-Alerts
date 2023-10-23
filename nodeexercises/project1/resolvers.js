import * as dbRtns from "./db_routines.js";
import * as cfg from "./config.js";
import * as setup from "./project1_setup.js";
import { collect, advisorycollection } from "./config.js";
//const { collect } = require("./config");
const resolvers = {
  alerts: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, collect, {}, {});
  },
  alertsforregion: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, collect, { region: args.region });
  },
  alertsforsubregion: async (args) => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findAll(db, collect, {
      subregion: args.subregion,
    });
  },
  regions: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findUniqueValues(db, collect, "region");
  },
  subregions: async () => {
    let db = await dbRtns.getDBInstance();
    return await dbRtns.findUniqueValues(db, collect, "subregion");
  },
  async project1_setup() {
    try {
      const result = await setup.getCounts();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  },
  // addAdvisory: async (advisory) => {
  //   const { db } = await dbRtns.getDBInstance();
  //   const result = await dbRtns.addOne(db, collect, advisory);
  //   if (result.insertedCount !== 1) {
  //     throw new Error("Failed to insert advisory");
  //   }
  //   return advisory;
  // },
  addadvisory: async (args) => {
    const db = await dbRtns.getDBInstance();

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

    // Get the alert information for the selected country
    const alerts = await dbRtns.findAll(db, collect, {}, {});
    const alertObj = alerts.find((element) => element.name === args.name);
    const alertInfo = alertObj.text;

    // Create the advisory object with the current time and alert information
    const advisory = {
      travellername: args.travellername,
      name: args.name,
      date: `${currentDate} ${formattedTime}`,
      text: alertInfo,
    };

    // Add the advisory to the database
    const results = await dbRtns.addOne(db, advisorycollection, advisory);

    return results.insertedCount === 1 ? advisory : null;
  },
  countries: async () => {
    let db = await dbRtns.getDBInstance();
    let results = await dbRtns.findAll(db, collect, {}, {});
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
};
export { resolvers };
