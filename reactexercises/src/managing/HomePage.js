import { useReducer, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
	TextField,
	Snackbar,
} from "@mui/material";
import styles from "../styles.js";
import { graphqlPost } from "../util";

const HomePage = () => {
	const reducer = (state, newState) => ({ ...state, ...newState });
	const navigate = useNavigate();
	const pageLoaded = useRef(false);
	const [state, setState] = useReducer(reducer, {
		projects: [],
		snackbarMsg: "",
		loginStatus: false,
	});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token || pageLoaded.current) return;
		const { userId } = jwtDecode(token);
		(async () => {
			const { data } = await graphqlPost(
				"http://localhost:5000/graphql",
				token,
				{
					query: `
						query($userid: String) {
							getprojectsforuser(userid: $userid) {
								_id
								name
								description
							}
						}
					`,
					variables: { userid: userId },
				}
			);
			console.log(data);
			setState({ projects: data.getprojectsforuser, loginStatus: true });
		})();
		pageLoaded.current = true;
	}, []);

	const selectProject = id => {
		navigate(`/project/${id}`);
	};

	return (
		<div>
			<Grid style={styles.headerContainer} container spacing={2}>
				<Grid item xs={10}>
					<Typography variant="h4" component="h2">
						{state.loginStatus ? "My Projects" : "Home Page"}
					</Typography>
				</Grid>
				{state.loginStatus && (
					<Grid item xs={2}>
						<Button>Create Project</Button>
					</Grid>
				)}
			</Grid>
			{state.loginStatus && state.projects.length !== 0 && (
				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Description</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{state.projects.map(project => {
								return (
									<TableRow
										style={styles.tableRow}
										key={project._id}
										onClick={() => selectProject(project._id)}
									>
										<TableCell>{project.name}</TableCell>
										<TableCell>{project.description}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</div>
	);
};

export default HomePage;
