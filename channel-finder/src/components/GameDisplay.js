  import React from "react";
  import "./GameDisplay.css"
  import { convertToLocalDateString, convertToLocalTimeString } from "../Data/DateUtils.js";
  import {NbaTeamList, NflTeamList, NhlTeamList, MlbTeamList} from "../Data/TeamData.js";
  import userTimeZoneOffset from "../App.js"

  export function getTeamList(selectedSport) {
    switch (selectedSport) {
      case "NBA":
        return NbaTeamList;
      case "NFL":
        return NflTeamList;
      case "NHL":
        return NhlTeamList;
      case "MLB":
        return MlbTeamList;
      default:
        return [];
    }
  }

  
  function NextGameDisplay ({selectedTeam, teamData, selectedTeamSchedule, selectedSport, selectedTimeZone}){
    const isMLBSelected = selectedSport === 'MLB';
  /* block to show the next/current game.*/
  if (selectedTeam && teamData) {
    if (isMLBSelected) {
      return (
        <div className="team-data">
          <h2>No MLB schedule available at this time. Please check back later.</h2>
        </div>
      );
    } else {
      return (

      <div className="team-data">
        <h2 className="next-game-header">
          {` ${getTeamList(selectedSport).find(team => team.abbreviation === selectedTeam)?.name} next Game`}
        </h2>
        <section className="next-game-section">
          <div className="next-game-row">
            <div className="next-game-cell next-game-date-header">
              <span>Date</span>
            </div>
            <div className="next-game-cell next-game-opponent-header">
              <span>Opponent</span>
            </div>
            <div className="next-game-cell next-game-time-header">
              <span>Time</span>
            </div>
            <div className="next-game-cell next-game-channel-header">
              <span>Channel</span>
            </div>
            </div>
            {selectedTeamSchedule.length > 0 && (
            <div className="next-game-row-game-info">
              <div className="next-game-cell next-game-date">
                <span>{convertToLocalDateString(selectedTeamSchedule[0].time, selectedTimeZone)}</span>
              </div>
              <div className="next-game-cell next-game-opponent">
                <span>{selectedTeamSchedule[0].opponent}</span>
              </div>
              <div className="next-game-cell next-game-time">
                <span>{convertToLocalTimeString(selectedTeamSchedule[0].time, selectedTimeZone)}</span>
              </div>
              <div className="next-game-cell next-game-channel">
                <span>{selectedTeamSchedule[0].channel.replace(/[\[\]']+/g, '')}</span>
              </div>
            </div>
          )}
            </section>
          </div>
          );
          }}}

  function ScheduleGameDisplay ({selectedTeam, teamData, selectedTeamSchedule, selectedSport, selectedTimeZone}) {
    const isMLBSelected = selectedSport === 'MLB';
    /* block to show the next/current game.*/
    if (selectedTeam && teamData) {
      if (isMLBSelected) {
        return (
          null
        );
      } else {
          return (
            selectedTeam && teamData && (
              <div className="team-data">
                <h2>{NbaTeamList.find(team => team.abbreviation === selectedTeam)?.name} upcoming Games.</h2>
                <section className="team-schedule-section">
                  <table className="team_schedule_table">
                    <thead>
                      <tr className="table-column-names">
                        <th className="date-header">
                          <span className="date-span">DATE</span>
                        </th>
                        <th className="opponent-header">
                          <span>OPPONENT</span>
                        </th>
                        <th className="time-header">
                          <span>TIME</span>
                        </th>
                        <th className="channel-header">
                          <span>CHANNEL</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="team-schedule-table-body">
    
                      {selectedTeamSchedule
                        .slice(1) // Exclude the first game (Next Game)
                        .map((game, index) => (
                          <tr key={index} className="game-data">
                            <td className="date">
                              <span>{convertToLocalDateString(game.time, selectedTimeZone, userTimeZoneOffset)}</span>
                            </td>
                            <td className="opponent">
                              <span>{game.opponent}</span>
                            </td>
                            <td className="time">
                              <span>{convertToLocalTimeString(game.time, selectedTimeZone, userTimeZoneOffset)}</span>
                            </td>
                            <td className="channel">
                              <span>{game.channel.replace(/[\[\]']+/g, '')}</span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </section>
              </div>
                        )
          );
  }
}
  }


  export  {NextGameDisplay, ScheduleGameDisplay};