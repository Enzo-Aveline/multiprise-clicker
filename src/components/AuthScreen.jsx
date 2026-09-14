import React, { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const AuthScreen = ({ session }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Vérification de la configuration Supabase
  const isConfigured = !supabase.supabaseUrl.includes('placeholder')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!isConfigured) {
      setMessage('⚠️ Veuillez configurer vos clés Supabase dans un fichier .env.local (voir .env.example)')
      return
    }
    
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!isConfigured) {
      setMessage('⚠️ Veuillez configurer vos clés Supabase dans un fichier .env.local (voir .env.example)')
      return
    }

    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Compte créé avec succès (ou email de vérification envoyé selon config).')
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    if (!isConfigured) {
      setMessage('⚠️ Veuillez configurer vos clés Supabase dans un fichier .env.local (voir .env.example)')
      return
    }
    
    // Alerte car Google Auth nécessite une config spécifique dans Supabase
    const confirmGoogle = window.confirm("Attention : Google Auth doit être activé et configuré dans votre dashboard Supabase (Google Cloud Console). Avez-vous fait cette configuration ?")
    
    if (confirmGoogle) {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
      if (error) setMessage(error.message)
    }
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
      
      {!isConfigured && (
        <div className="config-warning" style={{ background: '#ff555522', color: '#ff5555', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '0.8rem', border: '1px solid #ff5555' }}>
          ⚠️ Base de données non configurée.<br/>
          Créez un fichier <code>.env.local</code> avec vos clés Supabase.
        </div>
      )}

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
