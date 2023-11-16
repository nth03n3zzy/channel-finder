
export function convertToLocalTimeString (utcTime, selectedTimeZone, userTimeZoneOffset) {
    const utcDate = new Date(utcTime);
    let timeZone;

    if (selectedTimeZone == null) {
      timeZone = userTimeZoneOffset;
    } else {
      timeZone = selectedTimeZone;
    }

    //if (TimeZoneSwitch)
    const localDate = new Date(utcDate.getTime() + timeZone * 60000);
    

    const localTimeStr = localDate.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Set the user's timezone
    });

    return `${localTimeStr}`;
  };

  export function  // uses the game time converts the time to the local users time and converts the games date is different due to time change 
   convertToLocalDateString (utcTime, selectedTimeZone, userTimeZoneOffset) {
    const utcDate = new Date(utcTime);
    let timeZone;

    if (selectedTimeZone == null) {
      timeZone = userTimeZoneOffset;
    } else {
      timeZone = selectedTimeZone;
    }
    //if (TimeZoneSwitch)
    const localDate = new Date(utcDate.getTime() + timeZone * 60000);


    const localDateStr = localDate.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Set the user's timezone
    });

    return `${localDateStr}`;
  };

