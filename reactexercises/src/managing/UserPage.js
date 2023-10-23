import { useReducer, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import {
	Grid,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Modal,
	Box,
	Autocomplete,
	TextField,
	Select,
	MenuItem,
} from "@mui/material";
import styles from "../styles.js";
import { graphqlPost } from "../util";

const UserPage = () => {
	const reducer = (state, newState) => ({ ...state, ...newState });
	const navigate = useNavigate();
	const { projectId } = useParams();
	const pageLoaded = useRef(false);
	const [state, setState] = useReducer(reducer, {
		openAdd: false,
		openEdit: false,
		users: [],
		unassignedUsers: [],
		selectedUser: 0,
		project: "",
		username: "",
		role: "Member",
	});

	useEffect(() => {
		const token = localStorage.getItem("token");
		!token && navigate("/");
		if (pageLoaded.current) return;
		(async () => {
			const { data } = await graphqlPost(
				"http://localhost:5000/graphql",
				token,
				{
					query: `
						query($projectid: String) {
							getusersforproject(projectid: $projectid) {
								_id
								userid
								username
								role
							}
						}
					`,
					variables: { projectid: projectId },
				}
			);
			setState({ users: data.getusersforproject });
		})();

		(async () => {
			const { data } = await graphqlPost(
				"http://localhost:5000/graphql",
				token,
				{
					query: `
						query($projectid: String) {
							getprojectbyid(projectid: $projectid) {
								_id
								name
								description
							}
						}
					`,
					variables: { projectid: projectId },
				}
			);
			setState({ project: data.getprojectbyid.name });
		})();

		pageLoaded.current = true;
	});

	const openAddUserModal = async () => {
		const token = localStorage.getItem("token");
		!token && navigate("/");
		const { data } = await graphqlPost("http://localhost:5000/graphql", token, {
			query: `
					query {
						getusers {
							_id
							username
						}
					}
				`,
		});
		const filteredUsers = data.getusers.filter(e => {
			return !state.users.some(f => {
				return f.username === e.username;
			});
		});
		setState({ unassignedUsers: filteredUsers, openAdd: true });
	};

	const addUser = async () => {
		const token = localStorage.getItem("token");
		!token && navigate("/");
		const { userId } = jwtDecode(token);
		const idx = state.unassignedUsers.findIndex(
			e => e.username === state.username
		);
		if (idx === -1) return;
		const { data } = await graphqlPost("http://localhost:5000/graphql", token, {
			query: `
				mutation($reqid: String, $userid: String, $projectid: String) {
					addusertoproject(reqid: $reqid, userid: $userid, projectid: $projectid) }
			`,
			variables: {
				reqid: userId,
				userid: state.unassignedUsers[idx]._id,
				projectid: projectId,
			},
		});
		if (!data.addusertoproject) return;
		const users = state.users.concat([
			{
				userid: state.unassignedUsers[idx]._id,
				username: state.unassignedUsers[idx].username,
				role: "Member",
			},
		]);
		setState({ users, openAdd: false, username: "" });
	};

	const assignRole = async () => {
		const token = localStorage.getItem("token");
		!token && navigate("/");
		const { userId } = jwtDecode(token);
		const { data } = await graphqlPost("http://localhost:5000/graphql", token, {
			query: `
				mutation($role: String, $reqid: String, $userid: String, $projectid: String) {
					assignroletouser(role: $role, reqid: $reqid userid: $userid, projectid: $projectid)
				}
			`,
			variables: {
				reqid: userId,
				userid: state.users[state.selectedUser].userid,
				projectid: projectId,
				role: state.role,
			},
		});
		if (!data.assignroletouser) return;
		state.users.slice()[state.selectedUser].role = state.role;
		setState({ openEdit: false, role: "Member" });
	};

	const removeUser = async () => {
		const token = localStorage.getItem("token");
		!token && navigate("/");
		const { userId } = jwtDecode(token);
		const { data } = await graphqlPost("http://localhost:5000/graphql", token, {
			query: `
				mutation($reqid: String, $userid: String, $projectid: String) {
					removeuserfromproject(reqid: $reqid userid: $userid, projectid: $projectid)
				}
			`,
			variables: {
				reqid: userId,
				userid: state.users[state.selectedUser].userid,
				projectid: projectId,
			},
		});
		if (!data.removeuserfromproject) return;
		setState({
			users: state.users.filter((e, idx) => idx !== state.selectedUser),
			openEdit: false,
			role: "Member",
		});
	};

	return (
		<div>
			<Grid style={styles.headerContainer} container spacing={2}>
				<Grid item xs={10}>
					<Typography variant="h4" component="h2">
						Users for {state.project}
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Button onClick={openAddUserModal}>Add User</Button>
				</Grid>
			</Grid>
			{state.users.length !== 0 && (
				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Role</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{state.users.map((user, idx) => {
								return (
									<TableRow
										style={styles.tableRow}
										key={user.userid}
										onClick={() =>
											setState({ selectedUser: idx, openEdit: true })
										}
									>
										<TableCell>{user.username}</TableCell>
										<TableCell>{user.role}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			<Modal
				open={state.openAdd}
				onClose={() => setState({ openAdd: false, username: "" })}
			>
				<Box style={styles.modal}>
					<Typography style={styles.formElement} variant="h6" component="h2">
						Add User
					</Typography>
					<Autocomplete
						style={styles.formElement}
						options={state.unassignedUsers}
						getOptionLabel={option => option.username}
						onChange={(e, value) => setState({ username: value.username })}
						renderInput={params => (
							<TextField {...params} label="Username" variant="outlined" />
						)}
					/>
					<Box>
						<Button
							style={styles.formElement}
							onClick={() => setState({ openAdd: false, username: "" })}
						>
							Cancel
						</Button>
						<Button style={styles.formElement} onClick={addUser}>
							Add
						</Button>
					</Box>
				</Box>
			</Modal>
			<Modal
				open={state.openEdit}
				onClose={() => setState({ openEdit: false, role: "Member" })}
			>
				<Box style={styles.modal}>
					<Typography style={styles.formElement} variant="h6" component="h2">
						Assign Role to User
					</Typography>
					<Select
						value={state.role}
						label="Role"
						onChange={e => setState({ role: e.target.value })}
						sx={{ width: 200 }}
					>
						<MenuItem value="Member">Member</MenuItem>
						<MenuItem value="Read Only">Read Only</MenuItem>
						<MenuItem value="Admin">Admin</MenuItem>
					</Select>
					<Box>
						<Button
							style={styles.formElement}
							onClick={() => setState({ openEdit: false, username: "Member" })}
						>
							Cancel
						</Button>
						<Button style={styles.formElement} onClick={removeUser}>
							Remove
						</Button>
						<Button style={styles.formElement} onClick={assignRole}>
							Assign
						</Button>
					</Box>
				</Box>
			</Modal>
		</div>
	);
};

export default UserPage;
