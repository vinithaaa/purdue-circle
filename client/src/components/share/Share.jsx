import "./share.css";
import { PermMedia, Label, Cancel} from "@mui/icons-material";
//import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!checked);
    };

    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const topic = useRef();
    const desc = useRef();

    const [file, setFile] = useState(null);

    const submitHandler = async e => {
        e.preventDefault();
        console.log("User id = " + user._id);
        let finalUserID = user._id;
        if (checked) {
            finalUserID = "625667cd7a5eaf94ffe854ad";
        }
        
        const topicUser = { // create a topic "user"
            //TODO check to see if this is everything user needs
            username: topic.current.value,
            email: topic.current.value,
            password: "darshanaisawesome!",
        };

        try { // add the topic to the database
        await axios.post("/auth/register", topicUser);
        } catch (err) {
                console.log(err);
        }


        const newPost = { 
            userId: finalUserID,
            desc: desc.current.value,
            topic: topic.current.value
        };


        if (file) {
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            newPost.img = fileName;
            console.log(newPost);
            try {
                await axios.post("/upload", data);
            } catch (err) {}
        }
        try {
            await axios.post("/posts", newPost);
            window.location.reload();
        } catch (err) {}


    };

    return (
        <div className="share" role="main" aria-label="this is the share box, which is used by users to create posts that have text, image, and/or a topic tag">
            <div className="shareWrapper">
                <div className="shareTop" aria-label="">
                    <img
                        className="shareProfileImg"
                        src={
                            user.profilePicture
                                ? PF + "person/"+ user.profilePicture
                                : PF + "person/noAvatar.png"
                                //:  PF + "person/riya.png"
                        }
                        alt= {user.username + "'s profile picture"}
                    />
                    <textarea
                        placeholder={"What's on your mind " + user.username + "?"}
                        className="shareInput"
                        ref={desc}
                    />
                </div>
                <hr className="shareHr" />
                {file && (
                    <div className="shareImgContainer">
                        <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
                        <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
                    </div>
                )}
                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions" aria-label="">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon" alt="image of a photo, when clicked it allows user to add an image to their post" />
                            <span className="shareOptionText">Photo</span>
                            <input
                                style={{ display: "none" }}
                                type="file"
                                id="file"
                                accept=".png,.jpeg,.jpg"
                                onChange={e => setFile(e.target.files[0])}
                            />
                        </label>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon" />
                            {/*<span className="shareOptionText">Topic</span>*/}
                            <input
                                placeholder={"Topic"}
                                className="shareInput"
                                ref={topic}
                                
                            />
                        </div>
                        {/*
                        <div className="shareOption">
                            <BookmarkAdd htmlColor="DarkGray" className="shareIcon" />
                            <span className="shareOptionText">Save Post</span>
                        </div>*/}
                        <div className="shareOption" aria-label="">
                            {/* <Label htmlColor="green" className="shareIcon" /> */}
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={handleChange}
                                alt="clicked it allows user to post anonymously"
                            />
                            &nbsp;
                            <span className="shareOptionText">Post as Anonymous</span>
                        </div>
                    </div>
                    <button className="shareButton" type="submit" alt="Press the button labeled Share to submit your post so that it shows up on the feed" >
                        Share
                    </button>
                </form>
            </div>
        </div>
    );
}