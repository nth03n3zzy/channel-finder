import React from "react";
import MonthNavigationBar from "./components/MonthNavigationBar.js";
import TeamNavigationBar from '/Users/daddy/Desktop/web_scraper_NBA/channel-finder/src/components/TeamNavigationBar.js';
import NbaTeamList from "/Users/daddy/Desktop/web_scraper_NBA/channel-finder/src/Data/TeamData.js";
import './App.css'; // Import your CSS file here

const App = () => {
  return (
    <div className='app-container'>
      <h1 id='header' className='choose-team-header'>Choose a team</h1>
      <TeamNavigationBar teams={NbaTeamList} />
      <MonthNavigationBar /> 
    </div>
  );
};

export default App;
