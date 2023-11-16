  import React from "react";
  import getTeamList from "./App.js"
  import { convertToLocalDateString, convertToLocalTimeString } from "./Data/DateUtils.js";

  function GameDisplay ({selectedTeam, teamData, selectedTeamSchedule, selectedSport, selectedTimeZone}){
  {/* block to show the next/current game.*/}
  {selectedTeam && teamData && (
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
        {selectedTeamSchedule.length > 0 &&
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
        }
      </section>
    </div>
  )}}