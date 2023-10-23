import { buildSchema } from "graphql";
const schema = buildSchema(`
type Query {
"""  Project Query  """
 getallproject: [Project]
 deleteallprojects: String  
 deletespecificproject(name:String, teamname: String): String 
 getspecificproject(name:String, teamname: String): Project
"""  Sprint Query  """
 getallsprintsperproject(project: String): [Sprint]
 getspecificsprint(project:String, sprint: String):Sprint

 """ Userstory query """
 getalluserstory: [Userstory]
 getuserstorybyname(userstory:String): Userstory
 getuserstorybysprint(sprint: String, userstory:String): Userstory 

 """ Subtasks query """
 getallsubtasks: [Subtask]
 getallsubtaskbyuserstory(userstory:String): [Subtask]
 getsubtask(subtask:String): Subtask
 getsubtaskbyuserstory(userstory:String,subtask:String): Subtask
 deletesubtaskbyuserstory(userstory:String,subtask:String): String

 """ Team Member query """
 getallteammembers:[Member]
 getallmembersbyteam(team:String): [Member]
 getspecificmember(lastname:String,email:String): Member
 deleteamember(lastname:String,email:String): String
 deleteallmembers : String 

 """ Backlog query """
 getallbacklogbyproject(project:String): [Backlog]
 getspecificbacklog(project:String, priority:Int): Backlog
 deletebacklogitem(project:String,priority:Int): String

 """ Retrospective query """
 getallretrobysprintperproject(project:String, sprint:String): [Retrospective]
 getretospecificsprintbyproject(project:String,sprint:String,userstory:String): Retrospective
 getallretroforproject(project:String): [Retrospective]
}

""" --Project Type--  """
type Project {
 name: String
 description: String
 teamname: String
 numberofteammembers: Int
 numberofsprints: Int
 velocity: Int
 storypointsconversion: Int 
 costperhour: Int
}

"""  --Sprint Type--   """
type Sprint{
project: String,
team: String,
sprint: String,
numberofuserstory: Int,
storypoints: Int
}

""" --Userstory Type-- """
type Userstory{
    userstory: String,
    sprint: String,   
    status: String, 
    numberofsubtasks:Int,    
    userpoints:Int,
    assignedmember:String   
}

""" --Subtask Type-- """
type Subtask{
    subtask: String,
    userstory: String,   
    status: String,     
    assignedmember:String   
}

""" --Team Member Type-- """
type Member{
    team: String,
    firstname: String,   
    lastname: String,     
    email:String   
}

""" --Backlog Type-- """
type Backlog{
    project:String
    priority:Int
    userrole:String
    iwantto:String
    ican:String
    relativeestimate:Int
    estimatedcost:Int
}

""" --Retrospective Type-- """
type Retrospective{
    project:String
    sprint:String
    userstory:String
    subtask:String
    originalstorypoints:Int
    originalhours:Int
    actualhours:Int
    reestimatehours:Int
}
""" --Mutations Types--"""
type Mutation{ 

    """Project Mutations"""    
    addproject(name: String, description: String, teamname: String, numberofteammembers: Int, numberofsprints: Int, velocity: Int, storypointsconversion: Int, costperhour:Int): Project,
    updateproject(name: String, description: String, teamname: String, numberofteammembers: Int, numberofsprints: Int, velocity: Int, storypointsconversion: Int, costperhour:Int): Project
    
    """Sprint Mutations"""    
    addsprint(project:String,team:String,sprint:String,numberofuserstory: Int,storypoints:Int): Sprint  
    updatesprint(project:String,sprint:String,numberofuserstory: Int): Sprint

    """Usertory Mutations"""
    adduserstory(userstory:String, sprint:String, userpoints: Int): Userstory
    updateusertorystatus(userstory:String,status:String): Userstory
    updateusertorysubtasks(userstory:String,numberofsubtasks:Int): Userstory
    moveuserstorytosprint(userstory:String, sprint:String): Userstory
    assignmembertouserstory(userstory:String, assignedmember: String): Userstory

    """Subtasks Mutations"""
    addsubtask(subtask:String, userstory:String): Subtask
    assignmembertosubtask(assignedmember: String, subtask:String): Subtask
    updatesubtaskstatus(status:String,subtask:String): Subtask

    """Team Member Mutations"""
    addteammember(team:String,firstname:String,lastname:String,email:String): Member
    updatememberemail(firstname:String,lastname:String,email:String): Member
    updatememberlastname(firstname:String,lastname:String,email:String): Member
    movemembertoteam(team:String,lastname:String,email:String): Member

    """Backlog Mutations"""
    addbacklog(project:String,priority:Int,userrole:String,iwantto:String,ican:String,relativeestimate:Int): Backlog
    updatebacklogrelaticeestimate(project:String,priority:Int,relativeestimate:Int): Backlog
    
    """Retrospective Mutations"""
    addsprintretrospective(project:String,team:String, sprint:String,userstory:String,subtask:String, actualhours:Int, reestimatehours:Int): Retrospective
    updateretrospectivereestimates(project:String,sprint:String,userstory:String,reestimatehours:Int): Retrospective
}
`);
export { schema };
