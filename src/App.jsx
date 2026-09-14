import React, { useState } from 'react'
import { useGameState } from './hooks/useGameState'
import { useSupabaseAuth } from './hooks/useSupabaseAuth'
import { useGoldenEclair } from './hooks/useGoldenEclair'
import Stats from './components/Stats'
import Multiprise from './components/Multiprise'
import Boutique from './components/Boutique'
import AuthScreen from './components/AuthScreen'
import Leaderboard from './components/Leaderboard'
import GoldenEclair from './components/GoldenEclair'
import './styles/App.css'

function App() {
  const { session, loading } = useSupabaseAuth()
  const [currentTab, setCurrentTab] = useState('game') // 'game', 'leaderboard', 'auth'
  
  const [bonusMultiplier, setBonusMultiplier] = useState(1)
  
  const { isEclairVisible, eclairPosition, bonusTimeLeft, isBonusActive, handleEclairClick } = useGoldenEclair(() => {
    setBonusMultiplier(5)
    setTimeout(() => {
      setBonusMultiplier(1)
    }, 30000)
  })

  const { 
    watts, totalWattsGenerated, wattsPerSecond, buildings, 
    handleClick, buyBuilding, isLoaded 
  } = useGameState(session, bonusMultiplier)

  if (!isLoaded || loading) {
    return <div className="loading-screen">Chargement de la matrice énergétique...</div>
  }

  return (
    <div className="app-container">
      
      <div className="nav-tabs">
        <button className={`nav-btn ${currentTab === 'game' ? 'active' : ''}`} onClick={() => setCurrentTab('game')}>🔌 Jeu</button>
        <button className={`nav-btn ${currentTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setCurrentTab('leaderboard')}>🏆 Top 50</button>
        <button className={`nav-btn ${currentTab === 'auth' ? 'active' : ''}`} onClick={() => setCurrentTab('auth')}>👤 Compte</button>
      </div>

      <div className="tab-content">
        {currentTab === 'game' && (
          <div className="game-layout">
            <div className="game-column-left">
              <Stats watts={watts} wattsPerSecond={wattsPerSecond} bonusActive={isBonusActive} bonusTimeLeft={bonusTimeLeft} />
            </div>
            
            <div className="game-column-center">
              <GoldenEclair isVisible={isEclairVisible} position={eclairPosition} onClick={handleEclairClick} />
              <Multiprise onClick={handleClick} />
            </div>
            
            <div className="game-column-right">
              <Boutique watts={watts} buildings={buildings} onBuy={buyBuilding} />
            </div>
          </div>
        )}

        {currentTab === 'leaderboard' && <Leaderboard />}
        
        {currentTab === 'auth' && <AuthScreen session={session} />}
      </div>
    </div>
  )
}

export default App
