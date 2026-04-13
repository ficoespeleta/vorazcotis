
const fs = require('fs');
const path = 'c:/Users/ficov/OneDrive/Escritorio/Cotizador Voraz/src/features_quotations/QuotationForm.jsx';

try {
    let content = fs.readFileSync(path, 'utf8');

    // Buscamos el inicio y fin del bloque de servicios para extirpar la corrupción
    // Usamos fragmentos de texto que sabemos que son únicos y están limpios
    const startAnchor = "{s.type === 'vuelo' && (() => {";
    const endAnchor = "ShieldCheck size={24} color=\"#0F172A\" />";
    
    const startIndex = content.indexOf(startAnchor);
    const endIndex = content.indexOf(endAnchor, startIndex);

    if (startIndex !== -1 && endIndex !== -1) {
        const pre = content.substring(0, startIndex);
        // Buscamos el final del div de asistencia después del ancla
        const closingIndex = content.indexOf('</div>', endIndex) + 6; 
        const post = content.substring(closingIndex);
        
        const cleanServices = `{s.type === 'vuelo' && (() => {
                         const flights = parsePNR(s.data.pnr_raw);
                         if (!flights) return (
                            <div style={{ fontSize: '16px' }}>
                               <strong>{s.data.aerolinea}</strong> - {s.data.ruta}
                               {s.data.equipaje && (
                                  <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 800, color: '#475569', backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginLeft: '12px' }}>
                                     🧳 {s.data.equipaje}
                                  </div>
                               )}
                            </div>
                         );
                         return (
                            <div>
                               <div style={{ width: '100%', overflow: 'hidden', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                     <thead>
                                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                           <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px' }}>Fecha</th>
                                           <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px' }}>Vuelo</th>
                                           <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px' }}>Tramo</th>
                                           <th style={{ padding: '12px 16px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px', textAlign: 'right' }}>Horarios (S/LL)</th>
                                        </tr>
                                     </thead>
                                     <tbody>
                                        {flights.map((f, fi) => (
                                           <tr key={fi} style={{ borderBottom: fi < flights.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                              <td style={{ padding: '14px 16px', fontWeight: 900, color: '#0F172A' }}>{f.dateFriendly}</td>
                                              <td style={{ padding: '14px 16px' }}><div style={{ fontWeight: 700, color: '#1e293b' }}>{f.airline}</div><div style={{ fontSize: '11px', color: '#64748b' }}>Vuelo {f.flightNumber}</div></td>
                                              <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900 }}>{f.departureIata} <ChevronRight size={14} color="#94a3b8" /> {f.arrivalIata}</div><div style={{ fontSize: '11px', color: '#64748b' }}>{f.departureCity} a {f.arrivalCity}</div></td>
                                              <td style={{ padding: '14px 16px', textAlign: 'right' }}><div style={{ fontSize: '14px', fontWeight: 950 }}>{f.departureTimeFormatted} ➔ {f.arrivalTimeFormatted}</div><div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Hora Local</div></td>
                                           </tr>
                                        ))}
                                     </tbody>
                                  </table>
                               </div>
                               {s.data.equipaje && (
                                  <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, color: '#475569' }}>
                                     🧳 Equipaje incluido: {s.data.equipaje}
                                  </div>
                               )}
                            </div>
                         );
                      })()}
                      {s.type === 'hotel' && (
                         <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><strong style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>{s.data.nombre}</strong><div style={{ display: 'flex', color: '#fbbf24' }}>{Array.from({ length: parseInt(s.data.rating) || 0 }).map((_, r) => <Star key={r} size={14} fill="#fbbf24" />)}</div></div>
                               <div style={{ fontSize: '15px', color: '#475569', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} /> {s.data.ubicacion}</div>
                               <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                     <div><div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Habitación</div><div style={{ fontWeight: 800 }}>{s.data.tipoHab}</div></div>
                                     <div><div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Régimen</div><div style={{ fontWeight: 800 }}>{s.data.regimen}</div></div>
                                     <div style={{ gridColumn: 'span 2' }}><div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Estadía</div><div style={{ fontWeight: 800 }}>{s.data.checkin ? formatDate(s.data.checkin) : '---'} al {s.data.checkout ? formatDate(s.data.checkout) : '---'} ({s.data.noches} noches)</div></div>
                                  </div>
                                  {s.data.link && <a href={s.data.link} target="_blank" rel="noreferrer" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 800, fontSize: '12px', textDecoration: 'none', borderBottom: '2px solid #0F172A' }}>VER HOTEL EN WEB <LinkIcon size={12} /></a>}
                               </div>
                            </div>
                            {s.data.image && <div style={{ width: '220px', height: '160px', borderRadius: '20px', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}><img src={s.data.image} alt={s.data.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                         </div>
                      )}
                      {s.type === 'asistencia' && (
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fcfcfc', padding: '16px 20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                            <div>
                               <div style={{ fontSize: '16px', fontWeight: 950, color: '#0F172A' }}>{s.data.compania}</div>
                               <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 800, marginTop: '2px' }}>COBERTURA: {s.data.plan}</div>
                            </div>
                            <ShieldCheck size={24} color="#0F172A" />
                         </div>
                      )}`;

        fs.writeFileSync(path, pre + cleanServices + post, 'utf8');
        console.log('REPAIR_SUCCESS: File fixed and luggage added.');
    } else {
        console.log('REPAIR_ERROR: Could not find clean anchors to perform the fix.');
    }
} catch (e) {
    console.error('REPAIR_FATAL_ERROR:', e.message);
}
