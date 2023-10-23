import { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Modal,
	Box,
	TextField,
	Snackbar,
} from "@mui/material";
import styles from "../styles.js";
import { jsonPost } from "../util";

const Navbar = () => {
	const reducer = (state, newState) => ({ ...state, ...newState });
	const navigate = useNavigate();
	const [state, setState] = useReducer(reducer, {
		openLogin: false,
		openRegister: false,
		username: "",
		password: "",
		error: "",
		snackbarMsg: "",
		displayName: "",
		userId: "",
	});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return;
		const { displayName, userId } = jwtDecode(token);
		setState({ displayName, userId });
	}, []);

	const Register = async () => {
		const { success } = await jsonPost("http://localhost:5000/register", {
			username: state.username,
			password: state.password,
		});

		!success
			? setState({ error: "Failed to add new user" })
			: (() => {
					setState({
						openRegister: false,
						error: "",
						snackbarMsg: "New user registered successfully!",
					});
			  })();
	};

	const Login = async () => {
		const { token } = await jsonPost("http://localhost:5000/login", {
			username: state.username,
			password: state.password,
		});

		!token
			? setState({ error: "Invalid username/password..." })
			: (() => {
					localStorage.setItem("token", token);
					const { displayName, userId } = jwtDecode(token);
					setState({
						openLogin: false,
						error: "",
						loginStatus: true,
						displayName,
						userId,
					});
			  })();
		navigate(0);
	};

	const Logout = async () => {
		setState({ displayName: "", userId: "" });
		localStorage.removeItem("token");
		navigate("/");
		navigate(0);
	};

	return (
		<AppBar position="sticky">
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					{state.displayName !== "" && `${state.displayName}'s `}Sprint Compass
				</Typography>
				{state.userId !== "" ? (
					<Button style={styles.formElement} color="inherit" onClick={Logout}>
						Logout
					</Button>
				) : (
					<div>
						<Button
							style={styles.formElement}
							color="inherit"
							onClick={() => setState({ openRegister: true })}
						>
							Register
						</Button>
						<Button
							style={styles.formElement}
							color="inherit"
							onClick={() => setState({ openLogin: true })}
						>
							Login
						</Button>
					</div>
				)}
			</Toolbar>
			<Modal
				open={state.openRegister}
				onClose={() => setState({ openRegister: false, error: "" })}
			>
				<Box style={styles.modal}>
					<Typography style={styles.formElement} variant="h6" component="h2">
						Register
					</Typography>
					<TextField
						error={state.error.length !== 0}
						style={styles.formElement}
						variant="outlined"
						label="Username"
						onChange={e => setState({ username: e.target.value })}
					/>
					<TextField
						error={state.error.length !== 0}
						style={styles.formElement}
						variant="outlined"
						label="Password"
						onChange={e => setState({ password: e.target.value })}
						type="password"
						helperText={state.error}
					/>
					<Box>
						<Button
							style={styles.formElement}
							onClick={() => setState({ openRegister: false, error: "" })}
						>
							Cancel
						</Button>
						<Button
							style={styles.formElement}
							onClick={Register}
							disabled={state.username === "" || state.password === ""}
						>
							Register
						</Button>
					</Box>
				</Box>
			</Modal>
			<Modal
				open={state.openLogin}
				onClose={() => setState({ openLogin: false, error: "" })}
			>
				<Box style={styles.modal}>
					<Typography style={styles.formElement} variant="h6" component="h2">
						Login
					</Typography>
					<TextField
						error={state.error.length !== 0}
						style={styles.formElement}
						variant="outlined"
						label="Username"
						onChange={e => setState({ username: e.target.value })}
					/>
					<TextField
						error={state.error.length !== 0}
						style={styles.formElement}
						variant="outlined"
						label="Password"
						onChange={e => setState({ password: e.target.value })}
						type="password"
						helperText={state.error}
					/>
					<Box>
						<Button
							style={styles.formElement}
							onClick={() => setState({ openLogin: false, error: "" })}
						>
							Cancel
						</Button>
						<Button
							style={styles.formElement}
							onClick={Login}
							disabled={state.username === "" || state.password === ""}
						>
							Login
						</Button>
					</Box>
				</Box>
			</Modal>
			<Snackbar
				open={state.snackbarMsg.length !== 0}
				autoHideDuration={3000}
				onClose={(event, reason) => {
					if (reason === "clickaway") {
						return;
					}
					setState({ snackbarMsg: "" });
				}}
				message={state.snackbarMsg}
			/>
		</AppBar>
	);
};

export default Navbar;
