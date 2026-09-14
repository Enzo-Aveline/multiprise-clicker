const BASE_BUILDING_NAMES = [
  "Pile 9V", "Dynamo", "Eolienne Balcon", "Compteur Trafique",
  "Roue pour Hamster", "Panneau Solaire DIY", "Moteur de Tondeuse",
  "Groupe Electrogene", "Batterie de Voiture", "Eolienne de Jardin",
  "Centrale a Charbon", "Barrage Miniature", "Ferme Solaire",
  "Centrale Geothermique", "Usine Maremotrice", "Reacteur Nucleaire",
  "Generateur Antimatiere", "Sphere de Dyson", "Extracteur de Vide",
  "Trou Noir Captif"
]

// Fonction pour générer les 50 bâtiments de façon algorithmique
const generateBuildings = () => {
  const buildings = []
  
  for (let i = 0; i < 50; i++) {
    // Si on dépasse la liste prédéfinie, on ajoute des suffixes (Mk II, Mk III, etc)
    const baseNameIndex = i % BASE_BUILDING_NAMES.length
    const tier = Math.floor(i / BASE_BUILDING_NAMES.length)
    const suffix = tier > 0 ? ` Mk ${tier + 1}` : ''
    
    // Formule exponentielle
    // Coût: commence à 15, x 2.2 par niveau global
    const baseCost = Math.floor(15 * Math.pow(2.2, i))
    
    // Prod: commence à 1, x 2.1 par niveau global
    // Arrondi pour éviter des nombres avec virgules bizarres
    let baseProd = 1 * Math.pow(2.1, i)
    if (baseProd > 100) baseProd = Math.floor(baseProd)
    else baseProd = Number(baseProd.toFixed(1))

    buildings.push({
      id: `b_${i}`,
      name: `${BASE_BUILDING_NAMES[baseNameIndex]}${suffix}`,
      baseCost,
      baseProd
    })
  }
  
  return buildings
}

export const BUILDINGS_CONFIG = generateBuildings()

export const calculateCost = (baseCost, count) => {
  // Le coût augmente de 15% pour chaque bâtiment possédé
  return Math.floor(baseCost * Math.pow(1.15, count))
}
