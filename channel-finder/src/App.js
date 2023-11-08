  import React, {useState, useEffect} from "react";
  import SportNavigationBar from "./components/SportNavigationBar.js";
  import TeamNavigationBar from './components/TeamNavigationBar.js';
  import {NbaTeamList, NflTeamList, NhlTeamList, MlbTeamList} from "./Data/TeamData.js";
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
      setSelectedTeam(null);
      setSelectedTimeZone(userTimeZoneOffset);
      setSelectedTeam(teamAbbreviation);
      // team abbreviation is passed to back end >>>>>>>need to add sport for common abbreviations across sports<<<<<<<<<<<<<<<,
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
        //console.log("Team Data:", res.data);
        console.log("selected team games that havent occured:", upcomingGames)
      })
      .catch((err) => {
        console.error("ERROR FETCHING TEAM DATA:", err);
      });
    };
    // get the users time zone offset once the component is mounted.
    useEffect(() => {
      setUserTimeZoneOffset(new Date().getTimezoneOffset() * -1);
    }, []);

    // function to convert UTC from the users local time.
    
    const convertToLocalTimeString = (utcTime, selectedTimeZone) => {
      const utcDate = new Date(utcTime);
      let timeZone;

      if (selectedTimeZone == null) {
        timeZone = userTimeZoneOffset;
      } else {
        timeZone = selectedTimeZone;
      }

      //if (TimeZoneSwitch)
      const localDate = new Date(utcDate.getTime() + timeZone * 60000);
      

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
    // uses the game time converts the time to the local users time and converts the games date is different due to time change 
    const convertToLocalDateString = (utcTime, selectedTimeZone) => {
      const utcDate = new Date(utcTime);
      let timeZone;

      if (selectedTimeZone == null) {
        timeZone = userTimeZoneOffset;
      } else {
        timeZone = selectedTimeZone;
      }
      //if (TimeZoneSwitch)
      const localDate = new Date(utcDate.getTime() + timeZone * 60000);


      const localDateStr = localDate.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Set the user's timezone
      });

      return `${localDateStr}`;
    };
    /*
    const handleTimeZoneChange = (selectedTime) => {
      // Handle the selected time here
      console.log("Selected Time:", selectedTime);

    
      if (selectedSport && selectedTeam) {
        console.log(selectedTeam + selectedSport)
        axios.get(`http://localhost:8000/${selectedSport}/schedule/${selectedTeam}/`)
          .then((res) => {
            setTeamData(res.data);

            const timeZoneParts = selectedTime.selectedTimeZone.split(":");
            const timeZoneOffset = parseInt(timeZoneParts[0]) * 60 + parseInt(timeZoneParts[1]);
            console.log("time Zone Offset " + timeZoneOffset);  
        
            
            const upcomingGames = res.data.filter((game) => {
            
              const originalTime = game.time;

              const iso8601Time = originalTime.replace(" ", "T") + "Z";
  
              const gameDate = new Date(iso8601Time);
              const gameDateLocal = new Date(gameDate.getTime() + timeZoneOffset * 60000);
              console.log("game Date Local: " + gameDateLocal);

              const bufferTime = 4 * 60 * 60 * 1000;

              const selectedDateTime = new Date(selectedTime.date);
              console.log("selected Date Time: " + selectedDateTime);
              const timeParts = selectedTime.time.split(":");
              console.log("selected time parts : " + timeParts);
              selectedDateTime.setHours(parseInt(timeParts[0]));
              selectedDateTime.setMinutes(parseInt(timeParts[1]));


               // Apply the time zone offset
              const selectedTimeInLocal = new Date(selectedDateTime.getTime() + timeZoneOffset * 60000);


              console.log("selected Time in Local :" + selectedTimeInLocal);
              setSelectedTime(selectedTimeInLocal);

    
              
              return gameDateLocal >= selectedTimeInLocal - bufferTime;
            });

            // Update selectedTeamSchedule with the filtered upcoming games
            setSelectedTeamSchedule(upcomingGames);
          })
          .catch((err) => {
            console.error("ERROR FETCHING TEAM DATA:", err);
          });
      }
    };
  */

    const handleTimeZoneChange = (selectedTime) => {
      if (selectedTime == null){
        handleTeamSelect(selectedTeam);
      } else {
      if (selectedSport && selectedTeam) {
        axios.get(`http://localhost:8000/${selectedSport}/schedule/${selectedTeam}/`)
          .then((res) => {
            setTeamData(res.data);
    
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
    
    selectedTeamSchedule.sort((a, b) => new Date(a.time) - new Date(b.time));
    return (
      <div className='app-container'>
        <h1 id='header' className='choose-team-header'>Choose a Sport and a team.</h1>
        <h3 className="instructions">The data used to determine the channel does not account for blackouts, and local networks.</h3>
        <TeamNavigationBar teams={getTeamList(selectedSport)} onTeamClick={handleTeamSelect} />
        <SportNavigationBar selectedSport={selectedSport} onSportSelect = {handleSportSelect} />
        <TimeZoneSwitch onTimeZoneChange={handleTimeZoneChange} timeZoneSwitchOn={timeGodMode} />
        {/* Display team data based on the selectedTeam and teamData */}

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
                  <span>{convertToLocalDateString(selectedTeamSchedule[0].time, selectedTimeZone)}</span>
                </div>
                <div className="next-game-cell next-game-opponent">
                  <span>{selectedTeamSchedule[0].opponent}</span>
                </div>
                <div className="next-game-cell next-game-time">
                  <span>{convertToLocalTimeString(selectedTeamSchedule[0].time, selectedTimeZone)}</span>
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
                          <span>{convertToLocalDateString(game.time, selectedTimeZone)}</span>
                        </td>
                        <td className="opponent">
                          <span>{game.opponent}</span>
                        </td>
                        <td className="time">
                          <span>{convertToLocalTimeString(game.time, selectedTimeZone)}</span>
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
