import React from "react";
import LinkPage from "../pages/LinkPage";
import video from "../assets/background_video.mp4";
import videoWebm from "../assets/background_video.webm";
import "../css/home.css";

function Home() {
  return (
    <div className="home">
      <video muted loop autoPlay>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag. I suggest you upgrade your
        browser.
        <source src={videoWebm} type="video/webm" />
        Your browser does not support the video tag. I suggest you upgrade your
        browser.
      </video>
      <div className="overlay"></div>
      <div className="project-name">
        <h3>Repo Analytics</h3>
      </div>
      <div className="searchBar">
        <LinkPage />
      </div>
    </div>
  );
}

export default Home;
