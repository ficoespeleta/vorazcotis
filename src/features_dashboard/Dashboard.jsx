import React, { useEffect, useState } from 'react';
import { getQuotations, createQuotation, deleteQuotation } from '../supabase/quotations';
import { Plus, Search, Edit2, Copy, Trash2, MapPin, User, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/utils';

const Dashboard = ({ onEdit, onNew }) => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQuotes = async () => {
    try {
      const data = await getQuotations();
      setQuotations(data);
    } catch (e) {
      console.error("Error fetching quotes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleDuplicate = async (quote) => {
    try {
      const { id, created_at, ...rest } = quote;
      const newQuote = { 
        ...rest, 
        customerName: `${quote.customerName} (Copia)`,
        created_at: new Date().toISOString() 
      };
      await createQuotation(newQuote);
      fetchQuotes();
    } catch (e) {
      alert("Error al duplicar: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta cotización?')) {
      try {
        await deleteQuotation(id);
        setQuotations(prevQuotations => prevQuotations.filter(q => q.id !== id));
      } catch (e) {
        alert("Error al eliminar: " + e.message);
      }
    }
  };

  const filteredQuotes = quotations.filter(q => 
    q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <header className="section-header">
        <div>
           <h1>Mis Cotizaciones</h1>
           <p className="tagline">Agilizá tus propuestas con el estilo Voraz.</p>
        </div>
        <button className="btn btn-primary" onClick={onNew}>
          <Plus size={20} />
          Nueva Cotización
        </button>
      </header>

      <div className="card glass-card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
             <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-accent-light)' }} />
             <input 
               placeholder="Buscar cliente, destino..." 
               style={{ paddingLeft: '2.5rem' }}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        {loading ? (
             <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
        ) : filteredQuotes.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-accent-light)' }}>
                  {searchTerm ? 'No se encontraron resultados.' : 'No hay cotizaciones guardadas aún.'}
                </p>
                <button className="btn btn-ghost" onClick={onNew} style={{ marginTop: '1rem' }}>Empezar ahora</button>
            </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-accent)' }}>Cliente & Destino</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-accent)' }}>Pasajeros</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-accent)' }}>Fecha</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-accent)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-accent)', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((q) => (
                <tr key={q.id} style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => onEdit(q.id)}>
                   <td style={{ padding: '1rem 1.5rem' }}>
                     <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem', marginBottom: '2px' }}>{q.tripName || 'Sin nombre de viaje'}</div>
                     <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        <User size={12} /> {q.customerName || '---'} {q.status === 'CONFIRMADA' && q.fileNumber && <span style={{ backgroundColor: '#0F172A', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 }}>FILE: {q.fileNumber}</span>}
                     </div>
                   </td>
                   <td style={{ padding: '1rem 1.5rem' }}>
                     <div className="badge badge-gray" style={{ fontWeight: 800 }}>{q.passengers || 1} PAX</div>
                   </td>
                   <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{new Date(q.created_at).toLocaleDateString()}</div>
                   </td>
                   <td style={{ padding: '1rem 1.5rem' }}>
                     <span 
                       className="badge" 
                       style={{ 
                         backgroundColor: q.status === 'CONFIRMADA' ? '#dcfce7' : q.status === 'ENVIADA' ? '#fef9c3' : '#e0f2fe',
                         color: q.status === 'CONFIRMADA' ? '#166534' : q.status === 'ENVIADA' ? '#854d0e' : '#0369a1',
                         fontWeight: 900,
                         fontSize: '10px'
                       }}
                     >
                        {q.status || 'BORRADOR'}
                     </span>
                   </td>
                   <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                     <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button className="btn btn-ghost" style={{ padding: '5px' }} onClick={() => onEdit(q.id)} title="Editar"><Edit2 size={16} /></button>
                        <button className="btn btn-ghost" style={{ padding: '5px' }} onClick={() => handleDuplicate(q)} title="Duplicar"><Copy size={16} /></button>
                        <button className="btn btn-ghost" style={{ padding: '5px', color: 'var(--color-error)' }} onClick={() => handleDelete(q.id)} title="Eliminar"><Trash2 size={16} /></button>
                     </div>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
