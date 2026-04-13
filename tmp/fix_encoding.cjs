const fs = require('fs');
const path = 'c:/Users/ficov/OneDrive/Escritorio/Cotizador Voraz/src/features_quotations/QuotationForm.jsx';

let c = fs.readFileSync(path, 'utf8');

// 1. RECONSTRUCCIÓN DEL COMPONENTE ProposalContent (Estilo Original Minimalista)
const proposalContentCode = `
const BrandedHeader = ({ formData }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '3.5rem', marginBottom: '2.5rem' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
       <div style={{ height: '120px' }}><img src="/logo blanco.png" alt="VORAZ" style={{ height: '100%', width: 'auto' }} /></div>
       {formData.fileNumber && (
          <div style={{ fontSize: '11px', fontWeight: 950, color: '#0F172A', letterSpacing: '2px', textTransform: 'uppercase', backgroundColor: '#f8fafc', padding: '6px 14px', borderRadius: '4px', border: '1px solid #e2e8f0', alignSelf: 'flex-start' }}>FILE / {formData.fileNumber}</div>
       )}
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: '38px', fontWeight: 950, letterSpacing: '-1.5px', color: '#0F172A', textTransform: 'uppercase', lineHeight: '1.1' }}>{formData.tripName || 'Propuesta de Viaje'}</div>
      <div style={{ fontSize: '16px', fontWeight: 700, color: '#475569', marginTop: '10px' }}>{formData.customerName}</div>
      <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px' }}>{formData.tripType.toUpperCase()} • {formData.passengers} PAX • {formData.nights} NOCHES</div>
    </div>
  </div>
);

const ProposalContent = ({ option, formData, calculateTotals }) => {
   const stats = calculateTotals(option);

   const renderServiceIcon = (type) => {
      switch(type) {
         case 'vuelo': return <Plane size={14} />;
         case 'hotel': return <Bed size={14} />;
         case 'traslado': return <Bus size={14} />;
         case 'asistencia': return <ShieldCheck size={14} />;
         case 'actividad': return <Map size={14} />;
         case 'auto': return <Car size={14} />;
         case 'tren': return <Train size={14} />;
         default: return <Plus size={14} />;
      }
   };

   return (
      <div id="preview-content" style={{ backgroundColor: '#fff', padding: '3.5rem', color: '#0F172A', fontFamily: "'Inter', sans-serif" }}>
         <BrandedHeader formData={formData} />

         <div style={{ marginBottom: '3.5rem', display: 'flex', gap: '3rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '2.5rem' }}>
            <div><div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Destinos</div><div style={{ fontSize: '18px', fontWeight: 950 }}>{formData.destinations.map(d => d.city).join(' • ')}</div></div>
            <div><div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Periodo</div><div style={{ fontSize: '18px', fontWeight: 950 }}>{formData.startDate ? formatDate(formData.startDate) : '---'} al {formData.endDate ? formatDate(formData.endDate) : '---'}</div></div>
            <div><div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Viajeros</div><div style={{ fontSize: '18px', fontWeight: 950 }}>{formData.passengers}</div></div>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {option.services.map((s, idx) => (
               <div key={idx} style={{ borderLeft: '5px solid #0F172A', paddingLeft: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '15px' }}>
                     {renderServiceIcon(s.type)} {s.type}
                  </div>

                  {s.type === 'vuelo' && (() => {
                     const flights = parsePNR(s.data.pnr_raw);
                     return (
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                           <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                 <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '10px' }}>FECHA</th>
                                 <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '10px' }}>TRAMO</th>
                                 <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '10px', textAlign: 'right' }}>HORARIO</th>
                              </tr>
                              {flights ? flights.map((f, fi) => (
                                 <tr key={fi} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 16px', fontWeight: 900 }}>{f.dateFriendly}</td>
                                    <td style={{ padding: '14px 16px' }}><strong>{f.departureIata} ➔ {f.arrivalIata}</strong><br/>{f.airline}</td>
                                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 900 }}>{f.departureTimeFormatted}-{f.arrivalTimeFormatted}</td>
                                 </tr>
                              )) : <tr><td colSpan="3" style={{ padding: '20px' }}>{s.data.aerolinea} - {s.data.ruta}</td></tr>}
                           </table>
                           {s.data.equipaje && <div style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', fontSize: '11px', fontWeight: 900 }}>🧳 {s.data.equipaje.toUpperCase()}</div>}
                        </div>
                     );
                  })()}

                  {s.type === 'hotel' && (
                     <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ flex: 1 }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><strong style={{ fontSize: '24px' }}>{s.data.nombre}</strong><div style={{ display: 'flex', color: '#fbbf24' }}>{Array.from({ length: parseInt(s.data.rating) || 0 }).map((_, r) => <Star key={r} size={14} fill="#fbbf24" />)}</div></div>
                           <div style={{ fontSize: '15px', color: '#64748b', fontWeight: 700, marginBottom: '15px' }}>{s.data.ubicacion}</div>
                           <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>HAB</span><div style={{ fontWeight: 800 }}>{s.data.tipoHab}</div></div>
                              <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>PLAN</span><div style={{ fontWeight: 800 }}>{s.data.regimen}</div></div>
                           </div>
                        </div>
                        {s.data.image && <div style={{ width: '220px', height: '140px', borderRadius: '12px', overflow: 'hidden' }}><img src={s.data.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                     </div>
                  )}

                  {s.type === 'actividad' && (
                     <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ flex: 1 }}>
                           <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 800, marginBottom: '5px' }}>{s.data.fecha ? formatDate(s.data.fecha) : ''}</div>
                           <strong style={{ fontSize: '20px', fontWeight: 900, display: 'block', marginBottom: '10px' }}>{s.data.nombre}</strong>
                           <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>{s.data.descripcion}</div>
                        </div>
                        {s.data.image && <div style={{ width: '180px', height: '120px', borderRadius: '12px', overflow: 'hidden' }}><img src={s.data.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                     </div>
                  )}

                  {s.type === 'auto' && (
                     <div style={{ display: 'flex', gap: '2rem', backgroundColor: '#fcfcfc', padding: '20px', borderRadius: '12px' }}>
                        <div style={{ flex: 1 }}>
                           <strong style={{ fontSize: '20px' }}>{s.data.modelo}</strong>
                           <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 800 }}>{s.data.compania}</div>
                           <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: 800 }}>Lugar: {s.data.retiro} ➔ {s.data.devolucion}</div>
                        </div>
                        {s.data.image && <div style={{ width: '180px', height: '110px', borderRadius: '12px', overflow: 'hidden' }}><img src={s.data.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                     </div>
                  )}

                  {(s.type === 'asistencia' || s.type === 'traslado') && (
                     <div style={{ backgroundColor: '#f8fafc', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                        <div><div style={{ fontWeight: 900 }}>{s.data.compania || s.data.tipo || 'Servicio'}</div><div style={{ fontSize: '12px', color: '#64748b' }}>{s.data.plan || s.data.ruta}</div></div>
                        {s.type === 'asistencia' ? <ShieldCheck size={24}/> : <Bus size={24}/>}
                     </div>
                  )}
               </div>
            ))}
         </div>

         <div style={{ marginTop: '4rem', padding: '40px', backgroundColor: '#0F172A', color: '#fff', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 800 }}>TOTAL POR PASAJERO</div><div style={{ fontSize: '42px', fontWeight: 950 }}>{formatCurrency(stats.perPassenger)}</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 800 }}>PRECIO TOTAL USD</div><div style={{ fontSize: '28px', fontWeight: 900 }}>{formatCurrency(stats.total)}</div></div>
         </div>
      </div>
   );
};
`;

// 2. Localizamos la lógica del componente y reconstruimos el encabezado
const startMarker = "const QuotationForm = ({ quoteId, onBack }) => {";
const splitPoint = c.indexOf(startMarker);
const preamble = c.substring(0, splitPoint);

fs.writeFileSync(path, preamble + proposalContentCode + "\n" + c.substring(splitPoint), 'utf8');
console.log('MINIMAL_RESTORATION_DONE');
