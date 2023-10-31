import React, { useState, useEffect } from "react";
import App from "../App";
import './TimeZoneSwitch.css'

const TimeZoneSwitch = ({ onTimeZoneChange, timezoneSwitchOn }) => {
  const [showTimeZoneMenu, setShowTimeZoneMenu] = useState(timezoneSwitchOn);
  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [useTimeGod, setUseTimeGod] = useState(false); // Initialize the "Time God" switch to off
  const [timeGodData, setTimeGodData] = useState({
    date: "", // Initialize with the user's date
    time: "", // Initialize with the user's time
    ampm: "", // Default to AM
    selectedTimeZone: ""
  });

  const timeZonesWithOffsets = [
    { name: "PST", offset: "-08:00" }, // Pacific Standard Time
    { name: "PDT", offset: "-07:00" }, // Pacific Daylight Time
    { name: "MST", offset: "-07:00" }, // Mountain Standard Time
    { name: "MDT", offset: "-06:00" }, // Mountain Daylight Time
    { name: "CST", offset: "-06:00" }, // Central Standard Time
    { name: "CDT", offset: "-05:00" }, // Central Daylight Time
    { name: "EST", offset: "-05:00" }, // Eastern Standard Time
    { name: "EDT", offset: "-04:00" }, // Eastern Daylight Time
    { name: "GMT", offset: "+00:00" }, // Greenwich Mean Time
    { name: "UTC", offset: "+00:00" }, // Coordinated Universal Time
    { name: "CET", offset: "+01:00" }, // Central European Time
    { name: "EET", offset: "+02:00" }, // Eastern European Time
    // Add more time zones here with their respective offsets
  ];
  

  const usersTimeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Use useEffect to update the showTimeZoneMenu state when the timezoneSwitchOn prop changes
  useEffect(() => {

      // Initialize timeGodData with the user's time, AM/PM, and location
      const userDate = new Date(); // Get the current date
      const hours = userDate.getHours();
      const minutes = userDate.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM"; // Determine AM or PM based on the current time
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Format minutes
      const time = `${hours}:${formattedMinutes}`;
      
      setSelectedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone); // Get the user's time zone
      //console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
      setTimeGodData({ ...timeGodData, time, ampm, date: userDate.toISOString().split('T')[0], selectedTimeZone });
    }, []); // The empty dependency array ensures this effect runs only once


    const handleTimeZoneSwitch = () => {
      setShowTimeZoneMenu(!showTimeZoneMenu);
      // Toggle the value of useTimeGod
      setUseTimeGod((prevUseTimeGod) => !prevUseTimeGod);
    };
  const handleTimeZoneChange = (event) => {
    const selectedTimezoneName = event.target.value;
    const selectedTimezone = timeZonesWithOffsets.find((tz) => tz.name === selectedTimezoneName);
  
    if (selectedTimezone) {
      const { offset } = selectedTimezone;
      setSelectedTimeZone(selectedTimezoneName); // Set the selected timezone name
      // Update the offset in timeGodData
      setTimeGodData((prevData) => ({
        ...prevData,
        selectedTimeZone: offset,
      }));

    }
  };

  const handleDateChange = (event) => {
    setTimeGodData({ ...timeGodData, date: event.target.value });
  };

  const handleTimeChange = (event) => {
    setTimeGodData({ ...timeGodData, time: event.target.value });
  };

  const handleApplyClick = () => {
    const selectedTime = useTimeGod ? timeGodData : null; 
    onTimeZoneChange(selectedTime);

  };

  return (
    <div className="time-zone-switch">
      <label>
        Use "Time God" Settings:
        <input type="checkbox" checked={useTimeGod} onChange={handleTimeZoneSwitch} />
      </label>
      {showTimeZoneMenu && (
        <div className="time-zone-menu">
          <select value={selectedTimeZone} onChange={handleTimeZoneChange}>
            <option value="timezone1">{usersTimeZone}</option>
            {timeZonesWithOffsets.map((timeZone, index) => (
                 <option key={index} value={timeZone.name}>
                    {timeZone.name}
                </option>
            ))}
            
          </select>
          {/* "Time God" input fields */}
          {useTimeGod && (
            <div className="time-god-fields">
              <input class="date-field"
                type="date"
                value={timeGodData.date}
                onChange={handleDateChange}
              />
              <input class = "time-field"
                type="time"
                value={timeGodData.time}
                onChange={handleTimeChange}
              />
            </div>
          )}
          <button onClick={handleApplyClick}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeZoneSwitch;
