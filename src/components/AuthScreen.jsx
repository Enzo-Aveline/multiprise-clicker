import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const AuthScreen = ({ session }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Compte créé avec succès (ou email de vérification envoyé selon config).')
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) setMessage(error.message)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (session) {
    return (
      <div className="auth-container">
        <h3>Connecté en tant que {session.user.email}</h3>
        <p className="auth-status">✅ Sauvegarde Cloud active</p>
        <button className="auth-btn logout" onClick={handleLogout}>Se déconnecter</button>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <h2>Sauvegarde Cloud</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="auth-input"
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="auth-input"
        />
        <div className="auth-actions">
          <button type="submit" disabled={loading} className="auth-btn">Connexion</button>
          <button type="button" disabled={loading} onClick={handleSignUp} className="auth-btn secondary">Créer un compte</button>
        </div>
      </form>
      
      <div className="auth-divider">ou</div>
      
      <button onClick={handleGoogleLogin} className="auth-btn google">
        Continuer avec Google
      </button>

      {message && <p className="auth-message">{message}</p>}
    </div>
  )
}

export default AuthScreen
