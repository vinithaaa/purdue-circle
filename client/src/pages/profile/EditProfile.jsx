import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import { Button, TextField, InputLabel } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

export default function EditProfile() {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const [user, setUser] = useState({});
    const [file, setFile] = useState(null);

	const history = useHistory();
	var urlString = window.location.href;
	let lastIndex = urlString.lastIndexOf("/") + 1;
	var urlString2 = urlString.substring(0, lastIndex - 1);
	let lastIndex2 = urlString2.lastIndexOf("/") + 1;
	const username = urlString2.substring(lastIndex2);
	console.log("username=");
	console.log(username);
	const [usernameEdit, setUsername] = useState(user.username);
	const [bioEdit, setBio] = useState(user.desc);

	useEffect(() => {
		const fetchUser = async () => {
			const res = await axios.get(`/users?username=${username}`);
			setUser(res.data);
		};
		fetchUser();
	}, [username]);

	const [validU, setValidU] = useState(0);

	const usernameInput = useRef();
	const bioInput = useRef();

	function validateUsername() {
		if (
			!(
				usernameInput.current.value.length <= 16 &&
				!/\s/g.test(usernameInput.current.value)
			)
		) {
			document.getElementById("unameError").innerHTML =
				"Please enter valid username!";
			console.log("username less than 16 char");
			setValidU(0);
		} else {
			document.getElementById("unameError").innerHTML = "";
			console.log(usernameInput.current.value);
			setValidU(1);
		}
	}
	const handleDelete = async e => {
        e.preventDefault();
        try {
            
            const allPosts = await axios.get("/posts/profile/" + username);
            console.log(allPosts);
            for(let i = 0; i<allPosts.data.length; i++){
                const post = allPosts.data[i];
                await axios.delete(`/posts/${post._id}`);
            }

            const res = await axios.delete(`/users/${user._id}`);
            history.push("/register");
        } catch (err) {
            console.log("error with deleting");
        }
    };


	const handleEdit = async e => {
		e.preventDefault();

		if (usernameInput.current.value.length != 0) {
			try {
				axios.put("/users/" + user._id, {
					username: usernameInput.current.value
				});
				//history.push("/login");
			} catch (err) {
				console.log("error with editing username");
			}
		}

		if (bioInput.current.value.length != 0) {
			try {
				axios.put("/users/" + user._id, { desc: bioInput.current.value });
				//history.push("/login");
			} catch (err) {
				console.log("error with editing bio");
			}
		}

		console.log("file: ");
		console.log(file);
		if (file) {
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            
            try {
                axios.put("/users/" + user._id, { profilePicture:fileName });
            } catch (err) {
				console.log("error pushing filename");
			}

			try {
                await axios.post("/upload2", data);
            } catch (err) {console.log("error uploading filename");}
        }

		history.push("/login");
	};

	return (
		<>
			<Topbar />
			<div className="profile">
				<div className="profileRight">
					<div className="profileRightTop">
						
						<div className="profileCover" aria-label="">
							<img
								className="profileCoverImg"
								src={
									user.coverPicture
										? user.coverPicture
										: //: PF + "person/noCover.png"
										  PF + "person/purdueCover.jpeg"
								}
								alt={user.username + "'s cover photo"}
							/>
							<img
								className="profileUserImg"
								src={
									user.profilePicture
										? PF + "person/" + user.profilePicture
										: PF + "person/noAvatar.png"
										//:  PF + "person/riya.png"
								}
								alt={user.username + "'s profile photo"}
							/>
						</div>
						{/* {user.username} */}
						<div className="profileInfo">
							<Button
								variant="contained"
								className="editProfileBtn"
								component="label"
								//onClick={handleImage}
							>
								Upload New Image
								{/*<input type="file"id="profilePic" name="profilePic" accept="image/png, image/jpeg"></input>*/}
								<input
                                style={{ display: "none" }}
                                type="file"
                                id="file"
                                accept=".png,.jpeg,.jpg"
                                onChange={e => setFile(e.target.files[0])}
                            />
							</Button>

							<div className="editProfileInfo">
							<TextField
								id="outlined-basic"
								label="Username"
								variant="outlined"
								inputRef={usernameInput}
								onBlur={validateUsername}
								/*style={{ marginTop: "3vh" }}*/
							/>
							</div>
							<div id="unameError" style={{ color: "red" }}></div>
							<small className="inputDesc">
								Username length is restricted to 16 characters.
							</small>
							<div className="editProfileInfo">
							{/* <span className="profileInfoDesc">Bio</span> */}
							<TextField
								id="outlined-multiline-static"
								label="Bio"
								multiline
								rows={4}
								inputRef={bioInput}
							/>
							</div>
							{/* <div id="unameError" style={{ color: "red" }}></div>
							<InputLabel style={{ textAlign: "center" }}>
								Username length is restricted to 16 characters.
                            </InputLabel> */}

							<div className="spacer"></div>

							{/* TODO: Implement the functionality of the save changes button */}
							<Button
								variant="contained"
								className="editProfileBtn"
								onClick={handleEdit}
							>
								Save Changes
							</Button>
							<div className="spacer"></div>
							<Button
								variant="contained"
								className="deleteProfileBtn"
								onClick={handleDelete}
							>
								Delete Profile
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
