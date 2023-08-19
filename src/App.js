import React from "react";
import MonthNavigationBar from "./components/MonthNavigationBar";
import TeamNavigationBar from './components/TeamNavigationBar';
import NbaTeamList from "./teamData";
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
