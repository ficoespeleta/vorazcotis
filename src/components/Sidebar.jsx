import React from 'react';
import { Home, PlusCircle, FileText, Settings, LogOut, Briefcase, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ currentView, setCurrentView }) => {
  const { user, isAdmin, logout } = useAuth();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'new-quote', label: 'Nueva Cotización', icon: PlusCircle },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'templates', label: 'Plantillas', icon: FileText },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Briefcase size={20} />
        </div>
        <span>Voraz</span>
        {isAdmin && (
          <span style={{ 
            fontSize: '10px', 
            backgroundColor: 'var(--color-accent-gold)', 
            color: 'var(--color-brand)', 
            padding: '2px 6px', 
            borderRadius: '4px',
            marginLeft: '8px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            Master
          </span>
        )}
      </div>
      
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id)}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
        <div style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
           <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <User size={16} />
           </div>
           <div style={{ overflow: 'hidden' }}>
             <div style={{ fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.email?.split('@')[0]}</div>
             <div style={{ fontSize: '0.625rem', opacity: 0.6 }}>{user?.email}</div>
           </div>
        </div>

        <button 
          className="nav-item" 
          onClick={logout}
          style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
