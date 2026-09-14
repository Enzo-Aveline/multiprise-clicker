import { useState, useEffect, useCallback, useRef } from 'react'
import { BUILDINGS_CONFIG, calculateCost } from '../utils/constants'
import { supabase } from '../utils/supabaseClient'

export const useGameState = (session, bonusMultiplier) => {
  const [watts, setWatts] = useState(0)
  const [totalWattsGenerated, setTotalWattsGenerated] = useState(0)
  const [buildings, setBuildings] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Chargement initial (Cloud ou LocalStorage)
  useEffect(() => {
    const loadData = async () => {
      if (session?.user) {
        // Load from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (data) {
          setWatts(Number(data.current_watts) || 0)
          setTotalWattsGenerated(Number(data.total_watts) || 0)
          setBuildings(data.buildings || {})
        } else {
          // Si le profil n'existe pas, on tente de fusionner le local
          loadLocalData()
        }
      } else {
        // Load from LocalStorage
        loadLocalData()
      }
      setIsLoaded(true)
    }

    const loadLocalData = () => {
      const savedWatts = localStorage.getItem('multiprise_watts')
      const savedTotal = localStorage.getItem('multiprise_total_watts')
      const savedBuildings = localStorage.getItem('multiprise_buildings')
      
      setWatts(savedWatts !== null ? parseFloat(savedWatts) : 0)
      setTotalWattsGenerated(savedTotal !== null ? parseFloat(savedTotal) : 0)
      
      if (savedBuildings !== null) {
        setBuildings(JSON.parse(savedBuildings))
      } else {
        const initialBuildings = {}
        BUILDINGS_CONFIG.forEach(b => { initialBuildings[b.id] = 0 })
        setBuildings(initialBuildings)
      }
    }

    loadData()
  }, [session])

  // Sauvegarde régulière (Local et Cloud)
  // On utilise un useRef pour ne pas déclencher d'effets en boucle
  const stateRef = useRef({ watts, totalWattsGenerated, buildings })
  useEffect(() => {
    stateRef.current = { watts, totalWattsGenerated, buildings }
  }, [watts, totalWattsGenerated, buildings])

  useEffect(() => {
    if (!isLoaded) return

    const saveTimer = setInterval(async () => {
      const { watts: currentW, totalWattsGenerated: totalW, buildings: bldgs } = stateRef.current
      
      // Save Local
      localStorage.setItem('multiprise_watts', currentW.toString())
      localStorage.setItem('multiprise_total_watts', totalW.toString())
      localStorage.setItem('multiprise_buildings', JSON.stringify(bldgs))

      // Save Cloud
      if (session?.user) {
        await supabase.from('profiles').upsert({
          id: session.user.id,
          username: session.user.email.split('@')[0], // username simple
          current_watts: currentW,
          total_watts: totalW,
          buildings: bldgs,
          updated_at: new Date()
        })
      }
    }, 5000) // Sauvegarde toutes les 5 secondes

    return () => clearInterval(saveTimer)
  }, [isLoaded, session])

  // Calcul du revenu passif (Watts par seconde)
  const baseWattsPerSecond = BUILDINGS_CONFIG.reduce((total, building) => {
    return total + (building.baseProd * (buildings[building.id] || 0))
  }, 0)

  const wattsPerSecond = baseWattsPerSecond * bonusMultiplier

  // Boucle de jeu (10 ticks par seconde)
  useEffect(() => {
    if (wattsPerSecond === 0 || !isLoaded) return

    const tickRate = 100 // ms
    const wattsPerTick = wattsPerSecond / (1000 / tickRate)

    const interval = setInterval(() => {
      setWatts(prev => prev + wattsPerTick)
      setTotalWattsGenerated(prev => prev + wattsPerTick)
    }, tickRate)

    return () => clearInterval(interval)
  }, [wattsPerSecond, isLoaded])

  // Gestion du clic
  const handleClick = useCallback(() => {
    const clickPower = 1 * bonusMultiplier
    setWatts(prev => prev + clickPower)
    setTotalWattsGenerated(prev => prev + clickPower)
  }, [bonusMultiplier])

  // Achat d'un bâtiment
  const buyBuilding = useCallback((buildingId) => {
    const config = BUILDINGS_CONFIG.find(b => b.id === buildingId)
    if (!config) return

    const currentCount = buildings[buildingId] || 0
    const cost = calculateCost(config.baseCost, currentCount)
    
    if (watts >= cost) {
      setWatts(watts - cost) // Ne diminue pas le totalWattsGenerated
      setBuildings(prev => ({
        ...prev,
        [buildingId]: currentCount + 1
      }))
    }
  }, [watts, buildings])

  return {
    watts,
    totalWattsGenerated,
    baseWattsPerSecond,
    wattsPerSecond,
    buildings,
    handleClick,
    buyBuilding,
    isLoaded
  }
}
