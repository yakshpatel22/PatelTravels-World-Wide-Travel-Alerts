import {
  projectinfo,
  sprints,
  userstories,
  subtasks,
  teammembers,
  backlogs,
  retrospectives,
} from "./config.js";
import * as dbRtns from "./db_routines.js";
const resolvers = {
  /**************************************************************************************/
  /*                             Project Details Functions                              */
  /**************************************************************************************/
  getallproject: async () => {
    let db = await dbRtns.getDBInstance();
    let response = await dbRtns.findAll(db, projectinfo, {}, {});
    if (!response) return `No team members. Please Add them.`;
    else return response;
  },
  getspecificproject: async (args) => {
    let db = await dbRtns.getDBInstance();
    let project = await dbRtns.findOne(db, projectinfo, {
      name: `${args.name}`,
      teamname: `${args.teamname}`,
    });
    if (!project) return `Project does not exist in collection`;
    else return project;
  },
  addproject: async (args) => {
    let db = await dbRtns.getDBInstance();
    let project = `{"name":"${args.name}", "description":"${args.description}", "teamname": "${args.teamname}","numberofteammembers":${args.numberofteammembers},"numberofsprints":${args.numberofsprints}, "velocity":${args.velocity}, "storypointsconversion": ${args.storypointsconversion},"costperhour":${args.costperhour}}`;
    project = JSON.parse(project);
    let found = await dbRtns.findOne(db, projectinfo, {
      name: `${args.name}`,
      teamname: `${args.teamname}`,
    });
    if (!found) {
      let results = await dbRtns.addOne(db, projectinfo, project);
      return results.insertedCount === 1 ? project : null;
    } else return `Project already exits`;
  },
  updateproject: async (args) => {
    let db = await dbRtns.getDBInstance();
    let project = await dbRtns.findOne(db, projectinfo, {
      name: `${args.name}`,
      teamname: `${args.teamname}`,
    });
    if (!project) return `Project does not exist in collection`;
    let updateResults = await dbRtns.updateOne(
      db,
      projectinfo,
      { _id: project._id },
      {
        numberofteammembers: args.numberofteammembers,
        numberofsprints: args.numberofsprints,
        velocity: args.velocity,
      }
    );
    project = await dbRtns.findOne(db, projectinfo, {
      name: `${args.name}`,
      teamname: `${args.teamname}`,
    });
    return project;
  },
  deleteallprojects: async () => {
    let db = await dbRtns.getDBInstance();
    let deleted = await dbRtns.deleteAll(db, projectinfo);
    return `count: ${deleted.deletedCount}`;
  },
  deletespecificproject: async (args) => {
    let db = await dbRtns.getDBInstance();
    let project = await dbRtns.findOne(db, projectinfo, {
      name: `${args.name}`,
      teamname: `${args.teamname}`,
    });
    if (!project) return `Project does not exist in collection`;
    else {
      let deletedproject = await dbRtns.deleteOne(db, projectinfo, {
        _id: project._id,
      });
      return `Deleted project ${project.name} team: ${project.teamname} sprints: ${project.numberofsprints}`;
    }
  },
  /**************************************************************************************/
  /*                                 Sprint Function                                    */
  /**************************************************************************************/
  getallsprintsperproject: async (args) => {
    let db = await dbRtns.getDBInstance();
    let sprint = await dbRtns.findAll(db, sprints, {
      project: `${args.project}`,
    });
    if (!sprint) return `No Sprints in ${args.project}`;
    else return sprint;
  },
  getspecificsprint: async (args) => {
    let db = await dbRtns.getDBInstance();
    let sprint = await dbRtns.findOne(db, sprints, {
      project: `${args.project}`,
      sprint: `${args.sprint}`,
    });
    if (!sprint) return `Sprint does not exist in ${args.project}`;
    else return sprint;
  },
  addsprint: async (args) => {
    let db = await dbRtns.getDBInstance();
    let sprint = `{"sprint":"${args.sprint}", "numberofuserstory":${args.numberofuserstory}, "project":"${args.project}", "team": "${args.team}", "storypoints": ${args.storypoints}}`;
    sprint = JSON.parse(sprint);
    let found = await dbRtns.findOne(db, sprints, {
      sprint: `${args.sprint}`,
      project: `${args.project}`,
      team: `${args.team}`,
    });
    if (!found) {
      let results = await dbRtns.addOne(db, sprints, sprint);
      return results.insertedCount === 1 ? sprint : null;
    } else return `Sprint already exists`;
  },
  updatesprint: async (args) => {
    let db = await dbRtns.getDBInstance();
    let sprint = await dbRtns.findOne(db, sprints, {
      project: `${args.project}`,
      sprint: `${args.sprint}`,
    });
    if (!sprint) return `Sprint does not exist in ${args.project}`;
    let updateResults = await dbRtns.updateOne(
      db,
      sprints,
      { _id: sprint._id },
      {
        numberofuserstory: args.numberofuserstory,
      }
    );
    sprint = await dbRtns.findOne(db, sprints, {
      project: `${args.project}`,
      sprint: `${args.sprint}`,
    });
    return sprint;
  },
  /**************************************************************************************/
  /*                                User Story Functions                                */
  /**************************************************************************************/
  getalluserstory: async () => {
    let db = await dbRtns.getDBInstance();
    let userstory = await dbRtns.findAll(db, userstories, {}, {});
    if (!userstory) return `No Userstories in collection`;
    else return userstory;
  },
  getuserstorybyname: async (args) => {
    let db = await dbRtns.getDBInstance();
    let userstory = await dbRtns.findOne(db, userstories, {
      userstory: args.userstory,
    });
    if (!userstory) return `No Userstories in collection`;
    else return userstory;
  },
  getuserstorybysprint: async (args) => {
    let db = await dbRtns.getDBInstance();
    let userstory = await dbRtns.findOne(db, userstories, {
      sprint: `${args.sprint}`,
      userstory: `${args.userstory}`,
    });
    if (!userstory) return `Userstory does not exist in ${args.sprint}`;
    else return userstory;
  },
  adduserstory: async (args) => {
    let numberofsubtasks = 0;
    let userstorystatus = `Opened`;
    let assignedmember = "";
    let db = await dbRtns.getDBInstance();
    let userstory = `{"userstory": "${args.userstory}","sprint": "${args.sprint}","assignedmember":"${assignedmember}", "status": "${userstorystatus}","numberofsubtasks":${numberofsubtasks},"userpoints": ${args.userpoints}}`;
    userstory = JSON.parse(userstory);
    let found = await dbRtns.findOne(db, userstories, {
      userstory: args.userstory,
    });
    if (!found) {
      let results = await dbRtns.addOne(db, userstories, userstory);
      return results.insertedCount === 1 ? userstory : null;
    } else return `Userstory already exists`;
  },
  updateusertorystatus: async (args) => {
    let db = await dbRtns.getDBInstance();
    let userstory = await dbRtns.findOne(db, userstories, {
      userstory: `${args.userstory}`,
    });
    if (!userstory) return `Userstory does not exist`;
    let updateResults = await dbRtns.updateOne(
      db,
      userstories,
      { _id: userstory._id },
      {
        status: args.status,
      }
    );
    userstory = await dbRtns.findOne(db, userstories, {
      userstory: `${args.userstory}`,
    });
    return userstory;
  },
  updateusertorysubtasks: async (args) => {
    let db = await dbRtns.getDBInstance();
    let userstory = await dbRtns.findOne(db, userstories, {
      userstory: `${args.userstory}`,
    });
    if (!userstory) return `Userstory does not exist`;
    let updateResults = await dbRtns.updateOne(
      db,
      userstories,
      { _id: userstory._id },
      {
        numberofsubtasks: args.numberofsubtasks,
      }
    );
    userstory = await dbRtns.findOne(db, userstories, {
      userstory: `${args.userstory}`,
    });
    return userstory;
  },
  moveuserstorytosprint: async (args) => {
    let db = await dbRtns.getDBInstance();
    let userstory = await dbRtns.findOne(db, userstories, {
      userstory: `${args.userstory}`,
    });
    if (!userstory) return `Userstory does not exist`;
    let updateResults = await dbRtns.updateOne(
      db,
      userstories,
      { _id: userstory._id },
      {
        sprint: args.sprint,
      }
    );
    userstory = await dbRtns.findOne(db, userstories, {
      userstory: `${args.userstory}`,
    });
    return userstory;
  },
  assignmembertouserstory: async (args) => {
    let db = await dbRtns.getDBInstance();
    let userstory = await dbRtns.findOne(db, userstories, {
      userstory: `${args.userstory}`,
    });
    if (!userstory) return `Userstory does not exist`;
    let updateResults = await dbRtns.updateOne(
      db,
      userstories,
      { _id: userstory._id },
      {
        assignedmember: args.assignedmember,
      }
    );
    userstory = await dbRtns.findOne(db, userstories, {
      userstory: `${args.userstory}`,
    });
    return userstory;
  },
  /**************************************************************************************/
  /*                                Subtasks Functions                                  */
  /**************************************************************************************/
  getallsubtasks: async () => {
    let db = await dbRtns.getDBInstance();
    let subtask = await dbRtns.findAll(db, subtasks, {}, {});
    if (!subtask) return `No subtasks in collection`;
    else return subtask;
  },
  getallsubtaskbyuserstory: async (args) => {
    let db = await dbRtns.getDBInstance();
    let subtask = await dbRtns.findAll(
      db,
      subtasks,
      { userstory: args.userstory },
      {}
    );
    if (!subtask) return `No subtasks found`;
    else return subtask;
  },
  getsubtask: async (args) => {
    let db = await dbRtns.getDBInstance();
    let subtask = await dbRtns.findOne(db, subtasks, {
      subtask: args.subtask,
    });
    if (!subtask) return `No Subtask in collection`;
    else return subtask;
  },
  getsubtaskbyuserstory: async (args) => {
    let db = await dbRtns.getDBInstance();
    let subtask = await dbRtns.findOne(
      db,
      subtasks,
      { subtask: args.subtask, userstory: args.userstory },
      {}
    );
    if (!subtask) return `No subtasks in userstory`;
    else return subtask;
  },
  addsubtask: async (args) => {
    //default values
    let assignedmember = "";
    let status = "Opened";
    let subtask = `{"subtask" : "${args.subtask}", "userstory" : "${args.userstory}", "assignedmember" : "${assignedmember}", "status" : "${status}"}`;
    subtask = JSON.parse(subtask);
    let db = await dbRtns.getDBInstance();
    let found = await dbRtns.findOne(db, subtasks, {
      subtask: args.subtask,
      userstory: args.userstory,
    });
    if (!found) {
      let results = await dbRtns.addOne(db, subtasks, subtask);
      return results.ops[0];
    } else return `Subtask already exists`;
  },
  assignmembertosubtask: async (args) => {
    let db = await dbRtns.getDBInstance();
    let subtask = await dbRtns.findOne(db, subtasks, {
      subtask: `${args.subtask}`,
    });
    if (!subtask) return `Userstory does not exist`;
    let updateResults = await dbRtns.updateOne(
      db,
      subtasks,
      { _id: subtask._id },
      {
        assignedmember: args.assignedmember,
      }
    );
    subtask = await dbRtns.findOne(db, subtasks, {
      subtask: `${args.subtask}`,
    });
    return subtask;
  },
  updatesubtaskstatus: async (args) => {
    let db = await dbRtns.getDBInstance();
    let subtask = await dbRtns.findOne(db, subtasks, {
      subtask: `${args.subtask}`,
    });
    if (!subtask) return `Userstory does not exist`;
    let updateResults = await dbRtns.updateOne(
      db,
      subtasks,
      { _id: subtask._id },
      {
        status: args.status,
      }
    );
    subtask = await dbRtns.findOne(db, subtasks, {
      subtask: `${args.subtask}`,
    });
    return subtask;
  },
  deletesubtaskbyuserstory: async (args) => {
    let db = await dbRtns.getDBInstance();
    let subtask = await dbRtns.findOne(db, subtasks, {
      subtask: `${args.subtask}`,
      userstory: `${args.userstory}`,
    });
    if (!subtask) return `Subtask does not exist in ${args.userstory}`;
    else {
      let deletedSubtask = await dbRtns.deleteOne(db, subtasks, {
        _id: subtask._id,
      });
      return `Deleted Subtask ${subtask.subtask} from userstory: ${subtask.userstory}`;
    }
  },
  /**************************************************************************************/
  /*                               Team Member Functions                                */
  /**************************************************************************************/
  getallteammembers: async () => {
    let db = await dbRtns.getDBInstance();
    let team = await dbRtns.findAll(db, teammembers, {}, {});
    if (!team) return `No team members. Please Add them.`;
    else return team;
  },
  getallmembersbyteam: async (args) => {
    let db = await dbRtns.getDBInstance();
    let team = await dbRtns.findAll(
      db,
      teammembers,
      { team: `${args.team}` },
      {}
    );
    if (!team) return `No team members in ${args.team}. Please Add them.`;
    else return team;
  },
  getspecificmember: async (args) => {
    let db = await dbRtns.getDBInstance();
    let member = await dbRtns.findOne(db, teammembers, {
      lastname: `${args.lastname}`,
      email: `${args.email}`,
    });
    if (!member) return `Member does not exist`;
    else return member;
  },
  addteammember: async (args) => {
    let member = `{"team":"${args.team}","firstname":"${args.firstname}", "lastname":"${args.lastname}", "email": "${args.email}"}`;
    member = JSON.parse(member);
    let db = await dbRtns.getDBInstance();
    let found = await dbRtns.findOne(db, teammembers, {
      team: `${args.team}`,
      lastname: `${args.lastname}`,
      email: `${args.email}`,
    });
    if (!found) {
      let results = await dbRtns.addOne(db, teammembers, member);
      return results.ops[0];
    } else return `Team member already exists.`;
  },
  updatememberemail: async (args) => {
    let db = await dbRtns.getDBInstance();
    let member = await dbRtns.findOne(db, teammembers, {
      firstname: `${args.firstname}`,
      lastname: `${args.lastname}`,
    });
    if (!member) return `Member does not exist`;
    else {
      let updateResults = await dbRtns.updateOne(
        db,
        teammembers,
        { _id: member._id },
        {
          email: `${args.email}`,
        }
      );
      member = await dbRtns.findOne(db, teammembers, {
        lastname: `${args.lastname}`,
        email: `${args.email}`,
      });
      return member;
    }
  },
  updatememberlastname: async (args) => {
    let db = await dbRtns.getDBInstance();
    let member = await dbRtns.findOne(db, teammembers, {
      firstname: `${args.firstname}`,
      email: `${args.email}`,
    });
    if (!member) return `Member does not exist`;
    else {
      let updateResults = await dbRtns.updateOne(
        db,
        teammembers,
        { _id: member._id },
        {
          lastname: `${args.lastname}`,
        }
      );
      member = await dbRtns.findOne(db, teammembers, {
        firstname: `${args.firstname}`,
        email: `${args.email}`,
      });
      return member;
    }
  },
  movemembertoteam: async (args) => {
    let db = await dbRtns.getDBInstance();
    let member = await dbRtns.findOne(db, teammembers, {
      lastname: `${args.lastname}`,
      email: `${args.email}`,
    });
    if (!member) return `Member does not exist`;
    else {
      let updateResults = await dbRtns.updateOne(
        db,
        teammembers,
        { _id: member._id },
        {
          team: `${args.team}`,
        }
      );
      member = await dbRtns.findOne(db, teammembers, {
        lastname: `${args.lastname}`,
        email: `${args.email}`,
      });
      return member;
    }
  },
  deleteamember: async (args) => {
    let db = await dbRtns.getDBInstance();
    let member = await dbRtns.findOne(db, teammembers, {
      lastname: `${args.lastname}`,
      email: `${args.email}`,
    });
    if (!member) return `Member does not exist in collection`;
    else {
      let deletedMember = await dbRtns.deleteOne(db, teammembers, {
        _id: member._id,
      });
      return `Deleted member ${member.firstname} ${member.lastname}`;
    }
  },
  deleteallmembers: async () => {
    let db = await dbRtns.getDBInstance();
    let deleteall = await dbRtns.deleteAll(db, teammembers);
    return `Number of members deleted: ${deleteall.deletedCount}`;
  },
  /**************************************************************************************/
  /*                                 Backlog Functions                                  */
  /**************************************************************************************/
  getallbacklogbyproject: async (args) => {
    let db = await dbRtns.getDBInstance();
    let backlog = await dbRtns.findAll(
      db,
      backlogs,
      { project: `${args.project}` },
      {}
    );
    if (!backlog) return `No backlog information, please add`;
    else return backlog;
  },
  getspecificbacklog: async (args) => {
    let db = await dbRtns.getDBInstance();
    let backlog = await dbRtns.findOne(
      db,
      backlogs,
      { project: `${args.project}`, priority: args.priority },
      {}
    );
    if (!backlog) return `No backlog information, please add`;
    else return backlog;
  },
  addbacklog: async (args) => {
    let db = await dbRtns.getDBInstance();
    let findproject = await dbRtns.findOne(db, projectinfo, {
      name: args.project,
    });
    if (!findproject) return `error, project not added`;
    //get relative cost based on the project
    let estimatedcost =
      findproject.costperhour *
      findproject.storypointsconversion *
      args.relativeestimate;
    let backlog = `{"project": "${args.project}", "priority": ${args.priority},"userrole":"${args.userrole}","iwantto":"${args.iwantto}","ican":"${args.ican}","relativeestimate":${args.relativeestimate},"estimatedcost": ${estimatedcost}}`;
    backlog = JSON.parse(backlog);
    let found = await dbRtns.findOne(db, backlogs, {
      priority: args.priority,
      iwantto: args.iwantto,
      ican: args.ican,
    });
    if (!found) {
      let results = await dbRtns.addOne(db, backlogs, backlog);
      return results.insertedCount === 1 ? backlog : false;
    } else return `Already exists`;
  },
  updatebacklogrelaticeestimate: async (args) => {
    let db = await dbRtns.getDBInstance();
    let backlog = await dbRtns.findOne(db, backlogs, {
      project: args.project,
      priority: args.priority,
    });
    if (!backlog) return `backlog does not exist`;
    let findproject = await dbRtns.findOne(db, projectinfo, {
      name: args.project,
    });
    if (!findproject) return `error, project not added`;
    //get relative cost based on the project
    let newestimatedcost =
      findproject.costperhour *
      findproject.storypointsconversion *
      args.relativeestimate;
    //update the cost based on the relative estimate changing
    let updateResults = await dbRtns.updateOne(
      db,
      backlogs,
      { _id: backlog._id },
      {
        relativeestimate: args.relativeestimate,
        estimatedcost: newestimatedcost,
      }
    );
    backlog = await dbRtns.findOne(db, backlogs, {
      project: args.project,
      priority: args.priority,
    });
    return backlog;
  },
  deletebacklogitem: async (args) => {
    let db = await dbRtns.getDBInstance();
    let backlog = await dbRtns.findOne(db, backlogs, {
      project: `${args.project}`,
      priority: args.priority,
    });
    if (!backlog) return `backlog doesn't exist in ${args.project}`;
    else {
      let deletedBacklog = await dbRtns.deleteOne(db, backlogs, {
        _id: backlog._id,
      });
      return `Deleted backlog from ${backlog.project}`;
    }
  },
  /**************************************************************************************/
  /*                            Retrospective Functions                                 */
  /**************************************************************************************/
  getallretrobysprintperproject: async (args) => {
    let db = await dbRtns.getDBInstance();
    let retrospective = await dbRtns.findAll(db, retrospectives, {
      project: args.project,
      sprint: args.sprint,
    });
    if (!retrospective) return `Sprint Retrospeective does not exist`;
    else return retrospective;
  },
  getretospecificsprintbyproject: async (args) => {
    let db = await dbRtns.getDBInstance();
    let retrospective = await dbRtns.findOne(db, retrospectives, {
      project: args.project,
      sprint: args.sprint,
      userstory: args.userstory,
    });
    if (!retrospective) return `Sprint Retrospeective does not exist`;
    else return retrospective;
  },
  getallretroforproject: async (args) => {
    let db = await dbRtns.getDBInstance();
    let retrospective = await dbRtns.findAll(db, retrospectives, {
      project: args.project,
    });
    if (!retrospective) return `Sprint Retrospeective does not exist`;
    else return retrospective;
  },
  addsprintretrospective: async (args) => {
    let db = await dbRtns.getDBInstance();
    let findsprint = await dbRtns.findOne(db, sprints, {
      project: args.project,
      team: args.team,
      sprint: args.sprint,
    });
    if (!findsprint) return `Sprint does not exist`;
    let findproject = await dbRtns.findOne(db, projectinfo, {
      name: args.project,
    });
    if (!findproject) return `Project does not exist`;
    let originalstorypoints = findsprint.storypoints;
    let originalhours =
      findproject.storypointsconversion * findsprint.storypoints;
    let retrospective = `{"project":"${args.project}","sprint" : "${args.sprint}","userstory": "${args.userstory}","subtask": "${args.subtask}","originalstorypoints": ${originalstorypoints},"originalhours":${originalhours},"actualhours":${args.actualhours},"reestimatehours":${args.reestimatehours}}`;
    retrospective = JSON.parse(retrospective);
    let found = await dbRtns.findOne(db, retrospectives, {
      project: args.project,
      sprint: args.sprint,
      userstory: args.userstory,
      subtask: args.subtask,
    });
    if (!found) {
      let results = await dbRtns.addOne(db, retrospectives, retrospective);
      console.log(results);
      console.log(retrospective);
      return results.insertedCount === 1 ? retrospective : {};
    } else return `Already exists`;
  },
  updateretrospectivereestimates: async (args) => {
    let db = await dbRtns.getDBInstance();
    let retrospective = await dbRtns.findOne(db, retrospectives, {
      project: args.project,
      sprint: args.sprint,
      userstory: args.userstory,
    });
    if (!retrospective) return `Does not exist`;
    let updateResults = await dbRtns.updateOne(
      db,
      retrospectives,
      { _id: retrospective._id },
      { reestimatehours: args.reestimatehours }
    );
    retrospective = await dbRtns.findOne(db, retrospectives, {
      project: args.project,
      sprint: args.sprint,
      userstory: args.userstory,
    });
    return retrospective;
  },
};

export { resolvers };
