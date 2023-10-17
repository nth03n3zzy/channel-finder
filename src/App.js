import React, {useState, useEffect} from "react";
import MonthNavigationBar from "./components/MonthNavigationBar.js";
import TeamNavigationBar from '/Users/daddy/Desktop/web_scraper_NBA/channel-finder/src/components/TeamNavigationBar.js';
import NbaTeamList from "/Users/daddy/Desktop/web_scraper_NBA/channel-finder/src/Data/TeamData.js";
import './App.css'; // Import your CSS file here
import axios from "axios";  



const App = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [userTimeZoneOffset, setUserTimeZoneOffset] = useState(0); // initialize with 0

  const handleTeamSelect = (teamAbbreviation) => {
    setSelectedTeam(teamAbbreviation);

    axios.get(`http://localhost:8000/nba/schedule/${teamAbbreviation}/`)
    .then((res) => {
      setTeamData(res.data);
      console.log("Team Data:", res.data);
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
  const convertToLocalTime = (utcTime) => {
    const utcDate = new Date(utcTime);
    const localDate = new Date(utcDate.getTime() - userTimeZoneOffset * 60000);
    return localDate.toLocaleString();

    const localDateStr = localDate.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const localTimeStr = localDate.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return `${localDateStr}, ${localTimeStr}`;
  };
  return (
    <div className='app-container'>
      <h1 id='header' className='choose-team-header'>Choose a team</h1>
      <TeamNavigationBar teams={NbaTeamList} onTeamClick={handleTeamSelect} />
      <MonthNavigationBar />
      {/* Display team data based on the selectedTeam and teamData */}
      {selectedTeam && teamData && (
        <div className="team-data">
          <h2> Schedule</h2>
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
                    {teamData.map((game, index) => (
                    <tr key = {index} className="game-data">
                      <td className="date">
                      <span>{new Date(game.date).toLocaleString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                             })}
                            </span>
                      </td>
                      <td className="opponnent">
                        <span>{game.opponent}</span>
                      </td>
                      <td className="time">
                        <span>{convertToLocalTime(game.time)}</span>
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
