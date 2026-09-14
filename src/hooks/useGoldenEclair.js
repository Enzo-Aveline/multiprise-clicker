import { useState, useEffect, useCallback } from 'react'

export const useGoldenEclair = (onActivate) => {
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [bonusTimeLeft, setBonusTimeLeft] = useState(0)

  // Boucle d'apparition aléatoire (ex: toutes les 30s à 2min)
  useEffect(() => {
    // Si un bonus est déjà en cours, on ne fait pas apparaître d'éclair
    if (bonusTimeLeft > 0 || isActive) return

    const scheduleNextEclair = () => {
      // Entre 30s et 90s
      const delay = Math.random() * 60000 + 30000
      return setTimeout(() => {
        // Position aléatoire sur l'écran
        // On évite les bords (margin de 50px)
        const maxX = window.innerWidth - 100
        const maxY = window.innerHeight - 100
        
        setPosition({
          x: Math.max(50, Math.random() * maxX),
          y: Math.max(50, Math.random() * maxY)
        })
        setIsActive(true)
        
        // Il disparait après 5 secondes si non cliqué
        setTimeout(() => {
          setIsActive(false)
        }, 5000)
        
      }, delay)
    }

    const timer = scheduleNextEclair()
    return () => clearTimeout(timer)
  }, [bonusTimeLeft, isActive])

  // Compteur du bonus (30s)
  useEffect(() => {
    if (bonusTimeLeft > 0) {
      const timer = setInterval(() => {
        setBonusTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [bonusTimeLeft])

  const handleClick = useCallback(() => {
    if (isActive) {
      setIsActive(false)
      setBonusTimeLeft(30)
      onActivate()
    }
  }, [isActive, onActivate])

  return {
    isEclairVisible: isActive,
    eclairPosition: position,
    bonusTimeLeft,
    isBonusActive: bonusTimeLeft > 0,
    handleEclairClick: handleClick
  }
}
