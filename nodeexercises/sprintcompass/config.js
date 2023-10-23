import { config } from "dotenv";
config();
export const projectinfo = process.env.PROJECTINFORMATION;
export const sprints = process.env.SPRINTCOLLECTION;
export const userstories = process.env.USERSTORYCOLLECTION;
export const subtasks = process.env.SUBTASKSCOLLCTION;
export const teammembers = process.env.TEAMMEMBERSCOLLECTION;
export const backlogs = process.env.BACKLOGCOLLECTION;
export const retrospectives = process.env.RETROSPECTIVECOLLECTION;
export const atlas = process.env.DBURL;
export const appdb = process.env.DB;
export const port = process.env.PORT;
export const graphql = process.env.GRAPHQLURL;
