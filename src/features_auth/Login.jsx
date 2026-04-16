import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    
    try {
      if (mode === 'login') {
        const { error } = await login(email, password);
        if (error) throw error;
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setMessage('Registro exitoso. Revisá tu email para confirmar tu cuenta.');
        setMode('login');
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setMessage('Se ha enviado un correo para restablecer tu contraseña.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Credenciales inválidas. Revisá tu email y contraseña.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in">
        <div className="login-header">
           <div className="login-logo">
             <Briefcase size={32} style={{ margin: '0 auto 1rem', display: 'block' }} />
             VORAZ
           </div>
           <p className="login-subtitle">
             {mode === 'login' && 'Ingresá a la plataforma interna de cotizaciones.'}
             {mode === 'signup' && 'Creá tu cuenta de vendedor.'}
             {mode === 'forgot' && 'Restablecé tu acceso a la plataforma.'}
           </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {message && (
          <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
            <AlertCircle size={16} />
            {message}
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

          {mode !== 'forgot' && (
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
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.875rem', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 
              mode === 'login' ? 'Iniciar Sesión' : 
              mode === 'signup' ? 'Crear Cuenta' : 'Enviar Instrucciones'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          {mode === 'login' ? (
            <>
              <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                ¿No tenés cuenta?{' '}
                <button 
                  onClick={() => setMode('signup')}
                  style={{ color: 'var(--color-brand)', fontWeight: '600', background: 'none' }}
                >
                  Registrate aquí
                </button>
              </p>
              <button 
                onClick={() => setMode('forgot')}
                style={{ color: '#94a3b8', fontSize: '0.75rem', background: 'none' }}
              >
                Olvidé mi contraseña
              </button>
            </>
          ) : (
            <button 
              onClick={() => setMode('login')}
              style={{ color: 'var(--color-brand)', fontWeight: '600', background: 'none' }}
            >
              Volver al inicio de sesión
            </button>
          )}
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
          &copy; {new Date().getFullYear()} Voraz Travel Agency. Acceso restringido.
        </div>
      </div>
    </div>
  );
};

export default Login;
