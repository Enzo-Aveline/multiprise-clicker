import React, { useState, useCallback } from 'react'

const Multiprise = ({ onClick }) => {
  const [sparkles, setSparkles] = useState([])

  const handleInteraction = useCallback((e) => {
    onClick()
    
    // Obtenir la position pour l'étincelle
    let x, y
    const rect = e.currentTarget.getBoundingClientRect()
    
    // Si c'est un clic ou un tap
    if (e.clientX !== undefined) {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    } else if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      // Fallback au centre
      x = rect.width / 2
      y = rect.height / 2
    }

    const newSparkle = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() * 20 - 10),
      y: y + (Math.random() * 20 - 10),
      text: '+1'
    }

    setSparkles(prev => [...prev, newSparkle])

    // Nettoyer l'étincelle après l'animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id))
    }, 800)
    
  }, [onClick])

  return (
    <div className="clicker-container">
      <button 
        className="multiprise-btn"
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <div className="prise"></div>
        <div className="prise"></div>
        <div className="prise"></div>
        <div className="prise"></div>
        
        {sparkles.map(sparkle => (
          <div 
            key={sparkle.id} 
            className="sparkle"
            style={{ left: sparkle.x, top: sparkle.y }}
          >
            {sparkle.text}
          </div>
        ))}
      </button>
    </div>
  )
}

export default Multiprise
