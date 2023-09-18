import React, {useState} from "react";
import MonthNavigationBar from "./components/MonthNavigationBar.js";
import TeamNavigationBar from '/Users/daddy/Desktop/web_scraper_NBA/channel-finder/src/components/TeamNavigationBar.js';
import NbaTeamList from "/Users/daddy/Desktop/web_scraper_NBA/channel-finder/src/Data/TeamData.js";
import './App.css'; // Import your CSS file here
import axios from "axios";


const App = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamData, setTeamData] = useState(null);

  const handleTeamSelect = (teamAbbreviation) => {
    setSelectedTeam(teamAbbreviation);

    axios.get('http://localhost:8000/nba/schedule/${teamAbbreviation}/')
    .then((res) => {
      setTeamData(res.data);
      console.log("Team Data:", res.data);
    })
    .catch((err) => {
      console.error("ERROR FETCHING TEAM DATA:", err);
    });
  };

  return (
    <div className='app-container'>
      <h1 id='header' className='choose-team-header'>Choose a team</h1>
      <TeamNavigationBar teams={NbaTeamList} onTeamClick={handleTeamSelect} />
      <MonthNavigationBar />
      {/* Display team data based on the selectedTeam and teamData */}
      {selectedTeam && teamData && (
        <div className="team-data">
          <h2>{selectedTeam} Schedule</h2>
          {/* Render the team's schedule here */}
          {/* Example: teamData.map(game => (<div key={game.id}>{game.date} - {game.opponent}</div>)) */}
        </div>
      )}
    </div>
  );
};

export default App;
