import React from 'react';
import './MonthNavigationBar.css';

const MonthNavigationBar = () => {
    return (
        <div className='month-navigation-bar'>
            <span className='month-link'><a href='#Jan' aria-label='Month selection for January'></a>Jan</span>
            <span className='month-link'><a href='#Feb' aria-label='Month selection for January'></a>Feb</span>
            <span className='month-link'><a href='#Mar' aria-label='Month selection for January'></a>Mar</span>
            <span className='month-link'><a href='#Apr' aria-label='Month selection for January'></a>Apr</span>
            <span className='month-link'><a href='#May' aria-label='Month selection for January'></a>May</span>
            <span className='month-link'><a href='#Jun' aria-label='Month selection for January'></a>Jun</span>
            <span className='month-link'><a href='#Jul' aria-label='Month selection for January'></a>Jul</span>
            <span className='month-link'><a href='#Aug' aria-label='Month selection for January'></a>Aug</span>
            <span className='month-link'><a href='#Sep' aria-label='Month selection for January'></a>Sep</span>
            <span className='month-link'><a href='#Oct' aria-label='Month selection for January'></a>Oct</span>
            <span className='month-link'><a href='#Oct' aria-label='Month selection for January'></a>Nov</span>
            <span className='month-link'><a href='#Dec' aria-label='Month selection for January'></a>Dec</span>
        </div>
    );
};

export default MonthNavigationBar;

