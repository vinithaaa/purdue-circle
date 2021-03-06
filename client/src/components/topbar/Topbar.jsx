import "./topbar.css";
import { Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRef } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import React, { useState } from "react";
import axios from "axios";
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "../../components/globalStyle";
import { lightTheme, darkTheme } from "../../components/Theme";
import  {useDarkMode} from "../../components/useDarkMode";
import Toggle from "../../components/Toggle"

export default function Topbar() {
	const { user } = useContext(AuthContext);
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const username = useRef();
	const { isFetching, dispatch } = useContext(AuthContext);
	const history = useHistory();
	const [validQ, setValidQ] = useState(0);

	const [theme, themeToggler, mountedComponent] = useDarkMode();
	const themeMode = theme === 'light' ? lightTheme : darkTheme
	if(!mountedComponent) return <div/>

	const handleClick = async e => {
		e.preventDefault();
		console.log(username.current.value)
		const usernameInput = {
			username: username.current.value,
		};

		try{
			const res = await axios.post("/auth/search",usernameInput);
            console.log("user exists")
			history.push(`/profile/${username.current.value}`);
			window.location.href = '/profile/'+username.current.value;
		}catch(err){
			document.getElementById("overallError").innerHTML = 
			"User doesn't exist";
			   console.log("User doesn't exist")
		}
			 
	};

	return (
		<ThemeProvider theme={themeMode}>
			<>
		<GlobalStyles/>
		<div className="topbarContainer" role="navigation" aria-label="The topbar contains the following from left to right: the PurdueCircle logo, switch theme button, search bar, search button, logout button, and profile picture button">
			<div className="topbarLeft" role="navigation" aria-label="when clicked it leads user to home page">
				<Link to="/home" style={{ textDecoration: "none" }}>
					<span className="logo">PurdueCircle</span>
				</Link>
			</div>

			<div className="switchTheme" role="button" aria-label="when clicked it chaneges the theme from light to dark and vice versa">
			<Toggle theme={theme} toggleTheme={themeToggler} />	
			</div>

			<div className="topbarCenter">
				<div className="searchbar" role="searchbox" aria-label="this is where users can type in users/topics they are looking for">
					<Search className="searchIcon" />
					<input
						placeholder="Search for friends or topics"
						className="searchInput"
						ref={username}
					/>
				</div>

			</div>

			<div className="topbarRight">
				<button className="searchButton" onClick={handleClick} role="button" aria-label="when button is clicked, it searches for the user/topic that was written in the search bar">
                   Search
				</button>

				<Link to="/logout" style={{ textDecoration: "none" }} role="button" aria-label="when clicked, it logs the user out">
					<span className="topbarLink">Logout</span>
				</Link>

				{
					<Link role="button" aria-label="when this button is clicked, the user is redirected to their profile page"
						onClick={()=>{window.location.href = '/profile/' + user.username;} }>
						<img
							src={
								user.profilePicture
									? PF + "person/"+ user.profilePicture
									: PF + "person/noAvatar.png"
									//: PF + "person/riya.png"
							}
							alt={user.username + "'s profile picture; when clicked will take you to the profile page of that user"}
							className="topbarImg"
						/>
					</Link>
				}
			</div>
		</div>
		</>
    </ThemeProvider>
	);
}
