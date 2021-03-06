import React from "react";
import "./Feed.css";
import userProfileImg from "../riya.jpeg"

// need to move to Post() 
export default function Feed() {
    return (
      <div className="share">
        <div className="shareWrapper">
          <div className="shareTop">
          <img className="shareProfileImg" src={userProfileImg} alt="" />
            <input placeholder="What's on your mind?" className="shareInput"/>
            <input placeholder="Topic" className="shareInput"/>
          </div>
            <hr className="shareHr"/>

          <div className="shareBottom">
             <button className="uploadButton">Upload Image</button>
              <button className="shareButton">Share</button>
          </div>
        </div>
      </div>
    );
  }