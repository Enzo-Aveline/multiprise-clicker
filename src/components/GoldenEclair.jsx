import React from 'react'

const GoldenEclair = ({ isVisible, position, onClick }) => {
  if (!isVisible) return null

  return (
    <button
      className="golden-eclair"
      style={{
        left: position.x,
        top: position.y
      }}
      onClick={onClick}
    >
      ⚡
    </button>
  )
}

export default GoldenEclair
