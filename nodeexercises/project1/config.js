import { config } from "dotenv";
config();
export const alertJson = process.env.GOCALERTS;
export const countryJson = process.env.ISOCOUNTRIES;
export const atlas = process.env.DBURL;
export const appdb = process.env.DB;
export const collect = process.env.ALERTCOLLECTION;
export const port = process.env.PORT;
export const graphql = process.env.GRAPHQLURL;
export const server = process.env.SERVER;
export const advisorycollection = process.env.ADVISORYCOLLECTION;
