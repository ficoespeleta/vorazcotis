import React, { useState, useEffect } from 'react';
import { getQuotationById } from '../supabase/quotations';
import { getSettings } from '../supabase/settings';
import { 
  Plane, Bed, Bus, ShieldCheck, Map, Car, Train, Star, 
  MapPin, Clock, Users, Ship, Check, Calendar, ArrowRight, Anchor, Sparkles, Truck
} from 'lucide-react';
import { formatCurrency, formatDate, parsePNR } from '../utils/utils';

const renderServiceIcon = (type, size = 20) => {
  switch(type) {
    case 'vuelo': return <Plane size={size} />;
    case 'hotel': return <Bed size={size} />;
    case 'traslado': return <Bus size={size} />;
    case 'asistencia': return <ShieldCheck size={size} />;
    case 'actividad': return <Map size={size} />;
    case 'auto': return <Car size={size} />;
    case 'tren': return <Train size={size} />;
    case 'ferry': return <Ship size={size} />;
    case 'motorhome': return <Truck size={size} />;
    case 'catamaran': return <Anchor size={size} />;
    case 'otros': return <Sparkles size={size} />;
    case 'bus': return <Bus size={size} />;
    default: return <Star size={size} />;
  }
};

const PublicProposal = ({ quoteId }) => {
  const [data, setData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeOptionIdx, setActiveOptionIdx] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [quote, sets] = await Promise.all([
           getQuotationById(quoteId),
           getSettings()
        ]);
        setData(quote);
        setSettings(sets);
      } catch (err) {
        console.error("Error loading proposal:", err);
      } finally {
        setLoading(false);
      }
    };
    if (quoteId) load();
  }, [quoteId]);

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A', color: '#fff' }}>Diseñando tu propuesta Voraz...</div>;
  if (!data) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Propuesta no encontrada.</div>;

  const currentOption = data.options[activeOptionIdx];
  const services = currentOption?.services || [];

  const handleConfirm = () => {
    const text = encodeURIComponent(`Hola ${settings?.agentName || 'Federico'}! 👋 He visto la propuesta para mi viaje a ${data.tripName} y me gustaría confirmarla.`);
    window.open(`https://wa.me/${settings?.agentWhatsApp || '59898199677'}?text=${text}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* HEADER DE BIENVENIDA GIGANTE */}
      <header style={{ backgroundColor: '#0F172A', color: '#fff', padding: '120px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
         <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
            <img src={settings?.logoUrlWhite || "/logo blanco.png"} alt="Voraz" style={{ height: '60px', marginBottom: '40px' }} />
            <h1 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '6px', color: '#94a3b8', marginBottom: '15px' }}>Propuesta Exclusiva para</h1>
            <h2 style={{ fontSize: '64px', fontWeight: 950, marginBottom: '30px', lineHeight: '1' }}>{data.customerName || 'Viajero Voraz'}</h2>
            <div style={{ fontSize: '20px', fontWeight: 400, color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
               Diseñamos este itinerario personalizado para tu próximo viaje a <strong style={{ color: '#fff' }}>{data.tripName}</strong>. 
               Explora cada detalle y confirma tu aventura.
            </div>
         </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '-40px auto 0', position: 'relative', padding: '0 20px 80px' }}>
         
         {/* SELECTOR DE OPCIONES PREMIUM */}
         <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '60px' }}>
            {data.options.map((opt, idx) => (
               <button 
                  key={idx}
                  onClick={() => setActiveOptionIdx(idx)}
                  style={{
                     padding: '1.2rem 2.5rem',
                     borderRadius: '16px',
                     border: 'none',
                     backgroundColor: activeOptionIdx === idx ? '#fff' : 'rgba(15, 23, 42, 0.05)',
                     color: activeOptionIdx === idx ? '#0F172A' : '#64748b',
                     fontWeight: 950,
                     fontSize: '15px',
                     boxShadow: activeOptionIdx === idx ? '0 10px 30px rgba(0,0,0,0.08)' : 'none',
                     cursor: 'pointer',
                     transition: 'all 0.3s ease'
                  }}
               >
                  {opt.title}
               </button>
            ))}
         </div>

         {/* LISTADO DE SERVICIOS - ESTILO LANDING */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {services.map((s, idx) => (
               <div key={idx} style={{ backgroundColor: '#fff', borderRadius: '32px', padding: '40px', boxShadow: '0 4px 40px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                     <div style={{ backgroundColor: '#0F172A', color: '#fff', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {renderServiceIcon(s.type)}
                     </div>
                     <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#94a3b8' }}>{s.type}</span>
                  </div>

                  {s.type === 'vuelo' && (() => {
                     const flights = parsePNR(s.data.pnr_raw);
                     return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                           {flights?.map((f, fi) => (
                              <div key={fi} style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.2fr', alignItems: 'center', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9', backgroundColor: '#fcfcfc' }}>
                                 <div><div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 800 }}>{f.dateFriendly}</div><div style={{ fontWeight: 950, fontSize: '18px' }}>{f.airline}</div></div>
                                 <div style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                       <div style={{ textAlign: 'right' }}><div style={{ fontSize: '24px', fontWeight: 950 }}>{f.departureIata}</div><div style={{ fontSize: '11px', color: '#64748b' }}>{f.departureCity}</div></div>
                                       <div style={{ flex: 1, height: '2px', backgroundColor: '#e2e8f0', position: 'relative' }}>
                                          <Plane size={14} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#cbd5e1' }} />
                                       </div>
                                       <div style={{ textAlign: 'left' }}><div style={{ fontSize: '24px', fontWeight: 950 }}>{f.arrivalIata}</div><div style={{ fontSize: '11px', color: '#64748b' }}>{f.arrivalCity}</div></div>
                                    </div>
                                 </div>
                                 <div style={{ textAlign: 'right' }}><div style={{ fontSize: '20px', fontWeight: 950 }}>{f.departureTimeFormatted}</div><div style={{ fontSize: '11px', color: '#64748b' }}>Hora Local</div></div>
                              </div>
                           ))}
                           {s.data.image && (
                             <div style={{ marginTop: '20px' }}>
                                <img src={s.data.image} style={{ maxWidth: '100%', width: 'auto', display: 'block', margin: '0 auto', borderRadius: '24px', border: '1px solid #f1f5f9' }} alt="Detalle Vuelo" />
                             </div>
                           )}
                        </div>
                     );
                  })()}

                  {s.type === 'hotel' && (
                     <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                        <div>
                           <h3 style={{ fontSize: '32px', fontWeight: 950, marginBottom: '10px' }}>{s.data.nombre}</h3>
                           <div style={{ display: 'flex', color: '#fbbf24', gap: '2px', marginBottom: '20px' }}>
                              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill={i < parseInt(s.data.rating) ? "#fbbf24" : "none"} color={i < parseInt(s.data.rating) ? "#fbbf24" : "#e2e8f0"} />)}
                           </div>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                              <div><span style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8' }}>CHECK-IN</span><div style={{ fontWeight: 800 }}>{formatDate(s.data.checkin)}</div></div>
                              <div><span style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8' }}>NOCHES</span><div style={{ fontWeight: 800 }}>{s.data.noches}</div></div>
                              <div><span style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8' }}>RÉGIMEN</span><div style={{ fontWeight: 800 }}>{s.data.regimen}</div></div>
                           </div>
                        </div>
                        {s.data.image && <img src={s.data.image} style={{ width: '100%', height: '240px', borderRadius: '24px', objectFit: 'cover' }} />}
                     </div>
                  )}

                  {s.type === 'auto' && (
                     <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                        <div>
                           <h3 style={{ fontSize: '28px', fontWeight: 950, marginBottom: '5px' }}>{s.data.modelo}</h3>
                           <div style={{ fontSize: '16px', color: '#64748b', fontWeight: 700, marginBottom: '20px' }}>{s.data.compania}</div>
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                              <div><span style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8' }}>RETIRO</span><div style={{ fontWeight: 800 }}>{s.data.retiro} ({s.data.horaRetiro})</div></div>
                              <div><span style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8' }}>DEVOLUCIÓN</span><div style={{ fontWeight: 800 }}>{s.data.devolucion} ({s.data.horaDevolucion})</div></div>
                           </div>
                        </div>
                        {s.data.image && <img src={s.data.image} style={{ width: '100%', height: '180px', borderRadius: '24px', objectFit: 'cover' }} />}
                     </div>
                  )}

                  {s.type === 'traslado' && (
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                           <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px', marginBottom: '5px' }}>{s.data.tipo?.toUpperCase()}</div>
                           <div style={{ fontSize: '22px', fontWeight: 950 }}>{s.data.ruta}</div>
                        </div>
                        <Check size={32} color="#10b981" />
                     </div>
                  )}

                  {s.type === 'actividad' && (
                     <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                        <div>
                           <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 800, marginBottom: '5px' }}>{formatDate(s.data.fecha)}</div>
                           <h3 style={{ fontSize: '26px', fontWeight: 950, marginBottom: '15px' }}>{s.data.nombre}</h3>
                           <p style={{ color: '#64748b', lineHeight: '1.6' }}>{s.data.descripcion}</p>
                        </div>
                        {s.data.image && <img src={s.data.image} style={{ width: '100%', height: '200px', borderRadius: '24px', objectFit: 'cover' }} />}
                     </div>
                  )}

                  {s.type === 'tren' && (
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                           <div style={{ fontSize: '24px', fontWeight: 950 }}>{s.data.ruta}</div>
                           <span style={{ backgroundColor: '#0F172A', color: '#fff', padding: '6px 15px', borderRadius: '8px', fontSize: '11px', fontWeight: 900 }}>{s.data.clase?.toUpperCase()}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                           <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>FECHA</span><div style={{ fontWeight: 800 }}>{formatDate(s.data.fecha)}</div></div>
                           <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>SALIDA</span><div style={{ fontWeight: 800 }}>{s.data.hora} HS</div></div>
                           <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>REFERENCIA</span><div style={{ fontWeight: 800 }}>{s.data.numeroTren}</div></div>
                        </div>
                     </div>
                  )}

                  {s.type === 'ferry' && (
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                           <div style={{ fontSize: '24px', fontWeight: 950 }}>{s.data.ruta}</div>
                           <Ship size={32} color="#0F172A" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                           <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>COMPAÑÍA</span><div style={{ fontWeight: 800 }}>{s.data.compania}</div></div>
                           <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>FECHA / HORA</span><div style={{ fontWeight: 800 }}>{formatDate(s.data.fecha)} {s.data.hora} HS</div></div>
                           <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>CLASE</span><div style={{ fontWeight: 800 }}>{s.data.clase || 'Standard'}</div></div>
                        </div>
                     </div>
                  )}

                  {s.type === 'motorhome' && (
                     <div style={{ backgroundColor: '#f8fafc', borderRadius: '24px', padding: '30px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                           <div>
                              <h3 style={{ fontSize: '24px', fontWeight: 950, marginBottom: '5px' }}>{s.data.modelo}</h3>
                              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 800 }}>ALQUILER CON: {s.data.compania?.toUpperCase()}</div>
                           </div>
                           <Truck size={32} color="#0F172A" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                           <div><span style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8' }}>RETIRO (PICK-UP)</span><div style={{ fontWeight: 800 }}>{s.data.pickUp} ({formatDate(s.data.startDate)})</div></div>
                           <div><span style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8' }}>ENTREGA (DROP-OFF)</span><div style={{ fontWeight: 800 }}>{s.data.dropOff} ({formatDate(s.data.endDate)})</div></div>
                        </div>
                     </div>
                  )}

                  {s.type === 'bus' && (
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                           <div style={{ fontSize: '24px', fontWeight: 950 }}>{s.data.ruta}</div>
                           <Bus size={32} color="#0F172A" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                           <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>COMPAÑÍA</span><div style={{ fontWeight: 800 }}>{s.data.compania}</div></div>
                           <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>FECHA / HORA</span><div style={{ fontWeight: 800 }}>{formatDate(s.data.fecha)} {s.data.hora} HS</div></div>
                           <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>TIPO ASIENTO</span><div style={{ fontWeight: 800 }}>{s.data.clase || 'Standard'}</div></div>
                        </div>
                     </div>
                  )}

                  {s.type === 'catamaran' && (
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                           <div style={{ fontSize: '24px', fontWeight: 950 }}>{s.data.ruta}</div>
                           <Anchor size={32} color="#0F172A" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '16px' }}>
                           <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#0369a1' }}>COMPAÑÍA</span><div style={{ fontWeight: 800 }}>{s.data.compania}</div></div>
                           <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#0369a1' }}>FECHA / HORA</span><div style={{ fontWeight: 800 }}>{formatDate(s.data.fecha)} {s.data.hora} HS</div></div>
                           <div><span style={{ fontSize: '9px', fontWeight: 900, color: '#0369a1' }}>EXPERIENCIA</span><div style={{ fontWeight: 800 }}>{s.data.clase || 'Standard'}</div></div>
                        </div>
                     </div>
                  )}

                  {s.type === 'otros' && (
                     <div style={{ backgroundColor: '#fffdf5', borderRadius: '24px', padding: '30px', border: '1px solid #fef3c7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                           <div style={{ fontSize: '10px', fontWeight: 900, color: '#c5a059', textTransform: 'uppercase', marginBottom: '4px' }}>Servicio Especial</div>
                           <h3 style={{ fontSize: '24px', fontWeight: 950, marginBottom: '5px' }}>{s.data.servicio}</h3>
                           <p style={{ color: '#64748b', fontSize: '15px' }}>{s.data.descripcion}</p>
                        </div>
                        <Sparkles size={40} color="#c5a059" />
                     </div>
                  )}

               </div>
            ))}
         </div>

         {/* TOTALES Y ACCIÓN FINAL */}
         {(() => {
            const stats = calculateTotalsForOption(currentOption, data);
            return (
               <div style={{ marginTop: '5rem', backgroundColor: '#0F172A', color: '#fff', padding: '60px', borderRadius: '40px', textAlign: 'center', boxShadow: '0 20px 60px rgba(15,23,42,0.3)' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#94a3b8', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px' }}>Inversión Total</h3>
                  <div style={{ fontSize: '64px', fontWeight: 950, marginBottom: '20px', letterSpacing: '-2px' }}>{formatCurrency(stats.total)}</div>
                  
                  {/* Desglose para transparencia */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '40px', opacity: 0.8 }}>
                     <div><div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900 }}>ADT</div><div style={{ fontSize: '18px', fontWeight: 950 }}>{formatCurrency(stats.perAdult || 0)}</div></div>
                     {(data.passengersChild > 0) && <div><div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900 }}>CHD</div><div style={{ fontSize: '18px', fontWeight: 950 }}>{formatCurrency(stats.perChild || 0)}</div></div>}
                     {(data.passengersInfant > 0) && <div><div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900 }}>INF</div><div style={{ fontSize: '18px', fontWeight: 950 }}>{formatCurrency(stats.perInfant || 0)}</div></div>}
                  </div>

                  <button 
                     onClick={handleConfirm}
                     style={{ backgroundColor: '#fff', color: '#0F172A', padding: '1.5rem 4rem', borderRadius: '20px', border: 'none', fontSize: '18px', fontWeight: 950, cursor: 'pointer', transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '15px' }}>
                     Confirmar Propuesta <ArrowRight size={20} />
                  </button>
                  <div style={{ marginTop: '30px', color: '#64748b', fontSize: '14px', maxWidth: '800px', margin: '30px auto 0', textAlign: 'left', lineHeight: '1.6' }}>
                     <div style={{ fontWeight: 900, color: '#fff', marginBottom: '10px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Términos y Condiciones</div>
                     <div style={{ whiteSpace: 'pre-wrap', opacity: 0.8 }}>
                        {settings?.termsAndConditions || `• Las tarifas están expresadas en dólares americanos (USD) por persona, sujetas a cambios de disponibilidad y precio al momento de la confirmación de la reserva.
 • Los pasajes aéreos, una vez emitidos, no permiten cambios ni devoluciones y son intransferibles.
 • Es responsabilidad del viajero contar con toda la documentación necesaria (pasaportes, visas, vacunas) vigente para el destino seleccionado.`}
                     </div>
                  </div>
               </div>
            );
         })()}
      </div>

      <footer style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', borderTop: '1px solid #f1f5f9' }}>
         <img src={settings?.logoUrlBlack || "/logo negro.png"} alt="Voraz" style={{ height: '40px', marginBottom: '20px', opacity: 0.5 }} />
         <div>© 2026 {settings?.agencyName || 'Voraz Travel Experience'}. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
};

const calculateTotalsForOption = (option, quoteData) => {
    if (!option || !option.services) return { total: 0, perAdult: 0, perChild: 0, perInfant: 0 };
    
    // Si hay un precio manual establecido, este manda sobre todo
    if (option.manualPrice && option.manualPrice > 0) {
      return { total: option.manualPrice, perAdult: option.manualPrice, perChild: 0, perInfant: 0 };
    }

    // Leer pasajeros desde el desglose embebido en la opción (guardado por handleSave)
    // o desde los campos directos de la cotización si existen, o desde passengers total como fallback
    const nAdult = parseInt(option._paxAdult) || parseInt(quoteData.passengersAdult) || parseInt(quoteData.passengers) || 1;
    const nChild = parseInt(option._paxChild) || parseInt(quoteData.passengersChild) || 0;
    const nInfant = parseInt(option._paxInfant) || parseInt(quoteData.passengersInfant) || 0;

    let totalNet = 0;

    for (const s of option.services) {
      const costAdult = parseFloat(s.data.precioAdulto) || 0;
      const costChild = parseFloat(s.data.precioNino) || parseFloat(s.data.precioNiño) || 0;
      const costInfant = parseFloat(s.data.precioBebe) || 0;
      const costGeneral = parseFloat(s.data.precio) || parseFloat(s.data.precioTotal) || 0;

      if (costAdult > 0 || costChild > 0 || costInfant > 0) {
        // Servicio con desglose por pasajero
        totalNet += costAdult * nAdult + costChild * nChild + costInfant * nInfant;
      } else if (costGeneral > 0) {
        // Servicio con precio único (traslado, asistencia, etc.)
        totalNet += costGeneral;
      }
    }

    const markupVal = parseFloat(option.markup) || 0;
    const factor = 1 + (markupVal / 100);
    const total = totalNet * factor;

    return { 
      total,
      perAdult: total / (nAdult || 1),
      perChild: nChild > 0 ? (total / ((nAdult || 1) + nChild + nInfant)) : 0,
      perInfant: nInfant > 0 ? (total / ((nAdult || 1) + nChild + nInfant)) : 0
    };
};

export default PublicProposal;
