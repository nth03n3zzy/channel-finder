import React, {useState, useEffect} from "react";
import SportNavigationBar from "./components/SportNavigationBar.js";
import TeamNavigationBar from './components/TeamNavigationBar.js';
import {NbaTeamList, NflTeamList, NhlTeamList, MlbTeamList} from "./Data/TeamData.js";
import './App.css'; 
import axios from "axios";  



const App = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [userTimeZoneOffset, setUserTimeZoneOffset] = useState(0); // initialize with 0
  const [selectedTeamSchedule, setSelectedTeamSchedule] = useState ([]); // array to hold schedule to help filtering out expired games
  const [selectedSport, setSelectedSport] = useState("NBA") // team navigation bar initialize with NBA

  //switch case for when different sports are selected
  function getTeamList(selectedSport) {
    switch (selectedSport) {
      case "NBA":
        return NbaTeamList;
      case "NFL":
        return NflTeamList;
      case "NHL":
        return NhlTeamList;
      case "MLB":
        return MlbTeamList;
      default:
        return [];
    }
  }
   
  //when a team is selected
  const handleTeamSelect = (teamAbbreviation) => {
    setSelectedTeam(teamAbbreviation);
    // team abbreviation is passed to back end >>>>>>>need to add sport for common abbreviations across sports<<<<<<<<<<<<<<<,
    axios.get(`http://localhost:8000/nba/schedule/${teamAbbreviation}/`)
    .then((res) => {
      setTeamData(res.data);
      // logic to determin what games are upcoming and what games have already occured with a four hour buffer
      const  currentDate = new Date();
      
      const upcomingGames = res.data.filter((game) => {
        const gameDate = new Date(game.time);
        const gameDateLocal = new Date(gameDate.getTime() - userTimeZoneOffset * 60000);
        const bufferTime = 4 * 60 * 60 * 1000;

        return gameDateLocal >= currentDate - bufferTime;
      });
      setSelectedTeamSchedule(upcomingGames); // set the selected teams schedule 
      //console.log("Team Data:", res.data);
      //console.log("selected team games that havent occured:", upcomingGames)
    })
    .catch((err) => {
      console.error("ERROR FETCHING TEAM DATA:", err);
    });
  };
  // get the users time zone offset once the component is mounted.
  useEffect(() => {
    setUserTimeZoneOffset(new Date().getTimezoneOffset());
  }, []);

  // function to convert UTC from the users local time.
  
  const convertToLocalTimeString = (utcTime) => {
    const utcDate = new Date(utcTime);
    const localDate = new Date(utcDate.getTime() - userTimeZoneOffset * 60000);

    const localTimeStr = localDate.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Set the user's timezone
    });

    return `${localTimeStr}`;
  };
  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setSelectedTeam(null); // Clear the selected team when switching sports
  };
  const convertToLocalTime = (utcTime) => {
    const utcDate = new Date(utcTime);
    const localDate = new Date(utcDate.getTime() - userTimeZoneOffset * 60000);
     return localDate
  }
  // uses the game time converts the time to the local users time and converts the games date is different due to time change 
  const convertToLocalDateString = (utcTime) => {
    const utcDate = new Date(utcTime);
    const localDate = new Date(utcDate.getTime() - userTimeZoneOffset * 60000);

    const localDateStr = localDate.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Set the user's timezone
    });

    return `${localDateStr}`;
  };
  return (
    <div className='app-container'>
      <h1 id='header' className='choose-team-header'>Choose a Sport and a team.</h1>
      <h3>The data used to determine the channel does not account for blackouts, and local networks.</h3>
      <TeamNavigationBar teams={getTeamList(selectedSport)} onTeamClick={handleTeamSelect} />
      <SportNavigationBar selectedSport={selectedSport} onSportSelect = {handleSportSelect} />
      {/* Display team data based on the selectedTeam and teamData */}

      {/* Need to add seperation for filtering out past games that have already occured,
       placing the next upcoming game in a large block and then the rest of the games
        occuring within the season in a block below that block. */}
      {selectedTeam && teamData && (
        <div className="team-data">
          <h2 className="next-game-header">Next Game</h2>
          <section className="next-game-section">
            <div className="next-game-row">
              <div className="next-game-cell next-game-date-header">
                <span>Date</span>
              </div>
              <div className="next-game-cell next-game-opponent-header">
                <span>Opponent</span>
              </div>
              <div className="next-game-cell next-game-time-header">
                <span>Time</span>
              </div>
              <div className="next-game-cell next-game-channel-header">
                <span>Channel</span>
              </div>
            </div>
            {selectedTeamSchedule.length > 0 &&
            <div className="next-game-row-game-info">
              <div className="next-game-cell next-game-date">
                <span>{convertToLocalDateString(selectedTeamSchedule[0].time)}</span>
              </div>
              <div className="next-game-cell next-game-opponent">
                <span>{selectedTeamSchedule[0].opponent}</span>
              </div>
              <div className="next-game-cell next-game-time">
                <span>{convertToLocalTimeString(selectedTeamSchedule[0].time)}</span>
              </div>
              <div className="next-game-cell next-game-channel">
                <span>{selectedTeamSchedule[0].channel.replace(/[\[\]']+/g, '')}</span>
              </div>
            </div>
            }
          </section>
        </div>
      )}
      {/* Need to add placing the next upcoming game in a large block and then the rest of the games
        occuring within the season in a block below that block. */}
      {selectedTeam && teamData && (
        <div className="team-data">
         <h2 className="next-game-header">{NbaTeamList.find(team => team.abbreviation === selectedTeam)?.name} Next Game</h2>
          <section className="next-game-section">
            <div className="next-game-row">
              <div className="next-game-cell next-game-date-header">
                <span>Date</span>
              </div>
              <div className="next-game-cell next-game-opponent-header">
                <span>Opponent</span>
              </div>
              <div className="next-game-cell next-game-time-header">
                <span>Time</span>
              </div>
              <div className="next-game-cell next-game-channel-header">
                <span>Channel</span>
              </div>
            </div>
            {selectedTeamSchedule.length > 0 &&
            <div className="next-game-row-game-info">
              <div className="next-game-cell next-game-date">
                <span>{convertToLocalDateString(selectedTeamSchedule[0].time)}</span>
              </div>
              <div className="next-game-cell next-game-opponent">
                <span>{selectedTeamSchedule[0].opponent}</span>
              </div>
              <div className="next-game-cell next-game-time">
                <span>{convertToLocalTimeString(selectedTeamSchedule[0].time)}</span>
              </div>
              <div className="next-game-cell next-game-channel">
                <span>{selectedTeamSchedule[0].channel.replace(/[\[\]']+/g, '')}</span>
              </div>
            </div>
            }
          </section>
        </div>
      )}
      {/* Need to add placing the next upcoming game in a large block and then the rest of the games
        occuring within the season in a block below that block. */}
      {selectedTeam && teamData && (
        <div className="team-data">
          <h2>{NbaTeamList.find(team => team.abbreviation === selectedTeam)?.name} upcoming Games.</h2>
          <section className="team-schedule-section">
            <table className="team_schedule_table">
              <thead>
                <tr className="table-column-names">
                  <th className="date-header">
                    <span className="date-span">DATE</span>
                  </th>
                  <th className="opponent-header">
                    <span>OPPONENT</span>
                  </th>
                  <th className="time-header">
                    <span>TIME</span>
                  </th>
                  <th className="channel-header">
                    <span>CHANNEL</span>
                  </th>
                </tr>
              </thead>
              <tbody className="team-schedule-table-body">
                {/* Render the "Next Game" block  probably stik this above the headers in a seperate blovk/ table ^^^^^*/}
                {/*selectedTeamSchedule.length > 0 && (
                  <tr key="next-game" className="game-data">
                    <td className="date">
                      <span>Next Game:</span>
                    </td>
                    <td className="opponent">
                      <span>{selectedTeamSchedule[0].opponent}</span>
                    </td>
                    <td className="time">
                      <span>{convertToLocalTimeString(selectedTeamSchedule[0].time)}</span>
                    </td>
                    <td className="channel">
                      <span>{selectedTeamSchedule[0].channel.replace(/[\[\]']+/g, '')}</span>
                    </td>
                  </tr>
                )}/*

                {/* Render the upcoming games in the table below */}
                {selectedTeamSchedule
                  .slice(1) // Exclude the first game (Next Game)
                  .map((game, index) => (
                    <tr key={index} className="game-data">
                      <td className="date">
                        <span>{convertToLocalDateString(game.time)}</span>
                      </td>
                      <td className="opponent">
                        <span>{game.opponent}</span>
                      </td>
                      <td className="time">
                        <span>{convertToLocalTimeString(game.time)}</span>
                      </td>
                      <td className="channel">
                        <span>{game.channel.replace(/[\[\]']+/g, '')}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </div>
  );
};
export default App;
