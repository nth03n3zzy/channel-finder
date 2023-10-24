import React, { useEffect } from 'react';
import './TeamNavigationbar.css';

const TeamNavigationBar = ({ teams, onTeamClick }) => {
  useEffect(() => {
    // You can perform any side effects related to teams here
    // For example, you can update the state or perform other actions.
  }, [teams]);
  //helper function to deal with class names having to be team names due to commanalities of abbrevitaions across sports
  // so we use the team name rather than the abbreviation and replace the spaces with '-' because spaces are not valid in 
  // class names.
  const getValidClassName = (name) => {
    return name.replace(/ /g, '-').replace(/\./g, '');
  };

  const handleTeamClick = (teamAbbreviation) => {
    if (onTeamClick) {
      onTeamClick(teamAbbreviation);
    }
  };

  return (
    <div className="team-navigation-bar">
      {teams.map((team, index) => (
        <div
          key={index}
          className={`team-navigation-item team-${getValidClassName(team.name.toLowerCase())}`}
          onClick={() => handleTeamClick(team.abbreviation)}
        >
          <span className="team-abbreviation">{team.abbreviation}</span>
          <span className="team-name">{team.name}</span>
        </div>
      ))}
    </div>
  );
};

export default TeamNavigationBar;
