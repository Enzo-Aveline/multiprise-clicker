import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaders = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, total_watts')
        .order('total_watts', { ascending: false })
        .limit(50)
      
      if (data) setLeaders(data)
      setLoading(false)
    }
    
    fetchLeaders()
  }, [])

  if (loading) return <div className="leaderboard-loading">Chargement du classement...</div>

  return (
    <div className="leaderboard-container">
      <h2>Top 50 Ingénieurs</h2>
      <div className="leaderboard-list">
        {leaders.map((player, index) => (
          <div key={index} className="leaderboard-item">
            <span className="rank">#{index + 1}</span>
            <span className="username">{player.username || 'Anonyme'}</span>
            <span className="score">{Math.floor(player.total_watts).toLocaleString()} W</span>
          </div>
        ))}
        {leaders.length === 0 && <p className="no-data">Aucun joueur classé pour le moment (ou clé Supabase manquante).</p>}
      </div>
    </div>
  )
}

export default Leaderboard
