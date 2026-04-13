import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const { error } = await login(email, password);
    if (error) {
       setError(error.message === 'Invalid login credentials' ? 'Credenciales inválidas. Revisá tu email y contraseña.' : error.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in">
        <div className="login-header">
           <div className="login-logo">
             <Briefcase size={32} style={{ margin: '0 auto 1rem', display: 'block' }} />
             VORAZ
           </div>
           <p className="login-subtitle">Ingresá a la plataforma interna de cotizaciones.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Corporativo</label>
            <div style={{ position: 'relative' }}>
               <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
               <input 
                 type="email" 
                 value={email} 
                 onChange={(e) => setEmail(e.target.value)} 
                 placeholder="tu.email@voraz.com" 
                 style={{ paddingLeft: '2.5rem' }}
                 required
               />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
               <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
               <input 
                 type="password" 
                 value={password} 
                 onChange={(e) => setPassword(e.target.value)} 
                 placeholder="••••••••" 
                 style={{ paddingLeft: '2.5rem' }}
                 required
               />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.875rem', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Accediendo...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
          &copy; {new Date().getFullYear()} Voraz Travel Agency. Acceso restringido.
        </div>
      </div>
    </div>
  );
};

export default Login;
