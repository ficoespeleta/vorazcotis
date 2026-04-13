import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../supabase/settings';
import { Save, User, Phone, Mail, Globe, Palette, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    agencyName: 'VORAZ',
    agentName: 'Federico Espeleta',
    agentWhatsApp: '59898199677',
    agentEmail: 'fespeleta@voraz.com.uy',
    defaultMarkup: 15,
    logoUrlWhite: '/logo blanco.png',
    logoUrlBlack: '/logo negro.png',
    termsAndConditions: 'Precios sujetos a disponibilidad al momento de reservar. Operador responsable Voraz Travel.'
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSettings();
        if (data) {
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Error al cargar configuración:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateSettings(formData);
      setMessage({ type: 'success', text: 'Configuración guardada correctamente! 🦁🛡️' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error al guardar los cambios.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando tus ajustes...</div>;

  return (
    <div style={{ padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
         <h2 style={{ fontSize: '2rem', fontWeight: 950, color: '#0F172A' }}>Configuración Voraz 🦁</h2>
         <button 
            onClick={handleSubmit} 
            disabled={saving}
            className="btn" 
            style={{ backgroundColor: '#0F172A', color: '#fff', padding: '0.8rem 2rem', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}
         >
            {saving ? 'Guardando...' : <><Save size={18}/> Guardar Cambios</>}
         </button>
      </div>

      {message && (
         <div style={{ 
            padding: '1rem 1.5rem', 
            borderRadius: '12px', 
            marginBottom: '2rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${message.type === 'success' ? '#bcf0da' : '#fecaca'}`,
            fontWeight: 800
         }}>
            {message.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
            {message.text}
         </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
         
         {/* PERFIL DEL AGENTE */}
         <div className="card" style={{ padding: '2.5rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' }}>
               <User size={20} color="#94a3b8"/> Perfil del Agente
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div className="form-group">
                  <label className="form-label">Nombre para Mails / Firmas</label>
                  <input value={formData.agentName} onChange={e => setFormData({...formData, agentName: e.target.value})} placeholder="Ej. Federico Espeleta" />
               </div>
               <div className="form-group">
                  <label className="form-label">WhatsApp de Contacto (Para Landing)</label>
                  <input value={formData.agentWhatsApp} onChange={e => setFormData({...formData, agentWhatsApp: e.target.value})} placeholder="Ej. 59898123456" />
                  <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '5px', display: 'block' }}>Sin el signo + ni espacios.</span>
               </div>
               <div className="form-group">
                  <label className="form-label">Email de la Agencia</label>
                  <input value={formData.agentEmail} onChange={e => setFormData({...formData, agentEmail: e.target.value})} placeholder="agencia@voraz.uy" />
               </div>
            </div>
         </div>

         {/* BRANDING Y ESTÉTICA */}
         <div className="card" style={{ padding: '2.5rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' }}>
               <Palette size={20} color="#94a3b8"/> Branding & Logos
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div className="form-group">
                  <label className="form-label">Nombre de la Agencia</label>
                  <input value={formData.agencyName} onChange={e => setFormData({...formData, agencyName: e.target.value})} />
               </div>
               <div className="form-group">
                  <label className="form-label">URL Logo Blanco (Para fondos oscuros)</label>
                  <input value={formData.logoUrlWhite} onChange={e => setFormData({...formData, logoUrlWhite: e.target.value})} />
               </div>
               <div className="form-group">
                  <label className="form-label">URL Logo Negro (Para fondos claros)</label>
                  <input value={formData.logoUrlBlack} onChange={e => setFormData({...formData, logoUrlBlack: e.target.value})} />
               </div>
            </div>
         </div>

         {/* NEGOCIO Y LEGALES */}
         <div className="card" style={{ padding: '2.5rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' }}>
               <FileText size={20} color="#94a3b8"/> Reglas de Negocio & Legales
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
               <div className="form-group">
                  <label className="form-label">Markup Predeterminado (%)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <input type="number" value={formData.defaultMarkup} onChange={e => setFormData({...formData, defaultMarkup: e.target.value})} style={{ fontWeight: 900, fontSize: '1.2rem' }} />
                     <span style={{ fontWeight: 900, color: '#94a3b8' }}>%</span>
                  </div>
               </div>
               <div className="form-group">
                  <label className="form-label">Legales / Pie de Cotización</label>
                  <textarea 
                     value={formData.termsAndConditions} 
                     onChange={e => setFormData({...formData, termsAndConditions: e.target.value})}
                     style={{ width: '100%', height: '100px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '15px', fontFamily: 'inherit', resize: 'none' }}
                  />
               </div>
            </div>
         </div>

      </form>
    </div>
  );
};

export default Settings;
