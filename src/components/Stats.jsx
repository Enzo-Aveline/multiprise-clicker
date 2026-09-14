import React from 'react'

const Stats = ({ watts, wattsPerSecond, bonusActive, bonusTimeLeft }) => {
  return (
    <div className="stats-container">
      <div className="watts-total">
        {Math.floor(watts).toLocaleString()} Watts
      </div>
      <div className="watts-sec">
        {wattsPerSecond.toLocaleString()} W/s
      </div>
      {bonusActive && (
        <div className="bonus-active">
          ⚡ Golden Éclair: x5 ({bonusTimeLeft}s) ⚡
        </div>
      )}
    </div>
  )
}

export default Stats
