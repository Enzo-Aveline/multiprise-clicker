import React from 'react'
import Batiment from './Batiment'
import { BUILDINGS_CONFIG } from '../utils/constants'

const Boutique = ({ watts, buildings, onBuy }) => {
  return (
    <div className="boutique-container">
      <div className="boutique-title">Boutique</div>
      <div className="boutique-list">
        {BUILDINGS_CONFIG.map(config => (
          <Batiment
            key={config.id}
            config={config}
            count={buildings[config.id] || 0}
            currentWatts={watts}
            onBuy={() => onBuy(config.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default Boutique
