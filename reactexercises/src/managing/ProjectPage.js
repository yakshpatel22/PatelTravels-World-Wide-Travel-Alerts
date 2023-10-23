import { useEffect, useReducer, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { graphqlPost } from "../util";
import jwtDecode from "jwt-decode";
import {
	Button,
	Card,
	Paper,
	Table,
	TableCell,
	TableContainer,
	TableBody,
	TableRow,
	TableHead,
	Modal,
	TextField,
} from "@mui/material";
import styles from "../styles.js";

const ProjectPage = () => {
	const { projectId } = useParams();
	const reducer = (state, newState) => ({ ...state, ...newState });
	const navigate = useNavigate();
	const pageLoaded = useRef(false);
	const [state, setState] = useReducer(reducer, {
		sprints: [],
		snackbarMsg: "",
		loginStatus: false,
		openAdd: false,
		openEdit: false,
	});
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token || pageLoaded.current) return;
		//const { userId } = jwtDecode(token);
		(async () => {
			const { data } = await graphqlPost(
				"http://localhost:5000/graphql",
				token,
				{
					query: `
						query($projectid: String) {
							getsprintsforproject(projectid: $projectid) {
								_id
								name
								status
  								projectid
							}
						}
					`,
					variables: { projectid: projectId },
				}
			);
			setState({ sprints: data.getsprintsforproject });
		})();
	}, []);

	const selectSprint = id => {
		navigate(`/sprint/${id}`);
	};

	const returnHome = () => {
		navigate("/");
	};

	return (
		<Card>
			<Card style={{ display: "flex" }}>
				<h1 style={{ marginLeft: "2%" }}>Sprints for Project {projectId}</h1>
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
					New Sprint
				</Button>
				<Button
					variant="contained"
					style={{
						marginTop: "1%",
						marginLeft: "1%",
						height: "5%",
						width: "8%",
					}}
				>
					Edit Project
				</Button>
				<Button
					variant="contained"
					style={{
						marginTop: "1%",
						marginLeft: "1%",
						height: "5%",
						width: "8%",
					}}
					onClick={returnHome}
				>
					Return Home
				</Button>
			</Card>
			<Modal open={state.openAdd} onClose={() => setState({ openAdd: false })}>
				<TextField />
			</Modal>

			{state.sprints.length > 0 && (
				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Status</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{state.sprints.map(sprint => {
								return (
									<TableRow
										style={styles.tableRow}
										key={sprint._id}
										onClick={() => selectSprint(sprint._id)}
									>
										<TableCell>{sprint.name}</TableCell>
										<TableCell>{sprint.status}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Card>
	);
};

export default ProjectPage;
