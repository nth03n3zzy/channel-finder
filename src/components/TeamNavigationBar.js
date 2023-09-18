import React from 'react';
import '/Users/daddy/Desktop/web_scraper_NBA/channel-finder/src/components/TeamNavigationbar.css';

const TeamNavigationBar = ({ teams, onTeamClick }) => {
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
          className={`team-navigation-item team-${team.abbreviation.toLowerCase()}`}
          onClick={()=> handleTeamClick(team.abbreviation)}
        >
          <span className="team-abbreviation">{team.abbreviation}</span>
          <span className="team-name">{team.name}</span>
        </div>
      ))}
    </div>
  );
};

export default TeamNavigationBar;
