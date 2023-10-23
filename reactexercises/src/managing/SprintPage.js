import { useEffect, useReducer, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { graphqlPost } from "../util";
import jwtDecode from "jwt-decode";
import {
	Button,
	Card,
	Table,
	TableCell,
	TableContainer,
	TableBody,
	TableRow,
	TableHead,
	Paper,
} from "@mui/material";
import styles from "../styles.js";

const SprintPage = () => {
	const {sprintId} = useParams();
	const reducer = (state, newState) => ({ ...state, ...newState });
	const navigate = useNavigate();
	const pageLoaded = useRef(false);
	const [state, setState] = useReducer(reducer, {
		stories: [],
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
						query($sprintid: String) {
							getstoriesforsprint(sprintid: $sprintid) {
								_id
								name
								description
								status
								sprintid
								userid
								hourslogged
							}
						}
					`,
					variables: { sprintid: sprintId },
				}
			);
			setState({sprints: data.getstoriesforsprint });
		})();
	}, []);

	const selectStories = id => {
		navigate(`/story/${id}`);
	};

	const returnHome = () => {
		navigate("/")
	}

	return (
		<Card>
			<Card style={{display: 'flex'}}>
				<h1 style={{marginLeft: "2%"}}>Stories for Sprint {sprintId}</h1>
				<Button variant="contained" style={{marginTop: "1%", marginLeft: "45%", height: "5%", width: "5%"}}>
					New Sprint
				</Button>
				<Button 
					variant="contained" 
					style={{marginTop: "1%", marginLeft: "1%", height: "5%", width: "8%"}}
				>
					Edit Sprint
				</Button>
				<Button 
					variant="contained"
					style={{marginTop: "1%", marginLeft: "1%", height: "5%", width: "8%"}}
					onClick={returnHome}
				>
					Return Home
				</Button>
			</Card>
			{state.stories.length > 0 && (
				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Sprint ID</TableCell>
								<TableCell>User ID</TableCell>
								<TableCell>Hours Logged</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{state.stories.map(story => {
								return (
									<TableRow
										style={styles.tableRow}
										key={story._id}
										onClick={() => selectStories(story._id)}
									>
										<TableCell>{story.name}</TableCell>
										<TableCell>{story.description}</TableCell>
										<TableCell>{story.name}</TableCell>
										<TableCell>{story.sprintid}</TableCell>
										<TableCell>{story.userid}</TableCell>
										<TableCell>{story.hourslogged}</TableCell>
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

export default SprintPage;
