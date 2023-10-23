import { useEffect, useReducer, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { graphqlPost } from "../util";
import jwtDecode from "jwt-decode";
import {
	Box,
	Typography,
	Button,
	Card,
	Table,
	TableCell,
	TableContainer,
	TableBody,
	TableRow,
	TableHead,
	Paper,
	Modal,
	TextField,
	Select,
	MenuItem,
	Autocomplete,
} from "@mui/material";
import styles from "../styles.js";

const StoryPage = () => {
	const { storyId } = useParams();
	const navigate = useNavigate();
	const reducer = (state, newState) => ({ ...state, ...newState });
	const pageLoaded = useRef(false);
	const [state, setState] = useReducer(reducer, {
		tasks: [],
		users: [],
		story: { name: "" },
		openAdd: false,
		openEditTask: false,
		openEditStory: false,
		selectedTask: 0,
		name: "",
		status: "Development",
		description: "",
		hourslogged: 0,
		hoursestimated: 0,
		userid: "",
		username: "",
	});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token || pageLoaded.current) return;
		(async () => {
			const { data } = await graphqlPost(
				"http://localhost:5000/graphql",
				token,
				{
					query: `
						query($storyid: String) {
							gettasksforstory(storyid: $storyid) {
								_id
								storyid
								name
								status 
							}
						}
					`,
					variables: { storyid: storyId },
				}
			);
			setState({ tasks: data.gettasksforstory });
		})();

		(async () => {
			const { data } = await graphqlPost(
				"http://localhost:5000/graphql",
				token,
				{
					query: `
						query($storyid: String) {
							getstorybyid(storyid: $storyid) {
								_id
								sprintid
								userid
								name
								description
								status
								hourslogged
								hoursestimated
								user { username }
							} 
						}
					`,
					variables: { storyid: storyId },
				}
			);
			setState({ story: data.getstorybyid });
		})();

		(async () => {
			const projectId = (
				await graphqlPost("http://localhost:5000/graphql", token, {
					query: `
						query($storyid: String) {
							getprojectidbystoryid(storyid: $storyid)
						}
					`,
					variables: { storyid: storyId },
				})
			).data.getprojectidbystoryid;

			const { data } = await graphqlPost(
				"http://localhost:5000/graphql",
				token,
				{
					query: `
						query($projectid: String) {
							getusersforproject(projectid: $projectid) {
								userid
								username
							}
						}
					`,
					variables: { projectid: projectId },
				}
			);
			setState({ users: data.getusersforproject });
		})();

		pageLoaded.current = true;
	}, []);

	const addTask = async () => {
		const token = localStorage.getItem("token");
		!token && navigate("/");
		const { data } = await graphqlPost("http://localhost:5000/graphql", token, {
			query: `
				mutation($storyid: String, $name: String) {
					createtask(storyid: $storyid name: $name) {
						_id
						storyid
						name
						status 
					} 
				}
			`,
			variables: {
				storyid: storyId,
				name: state.name,
			},
		});
		if (data.createtask === null) return;
		const tasks = state.tasks.concat([data.createtask]);
		setState({ tasks, openAdd: false, name: "" });
	};

	const updateTask = async () => {
		const token = localStorage.getItem("token");
		!token && navigate("/");
		const { data } = await graphqlPost("http://localhost:5000/graphql", token, {
			query: `
			mutation($taskid: String, $name: String, $status: String) {
				edittask(taskid: $taskid, name: $name, status: $status) {
					_id
					name
					status
				}
			}
			`,
			variables: {
				taskid: state.tasks[state.selectedTask]._id,
				name: state.name,
				status: state.status,
			},
		});
		if (data.edittask === null) return;
		let ref = state.tasks.slice();
		ref[state.selectedTask].name = state.name;
		ref[state.selectedTask].status = state.status;
		setState({ openEditTask: false, name: "", status: "Development" });
	};

	const deleteTask = async () => {
		const token = localStorage.getItem("token");
		!token && navigate("/");
		const { data } = await graphqlPost("http://localhost:5000/graphql", token, {
			query: `
				mutation($taskid: String) {
					deletetask(taskid: $taskid)
				}
			`,
			variables: {
				taskid: state.tasks[state.selectedTask]._id,
			},
		});
		if (!data.deletetask) return;
		setState({
			tasks: state.tasks.filter((e, idx) => idx !== state.selectedTask),
			openEditTask: false,
			name: "",
			status: "Development",
		});
	};

	const updateStory = async () => {
		const token = localStorage.getItem("token");
		!token && navigate("/");
		try {
			const { data } = await graphqlPost(
				"http://localhost:5000/graphql",
				token,
				{
					query: `
					mutation($userid: String, $storyid: String, $name: String, $description: String, $status: String, $hoursestimated: Int, $hourslogged: Int) {
						editstory(userid: $userid, storyid: $storyid, name: $name, description: $description, status: $status, hoursestimated: $hoursestimated, hourslogged: $hourslogged) {
							_id
							sprintid
							userid
							name
							description
							status
							hourslogged
							hoursestimated
							user { username }
						}
					}
				`,
					variables: {
						userid: state.userid,
						storyid: storyId,
						name: state.name,
						description: state.description,
						status: state.status,
						hourslogged: parseInt(state.hourslogged),
						hoursestimated: parseInt(state.hoursestimated),
					},
				}
			);
			console.log(data);
			if (data.editstory === null) return;
			setState({
				story: data.editstory,
				openEditStory: false,
				name: "",
				status: "Development",
				description: "",
				hourslogged: 0,
				hoursestimated: 0,
				userid: "",
			});
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Card>
			<Card style={{ display: "flex" }}>
				<h1 style={{ marginLeft: "2%" }}>Tasks for {state.story.name}</h1>
				<Button
					variant="contained"
					style={{
						marginTop: "1%",
						marginLeft: "45%",
						height: "5%",
						width: "5%",
					}}
					onClick={() => setState({ openAdd: true })}
				>
					New Task
				</Button>
				<Button
					variant="contained"
					style={{
						marginTop: "1%",
						marginLeft: "1%",
						height: "5%",
						width: "8%",
					}}
					onClick={() =>
						setState({
							...state.story,
							username: state.story.user[0].username,
							openEditStory: true,
						})
					}
				>
					Edit Story
				</Button>
				<Button
					variant="contained"
					style={{
						marginTop: "1%",
						marginLeft: "1%",
						height: "5%",
						width: "8%",
					}}
					onClick={() => navigate("/")}
				>
					Return Home
				</Button>
			</Card>
			{state.tasks.length > 0 && (
				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Status</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{state.tasks.map((task, idx) => {
								return (
									<TableRow
										style={styles.tableRow}
										key={task._id}
										onClick={() =>
											setState({
												selectedTask: idx,
												name: state.tasks[idx].name,
												openEditTask: true,
											})
										}
									>
										<TableCell>{task.name}</TableCell>
										<TableCell>{task.status}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			<Modal
				open={state.openAdd}
				onClose={() => setState({ openAdd: false, name: "" })}
			>
				<Box style={styles.modal}>
					<Typography style={styles.formElement} variant="h6" component="h2">
						Create New Task
					</Typography>
					<TextField
						style={styles.formElement}
						variant="outlined"
						label="Name"
						value={state.name}
						onChange={e => setState({ name: e.target.value })}
					/>
					<Box>
						<Button
							style={styles.formElement}
							onClick={() => setState({ openAdd: false, name: "" })}
						>
							Cancel
						</Button>
						<Button style={styles.formElement} onClick={addTask}>
							Add
						</Button>
					</Box>
				</Box>
			</Modal>
			<Modal
				open={state.openEditTask}
				onClose={() =>
					setState({ openEditTask: false, name: "", status: "Development" })
				}
			>
				<Box style={styles.modal}>
					<Typography style={styles.formElement} variant="h6" component="h2">
						Edit{" "}
						{state.tasks[state.selectedTask] != undefined &&
							state.tasks[state.selectedTask].name}
					</Typography>
					<TextField
						style={styles.formElement}
						variant="outlined"
						label="Name"
						value={state.name}
						onChange={e => setState({ name: e.target.value })}
					/>
					<Select
						style={styles.formElement}
						value={state.status}
						label="Status"
						onChange={e => setState({ status: e.target.value })}
						sx={{ width: 200 }}
					>
						<MenuItem value="Planned">Planned</MenuItem>
						<MenuItem value="Development">Development</MenuItem>
						<MenuItem value="Testing">Testing</MenuItem>
						<MenuItem value="Completed">Completed</MenuItem>
					</Select>
					<Box>
						<Button
							style={styles.formElement}
							onClick={() =>
								setState({
									openEditTask: false,
									name: "",
									status: "Development",
								})
							}
						>
							Cancel
						</Button>
						<Button style={styles.formElement} onClick={deleteTask}>
							Delete
						</Button>
						<Button style={styles.formElement} onClick={updateTask}>
							Update
						</Button>
					</Box>
				</Box>
			</Modal>
			<Modal
				open={state.openEditStory}
				onClose={() =>
					setState({
						openEditStory: false,
						name: "",
						status: "Development",
						description: "",
						hourslogged: 0,
						hoursestimated: 0,
						userid: "",
					})
				}
			>
				<Box style={styles.modal}>
					<Typography style={styles.formElement} variant="h6" component="h2">
						Edit {state.story.name} for {state.username}
					</Typography>
					<TextField
						style={styles.formElement}
						variant="outlined"
						label="Name"
						value={state.name}
						onChange={e => setState({ name: e.target.value })}
					/>
					<TextField
						style={styles.formElement}
						variant="outlined"
						label="Description"
						value={state.description}
						onChange={e => setState({ description: e.target.value })}
					/>
					<Autocomplete
						style={styles.formElement}
						options={state.users}
						getOptionLabel={option => option.username}
						onChange={(e, value) => setState({ userid: value.userid })}
						renderInput={params => (
							<TextField {...params} label="User" variant="outlined" />
						)}
					/>
					<Select
						style={styles.formElement}
						value={state.status}
						label="Status"
						onChange={e => setState({ status: e.target.value })}
						sx={{ width: 200 }}
					>
						<MenuItem value="Planned">Planned</MenuItem>
						<MenuItem value="Development">Development</MenuItem>
						<MenuItem value="Testing">Testing</MenuItem>
						<MenuItem value="Completed">Completed</MenuItem>
					</Select>
					<TextField
						style={styles.formElement}
						variant="outlined"
						label="Hours Logged"
						value={state.hourslogged}
						onChange={e => setState({ hourslogged: e.target.value })}
					/>
					<TextField
						style={styles.formElement}
						variant="outlined"
						label="Hours Estimated"
						value={state.hoursestimated}
						onChange={e => setState({ hoursestimated: e.target.value })}
					/>
					<Box>
						<Button
							style={styles.formElement}
							onClick={() =>
								setState({
									openEditStory: false,
									name: "",
									status: "Development",
									description: "",
									hourslogged: 0,
									hoursestimated: 0,
									userid: "",
								})
							}
						>
							Cancel
						</Button>
						<Button style={styles.formElement} onClick={() => {}}>
							Delete
						</Button>
						<Button style={styles.formElement} onClick={updateStory}>
							Update
						</Button>
					</Box>
				</Box>
			</Modal>
		</Card>
	);
};

export default StoryPage;
