import React from 'react';
import './SportNavigationBar.css';

const SportNavigationBar = () => {
    return (
        <div className='sport-navigation-bar'>
            <span className='sport-link'><a href='#NBA' aria-label='sport selection for NBA'></a>NBA</span>
            <span className='sport-link'><a href='#NFL' aria-label='sport selection for NFL'></a>NFL</span>
            <span className='sport-link'><a href='#MLB' aria-label='sport selection for MLB'></a>MLB</span>
            <span className='sport-link'><a href='#NHL' aria-label='sport selection for NHL'></a>NHL</span>
        </div>
    );
};

export default SportNavigationBar;
