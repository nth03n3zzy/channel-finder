  import React, {useState, useEffect} from "react";
  import SportNavigationBar from "./components/SportNavigationBar.js";
  import TeamNavigationBar from './components/TeamNavigationBar.js';
  import {NbaTeamList, NflTeamList, NhlTeamList, MlbTeamList} from "./Data/TeamData.js";
  import { convertToLocalDateString, convertToLocalTimeString} from "./Data/DateUtils.js";
  import './App.css'; 
  import axios from "axios";  
  import TimeZoneSwitch from "./components/TimeZoneSwitch.js";



  const App = () => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamData, setTeamData] = useState(null);
    const [userTimeZoneOffset, setUserTimeZoneOffset] = useState(0); // initialize with 0
    const [selectedTeamSchedule, setSelectedTeamSchedule] = useState ([]); // array to hold schedule to help filtering out expired games
    const [selectedSport, setSelectedSport] = useState("NBA") // team navigation bar initialize with NBA
    const [timeGodMode, setTimeGodMode] = useState(false); // Define selectedTime
    const [selectedTimeZone, setSelectedTimeZone] = useState(null);
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
      
      setSelectedTimeZone(userTimeZoneOffset);
      setSelectedTeam(teamAbbreviation);
      // team abbreviation is passed to back end to retrieve data for that team
      axios.get(`http://localhost:8000/${selectedSport}/schedule/${teamAbbreviation}/`)
      .then((res) => {
        setTeamData(res.data);
        // logic to determin what games are upcoming and what games have already occured with a four hour buffer
        const  currentDate = new Date();
        
        const upcomingGames = res.data.filter((game) => {

          const originalTime = game.time;

          const iso8601Time = originalTime.replace(" ", "T") + "Z";
  
          const gameDate = new Date(iso8601Time);
        
          //const gameDateLocal = new Date(gameDate.getTime() + userTimeZoneOffset * 60000);
          const bufferTime = 4 * 60 * 60 * 1000;

          return gameDate >= currentDate - bufferTime;
        });
        setSelectedTeamSchedule(upcomingGames); // set the selected teams schedule 
      })
      .catch((err) => {
        console.error("ERROR FETCHING TEAM DATA:", err);
      });
    };
    // get the users time zone offset once the component is mounted.
    useEffect(() => {
      setUserTimeZoneOffset(new Date().getTimezoneOffset() * -1);
    }, []);

    const handleSportSelect = (sport) => {
      setSelectedSport(sport);
      setSelectedTeam(null); // Clear the selected team when switching sports
    };

    /* function to reload the schedule when the apply button is clicked when using time god mode */
    const handleTimeZoneChange = (selectedTime) => {
      // we are checking if a time is selected in time god mode. if not we just run the regular team select which uses the 
      // users time.
      if (selectedTime == null){
        handleTeamSelect(selectedTeam);
      } else {
      // we check to ensure there is a selected sport and team to fetch a schedule for.
      if (selectedSport && selectedTeam) {
        // we use axios to call on the back end and get the schedule. return the data and set Team Data with the data retrieved.
        axios.get(`http://localhost:8000/${selectedSport}/schedule/${selectedTeam}/`)
          .then((res) => {
            setTeamData(res.data);
            
            //splitting up the selected time to get the timezone
            const timeZoneParts = selectedTime.selectedTimeZone.split(":");
            const timeZoneOffset = (parseInt(timeZoneParts[0]) * 60 + parseInt(timeZoneParts[1]));

            setSelectedTimeZone(timeZoneOffset);
    
            const upcomingGames = res.data.filter((game) => {
              const originalTime = game.time;
    
              // Parse the original time as a UTC date
              const gameDate = new Date(originalTime + "Z");
    
              // Parse the selected date and time as a UTC date
              const selectedDateTime = new Date(
                Date.UTC(
                  selectedTime.date.substring(0, 4), // Year
                  selectedTime.date.substring(5, 7) - 1, // Month (0-indexed)
                  selectedTime.date.substring(8, 10), // Day
                  selectedTime.time.substring(0, 2), // Hours
                  selectedTime.time.substring(3, 5) // Minutes
                )
              );
    
              // Apply the time zone offset to selectedDateTime
              selectedDateTime.setTime(selectedDateTime.getTime() - timeZoneOffset * 60000);
    
              const bufferTime = 4 * 60 * 60 * 1000;
    
              return gameDate >= selectedDateTime - bufferTime;
            });
    
            // Update selectedTeamSchedule with the filtered upcoming games
            setSelectedTeamSchedule(upcomingGames);
          })
          .catch((err) => {
            console.error("ERROR FETCHING TEAM DATA:", err);
          });
      }
    }
    }; 

    /* due to NFL and NHL game schedules being scraped after the season started those games were put in the database not 
      necessarily in order by date. so we sorth the schedule by date to ensure games are displayed to the user in order */
    selectedTeamSchedule.sort((a, b) => new Date(a.time) - new Date(b.time));
    return (
      <div className='app-container'>
        <h1 id='header' className='choose-team-header'>Choose a Sport and a team.</h1>
        <h3 className="instructions">The data used to determine the channel does not account for blackouts, and local networks.</h3>
        <TeamNavigationBar teams={getTeamList(selectedSport)} onTeamClick={handleTeamSelect} />
        <SportNavigationBar selectedSport={selectedSport} onSportSelect = {handleSportSelect} />
        <TimeZoneSwitch onTimeZoneChange={handleTimeZoneChange} timeZoneSwitchOn={timeGodMode} />
        
        {/* block to show the next/current game.*/}
        {selectedTeam && teamData && (
          <div className="team-data">
            <h2 className="next-game-header">
              {` ${getTeamList(selectedSport).find(team => team.abbreviation === selectedTeam)?.name} next Game`}
            </h2>
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
                  <span>{convertToLocalDateString(selectedTeamSchedule[0].time, selectedTimeZone, userTimeZoneOffset)}</span>
                </div>
                <div className="next-game-cell next-game-opponent">
                  <span>{selectedTeamSchedule[0].opponent}</span>
                </div>
                <div className="next-game-cell next-game-time">
                  <span>{convertToLocalTimeString(selectedTeamSchedule[0].time, selectedTimeZone, userTimeZoneOffset)}</span>
                </div>
                <div className="next-game-cell next-game-channel">
                  <span>{selectedTeamSchedule[0].channel.replace(/[\[\]']+/g, '')}</span>
                </div>
              </div>
              }
            </section>
          </div>
        )}
        {/* rest of team schedule displayed below */}
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

                  {/* Render the upcoming games in the table below */}
                  {selectedTeamSchedule
                    .slice(1) // Exclude the first game (Next Game)
                    .map((game, index) => (
                      <tr key={index} className="game-data">
                        <td className="date">
                          <span>{convertToLocalDateString(game.time, selectedTimeZone, userTimeZoneOffset)}</span>
                        </td>
                        <td className="opponent">
                          <span>{game.opponent}</span>
                        </td>
                        <td className="time">
                          <span>{convertToLocalTimeString(game.time, selectedTimeZone, userTimeZoneOffset)}</span>
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
