// component to render the sport navigation bar
import React from 'react';
import './SportNavigationBar.css';

const SportNavigationBar = ({ onSportSelect }) => {
  const handleSportClick = (sport) => {
    if (onSportSelect) {
      onSportSelect(sport);
    }
  };

  return (
    <div className='sport-navigation-bar'>
      <span className='sport-link' onClick={() => handleSportClick('NBA')}>NBA</span>
      <span className='sport-link' onClick={() => handleSportClick('NFL')}>NFL</span>
      <span className='sport-link' onClick={() => handleSportClick('MLB')}>MLB</span>
      <span className='sport-link' onClick={() => handleSportClick('NHL')}>NHL</span>
      <a  href='https://github.com/nth03n3zzy/channel-finder/blob/main/channel-finder/README.md'
        className='sport-link'
        target='_blank'
        rel='noopener noreferrer'> ABOUT </a>
    </div>
  );
};

export default SportNavigationBar;
