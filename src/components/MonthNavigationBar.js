import React from 'react';
import './MonthNavigationBar.css';

const MonthNavigationBar = () => {
    return (
        <div className='month-navigation-bar'>
            <span className='month-link'><a href='#Dec'></a>Jan</span>
            <span className='month-link'><a href='#Feb'></a>Feb</span>
            <span className='month-link'><a href='#Mar'></a>Mar</span>
            <span className='month-link'><a href='#Apr'></a>Apr</span>
            <span className='month-link'><a href='#May'></a>May</span>
            <span className='month-link'><a href='#Jun'></a>Jun</span>
            <span className='month-link'><a href='#Jul'></a>Jul</span>
            <span className='month-link'><a href='#Aug'></a>Aug</span>
            <span className='month-link'><a href='#Sep'></a>Sep</span>
            <span className='month-link'><a href='#Oct'></a>Oct</span>
            <span className='month-link'><a href='#Oct'></a>Nov</span>
            <span className='month-link'><a href='#Dec'></a>Dec</span>
        </div>
    );
};

export default MonthNavigationBar;

