import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Admin Login - JJ's Salon"
    if (localStorage.getItem('adminLoggedIn') === 'true') {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (username === 'admin' && password === 'jjsalon2026') {
      localStorage.setItem('adminLoggedIn', 'true')
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid username or password. Please try again.')
    }
  }

  return (
    <main>
      <section className="login-section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="login-container" style={{ background: 'var(--white)', borderRadius: '16px', padding: '3rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.5rem' }}>
              JJ's Salon
            </h1>
            <p style={{ color: 'var(--text-light)' }}>Admin Panel Login</p>
          </div>

          {error && (
            <div className="error-message" style={{
              background: '#fee', color: '#c33', border: '1px solid #fcc',
              borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.9rem'
            }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="username" style={{ display: 'block', position: 'static', background: 'transparent', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-dark)', fontSize: '1rem', padding: 0 }}>
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="username"
                style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e0d5c8', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label htmlFor="password" style={{ display: 'block', position: 'static', background: 'transparent', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-dark)', fontSize: '1rem', padding: 0 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 1rem', border: '2px solid #e0d5c8', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', cursor: 'pointer' }}
            >
              <i className="fas fa-sign-in-alt" style={{ marginRight: '0.5rem' }}></i>
              Login to Admin Panel
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
