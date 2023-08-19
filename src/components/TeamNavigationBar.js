import React from 'react';
import './TeamNavigationBar.css';

const TeamNavigationBar = ({ teams }) => {
  return (
    <div className="team-navigation-bar">
      {teams.map((team, index) => (
        <div
          key={index}
          className={`team-navigation-item team-${team.abbreviation.toLowerCase()}`}
        >
          <span className="team-abbreviation">{team.abbreviation}</span>
          <span className="team-name">{team.name}</span>
        </div>
      ))}
    </div>
  );
};

export default TeamNavigationBar;
