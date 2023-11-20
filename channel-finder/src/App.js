  import React, {useState, useEffect} from "react";
  import SportNavigationBar from "./components/SportNavigationBar.js";
  import TeamNavigationBar from './components/TeamNavigationBar.js';
  import './App.css'; 
  import axios from "axios";  
  import TimeZoneSwitch from "./components/TimeZoneSwitch.js";
  import {NextGameDisplay, ScheduleGameDisplay, getTeamList} from "./components/GameDisplay.js"

// initialize variables used throughout app.js

  const App = () => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamData, setTeamData] = useState(null);
    const [userTimeZoneOffset, setUserTimeZoneOffset] = useState(0); // initialize with 0
    const [selectedTeamSchedule, setSelectedTeamSchedule] = useState ([]); // array to hold schedule to help filtering out expired games
    const [selectedSport, setSelectedSport] = useState("NBA") // team navigation bar initialize with NBA
    const [timeGodMode] = useState(false); // Define selectedTime
    const [selectedTimeZone, setSelectedTimeZone] = useState(null);
    
    
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
      necessarily in order by date. so we sort the schedule by date to ensure games are displayed to the user in order */
    selectedTeamSchedule.sort((a, b) => new Date(a.time) - new Date(b.time));
    return (
      <div className='app-container'>
        <h1 id='header' className='choose-team-header'>Choose a Sport and a team.</h1>
        <h3 className="instructions">The data used to determine the channel does not account for blackouts, and local networks.</h3>
        <TeamNavigationBar teams={getTeamList(selectedSport)} onTeamClick={handleTeamSelect} />
        <SportNavigationBar selectedSport={selectedSport} onSportSelect = {handleSportSelect} />
        <TimeZoneSwitch onTimeZoneChange={handleTimeZoneChange} timeZoneSwitchOn={timeGodMode} />
        <NextGameDisplay selectedTeam={selectedTeam} teamData={teamData} selectedTeamSchedule={selectedTeamSchedule}
             selectedSport={selectedSport} selectedTimeZone={selectedTimeZone} />
        <ScheduleGameDisplay selectedTeam={selectedTeam} teamData={teamData} selectedTeamSchedule={selectedTeamSchedule}
          selectedSport={selectedSport} selectedTimeZone={selectedTimeZone} />
      </div>
    );
  };
  export default App;
