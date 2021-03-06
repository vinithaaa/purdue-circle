import "./post.css";
import { MoreVert, BookmarkAdd } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "left",
	color: theme.palette.text.secondary
}));

export default function Post({ post }) {
	const [like, setLike] = useState(post.likes.length);
	const [saveStatus, setSaveStatus] = useState();
	const [commentObjs, setCommentObjs] = useState(post.comments);
	const [isLiked, setIsLiked] = useState(false);
	const [user, setUser] = useState({});
	const [topicName, setTopic] = useState();
	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const { user: currentUser, dispatch  } = useContext(AuthContext);
	const history = useHistory();
	const[isSaved, setIsSaved] = useState(currentUser.savedPosts.includes(post._id));
	

	useEffect(() => {
		setIsLiked(post.likes.includes(currentUser._id));
	
		//setIsSaved(currentUser.savedPosts.includes(post._id));

	}, [currentUser._id, post.likes]);

	
	useEffect(() => {
	
		setIsSaved(currentUser.savedPosts.includes(post._id));
		console.log("issaved = "+isSaved)
		console.log(currentUser)
		console.log(post._id)

	}, [currentUser._id, post._id]);

	
	useEffect(() => {
		console.log("currentUser inside useEffect");
		console.log(currentUser);
		console.log("savedPosts");
		console.log(currentUser.savedPosts);
		console.log(post._id);
		console.log("includes?")
		console.log(currentUser.savedPosts.includes(post._id));
		setIsSaved(currentUser.savedPosts.includes(post._id));
		if(isSaved){
			console.log("entered if")
			setSaveStatus("saved ");
		}else{
			setSaveStatus("");
		}

		
	}, [currentUser.savedPosts, post._id]);

	useEffect(() => {
		const fetchUser = async () => {
			const res = await axios.get(`/users?userId=${post.userId}`);
			setUser(res.data);
		};
		fetchUser();
	}, [post.userId]);

	useEffect(() => {
		const fetchTopicName = async () => {
			const res = await axios.get(`/users?userId=${post.topic}`);
			//console.log(res.data.username)
			setTopic(res.data.username);
		};
		fetchTopicName();
	}, [post.topic]);


	

	const showCommentsToggle = () => {
		if (showComments) {
			setShowComments(false);
		} else {
			setShowComments(true);
		}
	};

	const commentPostHandler = async e => {
		e.preventDefault();
		console.log("comment post handler");
		console.log(newComment);
		console.log(post._id);
		console.log(currentUser._id);
		const newCommentObj = {
			text: newComment,
			username: currentUser.username
		};
		console.log(newCommentObj);
		try {
			await axios.put("/posts/" + post._id + "/comment", newCommentObj);
			axios.put("/users/"+ currentUser._id +"/LikePost", {
				id: post._id,
			  });
			  dispatch({ type: "LIKEPOST", payload: post._id });
			console.log("comment posted");
			const res = await axios.get(`/posts/comments/${post._id}`);
			setCommentObjs(res.data);
			setNewComment("");
			// window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	const likeHandler = () => {
		if(!isLiked) {
			try {
				axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
				axios.put("/users/"+ currentUser._id +"/LikePost", {
					id: post._id,
				  });
				  dispatch({ type: "LIKEPOST", payload: post._id });
			} catch (err) {console.log(err)}
		} else {
			try {
				axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
				axios.put("/users/"+ currentUser._id +"/unLikePost", {
					id: post._id,
				  });
				  dispatch({ type: "UNLIKEPOST", payload: post._id });
			} catch (err) {console.log(err)}
		}
		
		setLike(isLiked ? like - 1 : like + 1);
		setIsLiked(!isLiked);
	};


	const savePostHandler = () => {
        //const tempUser = axios
		console.log("test 1");
		console.log(currentUser);
		console.log("test 2");
		console.log(currentUser.savedPosts);
		console.log("test 3");
		console.log(post._id);
		setIsSaved(currentUser.savedPosts.includes(post._id));
		if(!isSaved){
			try{	
				// add to savedPosts array
				//"/:id/savePost"
				
				axios.put("/users/" + currentUser._id + "/savePost", {
					id: post._id,
				  });
				  setSaveStatus("saved");
				  
				 dispatch({ type: "SAVEPOST", payload: post._id });
				  console.log("saved:");
				  console.log(currentUser.savedPosts);

			}catch(err){console.log(err)}
		}else{
			try{	
				// remove to savedPosts array

				axios.put("/users/" + currentUser._id + "/unsavePost", {
					id: post._id,
				  });
				  setSaveStatus("");
				 dispatch({ type: "UNSAVEPOST", payload: post._id });
				  console.log("unsaved:");
				  console.log(currentUser.savedPosts);

			}catch(err){console.log(err)}
		}
		setIsSaved(!isSaved);
		

	};




	const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

	const renderText = txt =>
		txt
			.split(" ")
			.map(part =>
				URL_REGEX.test(part) ? <a href={part}>{part} </a> : part + " "
			);

	const redirect = () => {
			history.push(`/clickedPost/${post._id}`); 
	};
		

	return (
		<div className="post" role="main" aria-label={"This is a post created by " + user.username}>
			<div className="postWrapper">
				<div className="postTop">
					<div className="postTopLeft" aria-label = {"from left to right: user profile picture, username, when it was posted"}>
						<Link to={`/profile/${user.username}`}>
							<img
								className="postProfileImg"
								src={
									user.profilePicture
										? PF + "person/"+ user.profilePicture
										: PF + "person/noAvatar.png"
										//:  PF + "person/riya.png"
								}
								alt= {user.username + "'s profile picture"}
							/>
						</Link>
						<span className="postUsername">{user.username}</span>
						<span className="postDate">{format(post.createdAt)}</span>
					</div>
					<div className="postTopRight">
						<MoreVert />
					</div>
				</div>
				<div className="postCenter" onClick={redirect} aria-label={"this is an image shared by user: " + user.username}>
					<span className="postText">{renderText(post.desc)}</span>
					<img className="postImg" src={PF + post.img} alt="" />
				</div>

				{/*}
				<div>
					<span className="postTopic">{"#" + (post.topic)}</span>
				</div>
				*/}

				<div className="postBottom">
					<div className="postBottomLeft" aria-label="">
						{topicName && (
							<div>
								<span className="postTopic">{"#" + topicName}</span>
							</div>
						)}


						<img
							className="likeIcon"
							src={`${PF}savePost.png`}
							onClick={savePostHandler}
							alt="save post button which saves/unsaves post"
						/>

						<span className="postSave">{isSaved ? "saved ":""}</span>
						
						<img
							className="likeIcon"
							src={`${PF}like.png`}
							onClick={likeHandler}
							alt="like button which increases/decreases post like count"
						/>

						<span className="postLikeCounter">{like} likes</span>
					</div>

					<div className="postBottomRight">
						<span className="postCommentText" onClick={showCommentsToggle}>
							{post.comment} comments
						</span>
					</div>
				</div>
				{showComments ? (
					<div className="postBottomComments">
						{/* <div className="commentCell"></div> */}
						<div style={{ marginTop: "1rem" }}></div>
						<Box sx={{ width: "100%" }}>
							<Stack spacing={2}>
								{commentObjs.map(c => (
									<Item>
										<small className="commentUsername">{c.username}</small>
										<p className="commentText">{c.text}</p>
									</Item>
								))}
							</Stack>
						</Box>
						<div style={{ marginTop: "1rem" }}></div>
						<div className="commentFieldBox">
							<TextField
								id="standard-basic"
								label="Enter your comment here..."
								value={newComment}
								onChange={e => {
									setNewComment(e.target.value);
								}}
								variant="standard"
								sx={{ width: "85%" }}
							/>
							<Button
								variant="contained"
								onClick={commentPostHandler}
								style={{ margin: "1.5vh 1vw" }}
							>
								Submit
							</Button>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
