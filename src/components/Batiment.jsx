import React from 'react'
import { calculateCost } from '../utils/constants'

const Batiment = ({ config, count, currentWatts, onBuy }) => {
  const cost = calculateCost(config.baseCost, count)
  const canAfford = currentWatts >= cost

  return (
    <button 
      className={`batiment-item ${!canAfford ? 'disabled' : ''}`}
      onClick={onBuy}
      disabled={!canAfford}
    >
      <div className="batiment-info">
        <span className="batiment-name">{config.name}</span>
        <span className="batiment-cost">Coût: {cost.toLocaleString()} W</span>
        <span className="batiment-prod">+{config.baseProd} W/s</span>
      </div>
      <div className="batiment-qty">
        {count}
      </div>
    </button>
  )
}

export default Batiment
