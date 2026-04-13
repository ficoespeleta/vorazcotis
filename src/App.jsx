import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './features_dashboard/Dashboard';
import QuotationForm from './features_quotations/QuotationForm';
import Settings from './features_settings/Settings';
import Login from './features_auth/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import PublicProposal from './features_landing/PublicProposal';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingQuoteId, setEditingQuoteId] = useState(null);

  // Lógica para detectar si hay un ID público en la URL (ej: ?proposal=...)
  const params = new URLSearchParams(window.location.search);
  const publicProposalId = params.get('proposal');

  if (publicProposalId) {
    return <PublicProposal quoteId={publicProposalId} />;
  }

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A', color: '#fff' }}>Cargando Voraz...</div>;
  }

  if (!user) {
    return <Login />;
  }

  const handleEdit = (id) => {
    setEditingQuoteId(id);
    setCurrentView('new-quote');
  };

  const handleNew = () => {
    setEditingQuoteId(null);
    setCurrentView('new-quote');
  };

  return (
    <div className="app-container">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => {
          if (view === 'new-quote') handleNew();
          else setCurrentView(view);
        }} 
      />
      
      <main className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard onEdit={handleEdit} onNew={handleNew} />
        )}
        
        {currentView === 'new-quote' && (
          <QuotationForm 
            quoteId={editingQuoteId} 
            onBack={() => setCurrentView('dashboard')} 
          />
        )}

        {currentView === 'settings' && (
          <Settings />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
