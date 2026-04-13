import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getQuotationById, createQuotation, updateQuotation } from '../supabase/quotations';
import { getSettings } from '../supabase/settings';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, Plus, Plane, Building2, Save, 
  Trash2, Edit2, Globe, Search as SearchIcon, X, ChevronRight, Calendar, ChevronUp, ChevronDown,
  Car, ShieldCheck, Map, Train, Bus, Eye, FileText, ClipboardList, Bed, Link as LinkIcon, Star, User, MapPin, 
  Users, Clock, Ship, Mail, Truck, Anchor, Sparkles, Briefcase
} from 'lucide-react';
import { parsePNR, formatCurrency, formatDate } from '../utils/utils';
import { AIRPORTS } from '../data/airports';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const INITIAL_OPTION = { title: 'Opción 1', description: '', markup: 15, inclusions: '', services: [] };
const TRIP_TYPES = [
  "Vacaciones 🏖️", "Trabajo 💼", "Luna de Miel ❤️", "Safari & Naturaleza 🦁", 
  "Aventura & Trekking 🏔️", "Crucero de Lujo 🚢", "Wellness & Retiro 🧘", 
  "Corporativo / MICE 💼", "Grupos a Medida 👨‍👩‍👧‍👦", "Gastronómico & Vinos 🍷", 
  "Viaje de Bodas 💍", "Ecoturismo Sostenible 🍃"
];

const HOTEL_REGIMENS = ["Sólo Alojamiento", "Desayuno Incluido", "Media Pensión (MAP)", "Pensión Completa (FAP)", "All Inclusive"];
const ROOM_TYPES = ["Estándar", "Superior", "Deluxe", "Junior Suite", "Suite", "Familiar", "Villa", "Bungalow"];

const TRANSFER_TYPES = [
  { name: 'Privado', icon: <User size={16} /> },
  { name: 'Regular (SIC)', icon: <Users size={16} /> },
  { name: 'Lujo / VIP', icon: <Star size={16} /> },
  { name: 'Chofer 4hs', icon: <Clock size={16} /> },
  { name: 'Chofer 8hs', icon: <Clock size={16} /> },
  { name: 'Ferry / Barco', icon: <Ship size={16} /> },
  { name: 'Tren', icon: <Train size={16} /> }
];

const ASSISTANCE_COMPANIES = [
  "Urban Global Travel", "Universal Assistance", "Assist Card", "Tarjeta Celeste", "Mapfre", "Coris", "Pax Assistance"
];

const AUTO_BRANDS = ["Hertz","Avis","Sixt","Europcar","Budget","Enterprise","Alamo","Goldcar","Localiza","Movida"];
const AUTO_CATEGORIES = ["Economy","Compacto","Intermedio","Estándar","SUV","Minivan","Lujo","Premium","Convertible"];
const ASSISTANCE_PLANS = [
  "Medica y no medica USD 5 Millones", "Medica USD 5 Millones", "$60.000", "$100.000", "$150.000", "Euro-Schengen"
];

// --- HELPERS GLOBALES ---

const renderServiceIcon = (type, size = 18) => {
   switch(type) {
      case 'vuelo': return <Plane size={size} />;
      case 'hotel': return <Bed size={size} />;
      case 'traslado': return <Bus size={size} />;
      case 'asistencia': return <ShieldCheck size={size} />;
      case 'actividad': return <Map size={size} />;
      case 'auto': return <Car size={size} />;
      case 'tren': return <Train size={size} />;
      default: return <Plus size={size} />;
   }
};

// --- COMPONENTES DE PREVISUALIZACIÓN PDF (Diseño Original Voraz) ---

// --- COMPONENTES DE PREVISUALIZACIÓN PDF (Diseño Original Voraz) ---

const BrandedHeader = ({ formData, settings }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '3.5rem', marginBottom: '2.5rem' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
       <div style={{ height: '120px' }}><img src={settings?.logoUrlWhite || "/logo blanco.png"} alt="VORAZ" style={{ height: '100%', width: 'auto' }} /></div>
       {formData.fileNumber && (
          <div style={{ fontSize: '11px', fontWeight: 950, color: '#0F172A', letterSpacing: '2px', textTransform: 'uppercase', backgroundColor: '#f8fafc', padding: '6px 14px', borderRadius: '4px', border: '1px solid #e2e8f0', alignSelf: 'flex-start' }}>FILE / {formData.fileNumber}</div>
       )}
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: '38px', fontWeight: 950, letterSpacing: '-1.5px', color: '#0F172A', textTransform: 'uppercase', lineHeight: '1.1' }}>{formData.tripName || 'Propuesta de Viaje'}</div>
      <div style={{ fontSize: '16px', fontWeight: 700, color: '#475569', marginTop: '10px' }}>{formData.customerName}</div>
      <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px' }}>
        {formData.tripType.toUpperCase()} • {formData.passengersAdult || 0} ADT {formData.passengersChild > 0 && `• ${formData.passengersChild} CHD`} {formData.passengersInfant > 0 && `• ${formData.passengersInfant} INF`} • {formData.nights} NOCHES
      </div>
    </div>
  </div>
);

const ProposalContent = ({ option, formData, calculateTotals, settings, allOptions = false }) => {
   const optionsToRender = allOptions ? formData.options : [option];

   return (
      <div id="preview-content" style={{ backgroundColor: '#fff', color: '#0F172A', fontFamily: "'Inter', sans-serif", width: '1000px', margin: '0 auto', padding: '40px' }}>
         <div className="pdf-header-container">
            <BrandedHeader formData={formData} settings={settings} />
         </div>

         {/* RECORRIDO DE OPCIONES */}
         {optionsToRender.map((opt, optIdx) => {
            const stats = calculateTotals(opt);
            return (
               <div key={optIdx} className="pdf-option-container" style={{ marginBottom: '4rem', padding: '3.5rem', backgroundColor: '#fff' }}>
                  <div className="pdf-option-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #0F172A', paddingBottom: '1.5rem', marginBottom: '3rem' }}>
                     <div>
                        <div style={{ fontSize: '12px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '4px' }}>Propuesta de Viaje</div>
                        <div style={{ fontSize: '32px', fontWeight: 950 }}>{opt.title}</div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Inversión por Pax</div>
                        <div style={{ fontSize: '28px', fontWeight: 950, color: '#0F172A' }}>{formatCurrency(stats.perPassenger)}</div>
                     </div>
                   </div>
 
                   {opt.inclusions && (
                      <div className="pdf-inclusions-container" style={{ marginBottom: '3rem', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                         <div style={{ fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={14} color="#c5a059" /> Resumen del paquete
                         </div>
                         <div style={{ fontSize: '14px', color: '#1E293B', lineHeight: '1.6', fontWeight: 500, whiteSpace: 'pre-line' }}>
                            {opt.inclusions}
                         </div>
                      </div>
                   )}
 
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                     {opt.services.map((s, idx) => (
                        <div key={idx} className="pdf-service-item" style={{ borderLeft: '4px solid #f1f5f9', paddingLeft: '2rem', position: 'relative' }}>
                           <div style={{ position: 'absolute', left: '-4px', top: '0', width: '4px', height: '30px', backgroundColor: '#0F172A' }}></div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 950, textTransform: 'uppercase', marginBottom: '15px', color: '#64748b', letterSpacing: '1px' }}>
                              {renderServiceIcon(s.type, 14)} {s.type}
                           </div>

                           {s.type === 'vuelo' && (() => {
                              const flights = parsePNR(s.data.pnr_raw);
                              return (
                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                                       <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                                          <thead>
                                             <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                                <th style={{ padding: '12px 20px', color: '#64748b', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase' }}>FECHA</th>
                                                <th style={{ padding: '12px 20px', color: '#64748b', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase' }}>VUELO</th>
                                                <th style={{ padding: '12px 20px', color: '#64748b', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase' }}>TRAMO</th>
                                                <th style={{ padding: '12px 20px', color: '#64748b', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', textAlign: 'right' }}>HORARIOS</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {flights?.map((f, fi) => (
                                                <tr key={fi} style={{ borderBottom: fi === flights.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                                                   <td style={{ padding: '15px 20px', fontWeight: 900 }}>{f.dateFriendly}</td>
                                                   <td style={{ padding: '15px 20px' }}><strong>{f.airline}</strong><br/><span style={{ fontSize: '9px', color: '#64748b' }}>{f.flightNumber}</span></td>
                                                   <td style={{ padding: '15px 20px' }}><strong>{f.departureIata} ➔ {f.arrivalIata}</strong><br/><span style={{ fontSize: '9px', color: '#64748b' }}>{f.departureCity} a {f.arrivalCity}</span></td>
                                                   <td style={{ padding: '15px 20px', textAlign: 'right' }}><strong>{f.departureTimeFormatted} ➔ {f.arrivalTimeFormatted}</strong></td>
                                                </tr>
                                             ))}
                                          </tbody>
                                       </table>
                                    </div>
                                    {s.data.equipaje && (
                                       <div style={{ marginTop: '10px', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', border: '1px dashed #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                          <Briefcase size={12} color="#64748b" />
                                          <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>{s.data.equipaje}</span>
                                       </div>
                                    )}
                                 </div>
                              );
                           })()}

                           {s.type === 'hotel' && (
                              <div style={{ display: 'flex', gap: '2rem' }}>
                                 <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                       <strong style={{ fontSize: '20px' }}>{s.data.nombre}</strong>
                                       <div style={{ display: 'flex', color: '#fbbf24' }}>{Array.from({ length: parseInt(s.data.rating) || 0 }).map((_, r) => <Star key={r} size={12} fill="#fbbf24" />)}</div>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, marginBottom: '15px' }}>{s.data.ubicacion}</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                                       <div><span style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8' }}>ESTANCIA</span><div style={{ fontSize: '11px', fontWeight: 800 }}>{formatDate(s.data.checkin)} al {formatDate(s.data.checkout)}</div></div>
                                       <div><span style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8' }}>HABITACIÓN</span><div style={{ fontSize: '11px', fontWeight: 800 }}>{s.data.tipoHab}</div></div>
                                       <div><span style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8' }}>RÉGIMEN</span><div style={{ fontSize: '11px', fontWeight: 800 }}>{s.data.regimen}</div></div>
                                    </div>
                                 </div>
                                 {s.data.image && <img src={s.data.image} style={{ width: '180px', height: '120px', borderRadius: '12px', objectFit: 'cover' }} />}
                              </div>
                           )}

                           {s.type === 'auto' && (
                              <div style={{ display: 'flex', gap: '2rem' }}>
                                 <div style={{ flex: 1 }}>
                                    <strong style={{ fontSize: '18px' }}>{s.data.modelo}</strong>
                                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, marginBottom: '10px' }}>{s.data.compania}</div>
                                    <div style={{ fontSize: '11px', color: '#475569' }}>• Retiro: {s.data.retiro} ({s.data.horaRetiro})</div>
                                    <div style={{ fontSize: '11px', color: '#475569' }}>• Devolución: {s.data.devolucion} ({s.data.horaDevolucion})</div>
                                 </div>
                                 {s.data.image && <img src={s.data.image} style={{ width: '160px', height: '100px', borderRadius: '12px', objectFit: 'cover' }} />}
                              </div>
                           )}

                           {(s.type === 'asistencia' || s.type === 'traslado') && (
                              <div style={{ backgroundColor: '#f8fafc', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <div><div style={{ fontWeight: 900, fontSize: '14px' }}>{s.data.compania || s.data.tipo || 'Servicio'}</div><div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>{s.data.plan || s.data.ruta}</div></div>
                                 {renderServiceIcon(s.type, 24)}
                              </div>
                           )}

                           {s.type === 'actividad' && (
                              <div style={{ display: 'flex', gap: '2rem' }}>
                                 <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, marginBottom: '4px' }}>{formatDate(s.data.fecha)}</div>
                                    <strong style={{ fontSize: '18px', display: 'block', marginBottom: '8px' }}>{s.data.nombre}</strong>
                                    <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>{s.data.descripcion}</div>
                                 </div>
                                 {s.data.image && <img src={s.data.image} style={{ width: '160px', height: '110px', borderRadius: '12px', objectFit: 'cover' }} />}
                              </div>
                           )}

                           {(s.type === 'tren' || s.type === 'ferry' || s.type === 'bus' || s.type === 'catamaran') && (
                              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                                 <div style={{ backgroundColor: '#fcfcfc', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontWeight: 950, fontSize: '13px' }}>{s.data.ruta}</div>
                                    <div style={{ fontSize: '9px', fontWeight: 950, color: '#64748b', textTransform: 'uppercase' }}>{s.data.compania}</div>
                                 </div>
                                 <div style={{ padding: '15px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <div><span style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8' }}>FECHA / HORA</span><div style={{ fontSize: '11px', fontWeight: 800 }}>{formatDate(s.data.fecha)} {s.data.hora} HS</div></div>
                                    <div><span style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8' }}>CLASE / TIPO</span><div style={{ fontSize: '11px', fontWeight: 800 }}>{s.data.clase}</div></div>
                                    {s.data.numeroTren && <div><span style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8' }}>REFERENCIA</span><div style={{ fontSize: '11px', fontWeight: 800 }}>{s.data.numeroTren}</div></div>}
                                 </div>
                              </div>
                           )}

                           {s.type === 'otros' && (
                              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fffdf5' }}>
                                 <div>
                                    <div style={{ fontSize: '16px', fontWeight: 950 }}>{s.data.servicio}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{s.data.descripcion}</div>
                                 </div>
                                 <Sparkles size={24} color="#c5a059" />
                              </div>
                           )}
                        </div>
                     ))}
                  </div>

                  {/* TOTAL DE LA OPCIÓN */}
                  <div className="pdf-option-footer" style={{ marginTop: '4rem', padding: '30px', backgroundColor: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', gap: '2rem' }}>
                        <div>
                           <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900 }}>ADT</div>
                           <div style={{ fontSize: '20px', fontWeight: 950 }}>{formatCurrency(stats.perAdult)}</div>
                        </div>
                        {formData.passengersChild > 0 && (
                           <div>
                              <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900 }}>CHD</div>
                              <div style={{ fontSize: '20px', fontWeight: 950 }}>{formatCurrency(stats.perChild)}</div>
                           </div>
                        )}
                        {formData.passengersInfant > 0 && (
                           <div>
                              <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 900 }}>INF</div>
                              <div style={{ fontSize: '20px', fontWeight: 950 }}>{formatCurrency(stats.perInfant)}</div>
                           </div>
                        )}
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 900 }}>INVERSIÓN TOTAL ({(formData.passengersAdult || 0) + (formData.passengersChild || 0) + (formData.passengersInfant || 0)} PAX)</div>
                        <div style={{ fontSize: '28px', fontWeight: 950, color: '#0F172A' }}>{formatCurrency(stats.total)}</div>
                     </div>
                  </div>
               </div>
            );
         })}

         {/* CIERRE UNIFICADO (SÓLO AL FINAL) */}
         <div className="pdf-footer-container" style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '2px solid #0F172A', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 900, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '30px' }}>Contacto & Reservas</div>
            <div style={{ fontSize: '28px', fontWeight: 950, marginBottom: '10px' }}>{settings?.agentName || 'Federico Espeleta'}</div>
            <div style={{ fontSize: '18px', color: '#c5a059', fontWeight: 700, marginBottom: '30px' }}>{settings?.agencyName || 'VORAZ'}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', fontSize: '13px', color: '#94a3b8' }}>
               <span>{settings?.agentWhatsApp || '+598 98 199 677'}</span>
               <span>{settings?.agentEmail || 'fespeleta@voraz.com.uy'}</span>
               <span style={{ color: '#0F172A', fontWeight: 800 }}>www.voraz.com.uy</span>
            </div>
            <div style={{ marginTop: '5rem', fontSize: '10px', color: '#94a3b8', textAlign: 'justify', borderTop: '1px solid #f1f5f9', paddingTop: '3rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
               <div style={{ fontWeight: 950, color: '#475569', marginBottom: '10px', textTransform: 'uppercase' }}>Términos y Condiciones</div>
               {settings?.termsAndConditions || `• Las tarifas están expresadas en dólares americanos (USD) por persona, sujetas a cambios de disponibilidad y precio al momento de la confirmación de la reserva.
• Los pasajes aéreos, una vez emitidos, no permiten cambios ni devoluciones y son intransferibles.
• Es responsabilidad del viajero contar con toda la documentación necesaria (pasaportes, visas, vacunas) vigente para el destino seleccionado.`}
            </div>
         </div>
      </div>
   );
};


// --- COMPONENTE PRINCIPAL QuotationForm ---

const QuotationForm = ({ quoteId, onBack }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewAllOpts, setPreviewAllOpts] = useState(false);
  const searchRef = useRef(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    tripName: '',
    fileNumber: '',
    status: 'BORRADOR',
    destinations: [],
    startDate: '',
    endDate: '',
    nights: '',
    passengersAdult: 2,
    passengersChild: 0,
    passengersInfant: 0,
    tripType: 'Vacaciones 🏖️',
    options: [INITIAL_OPTION]
  });

  const [activeOptionIdx, setActiveOptionIdx] = useState(0);

  const results = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return AIRPORTS.filter(a => 
        a.iata.toLowerCase().startsWith(q) || 
        a.city.toLowerCase().startsWith(q) ||
        a.city.toLowerCase().includes(q) ||
        a.country.toLowerCase().startsWith(q)
    ).slice(0, 10);
  }, [searchQuery]);

  useEffect(() => {
    getSettings().then(sets => {
       if (sets) {
          setSettings(sets);
          if (!quoteId) {
             setFormData(prev => ({
                ...prev,
                options: prev.options.map(o => ({ ...o, markup: sets.defaultMarkup || 15 }))
             }));
          }
       }
    });

    if (quoteId) {
      setLoading(true);
      getQuotationById(quoteId).then(data => { 
        if (data) {
          // Recuperar el desglose de pasajeros desde el JSON embebido en las opciones
          const firstOpt = data.options?.[0];
          const passengersAdult = firstOpt?._paxAdult ?? parseInt(data.passengers) ?? 2;
          const passengersChild = firstOpt?._paxChild ?? 0;
          const passengersInfant = firstOpt?._paxInfant ?? 0;
          setFormData({ ...data, passengersAdult, passengersChild, passengersInfant });
        }
        setLoading(false); 
      });
    }
  }, [quoteId]);

  const selectDestination = (dest) => { 
    if (!dest) return;
    if (formData.destinations.some(d => d.iata === dest.iata)) {
      setSearchQuery('');
      setShowResults(false);
      return;
    }
    setFormData(prev => ({ ...prev, destinations: [...prev.destinations, dest] })); 
    setSearchQuery(''); 
    setShowResults(false); 
    setFocusedIdx(0);
  };

  const removeDestination = (iata) => {
    setFormData(prev => ({ ...prev, destinations: prev.destinations.filter(d => d.iata !== iata) }));
  };

  const handleKeyDown = (e) => {
    if (showResults && results.length > 0) {
        if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIdx(prev => (prev + 1) % results.length); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIdx(prev => (prev - 1 + results.length) % results.length); }
        else if (e.key === 'Enter' || e.key === 'Tab') { selectDestination(results[focusedIdx]); }
        else if (e.key === 'Escape') { setShowResults(false); }
    }
  };

  const addOption = () => {
    const newOptions = [...formData.options, { ...INITIAL_OPTION, title: `Opción ${formData.options.length + 1}`, services: [] }];
    setFormData(prev => ({ ...prev, options: newOptions }));
    setActiveOptionIdx(formData.options.length);
  };

  const copyOption = () => {
    const optionToCopy = formData.options[activeOptionIdx];
    const clonedServices = optionToCopy.services.map(s => ({
      ...s,
      id: Date.now() + Math.random(),
      data: { ...s.data }
    }));
    
    const newOptions = [...formData.options, { 
      ...optionToCopy, 
      title: `${optionToCopy.title} (Copia)`, 
      services: clonedServices 
    }];
    
    setFormData(prev => ({ ...prev, options: newOptions }));
    setActiveOptionIdx(newOptions.length - 1);
  };

  const removeOption = (idx) => {
    if (formData.options.length <= 1) {
      alert("La cotización debe tener al menos una opción.");
      return;
    }
    if (window.confirm(`¿Seguro quieres borrar la "${formData.options[idx].title}"?`)) {
      const newOptions = formData.options.filter((_, i) => i !== idx);
      setFormData(prev => ({ ...prev, options: newOptions }));
      // Ajustamos el índice activo para que no quede huérfano
      if (activeOptionIdx >= newOptions.length) {
        setActiveOptionIdx(newOptions.length - 1);
      } else if (activeOptionIdx === idx && idx > 0) {
        setActiveOptionIdx(idx - 1);
      }
    }
  };

  const addService = (type) => {
    const newOptions = [...formData.options];
    const newService = { id: Date.now(), type, data: {} };
    if (type === 'vuelo') newService.data = { aerolinea: '', ruta: '', pnr_raw: '', precio: 0, equipaje: '' };
    else if (type === 'hotel') newService.data = { nombre: '', ubicacion: '', regimen: 'Desayuno Incluido', tipoHab: 'Estándar', checkin: '', checkout: '', noches: 1, precioTotal: 0, link: '', image: '', rating: '5' };
    else if (type === 'traslado') newService.data = { tipo: 'Privado', ruta: '', precio: 0 };
    else if (type === 'asistencia') newService.data = { compania: 'Urban Global Travel', plan: 'Medica y no medica USD 5 Millones', precio: 0 };
    else if (type === 'actividad') newService.data = { nombre: '', fecha: '', descripcion: '', link: '', image: '', precio: 0 };
    else if (type === 'auto') newService.data = { modelo: '', compania: '', precio: 0 };
    else if (type === 'tren') newService.data = { ruta: '', clase: 'Primera', precio: 0 };
    else if (type === 'ferry') newService.data = { ruta: '', compania: '', clase: 'Turista', precio: 0 };
    else if (type === 'motorhome') newService.data = { modelo: '', compania: '', pickUp: '', dropOff: '', startDate: '', endDate: '', precio: 0 };
    else if (type === 'bus') newService.data = { ruta: '', compania: '', clase: 'Semicama', fecha: '', hora: '', precio: 0 };
    else if (type === 'catamaran') newService.data = { ruta: '', compania: '', clase: 'Standard', fecha: '', hora: '', precio: 0 };
    else if (type === 'otros') newService.data = { servicio: '', descripcion: '', precio: 0 };
    else newService.data = { descripcion: '', precio: 0 };
    newOptions[activeOptionIdx].services.push(newService);
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

   const updateService = (idx, field, value) => {
    const newOptions = [...formData.options];
    const isPrice = ['precio', 'precioTotal', 'markup', 'precioAdulto', 'precioNino', 'precioBebe'].includes(field);
    newOptions[activeOptionIdx].services[idx].data[field] = isPrice ? (parseFloat(value) || 0) : value;
    
    if (newOptions[activeOptionIdx].services[idx].type === 'hotel') {
        const d = newOptions[activeOptionIdx].services[idx].data;
        if (d.checkin && d.checkout) {
            const diff = Math.round((new Date(d.checkout) - new Date(d.checkin)) / 86400000);
            newOptions[activeOptionIdx].services[idx].data.noches = diff > 0 ? diff : 0;
        }
    }
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const removeService = (idx) => {
    const n = [...formData.options];
    n[activeOptionIdx].services.splice(idx, 1);
    setFormData({...formData, options: n});
  };

  const moveService = (idx, direction) => {
    const n = [...formData.options];
    const services = [...n[activeOptionIdx].services];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= services.length) return;
    const [moved] = services.splice(idx, 1);
    services.splice(targetIdx, 0, moved);
    n[activeOptionIdx].services = services;
    setFormData({...formData, options: n});
  };

   const calculateTotals = (option) => {
     if (!option || !option.services) return { total: 0, totalNet: 0, perPassenger: 0, perAdult: 0, perChild: 0, perInfant: 0 };
     
     const nAdult = parseInt(formData.passengersAdult) || 0;
     const nChild = parseInt(formData.passengersChild) || 0;
     const nInfant = parseInt(formData.passengersInfant) || 0;
     const totalPax = nAdult + nChild + nInfant;
 
     if (option.manualPrice && option.manualPrice > 0) {
       return { total: option.manualPrice, totalNet: option.manualPrice, perPassenger: option.manualPrice / (totalPax || 1), perAdult: option.manualPrice / (nAdult || 1), perChild: 0, perInfant: 0 };
     }
 
     let netAdult = 0;
     let netChild = 0;
     let netInfant = 0;
     let netShared = 0;
 
     for (const s of option.services) {
       const costAdult = parseFloat(s.data.precioAdulto) || 0;
       const costChild = parseFloat(s.data.precioNino) || parseFloat(s.data.precioNiño) || 0;
       const costInfant = parseFloat(s.data.precioBebe) || 0;
       const costGeneral = parseFloat(s.data.precio) || parseFloat(s.data.precioTotal) || 0;
 
       netAdult += costAdult;
       netChild += costChild;
       netInfant += costInfant;
       netShared += costGeneral;
     }
 
     const markupVal = parseFloat(option.markup) || 0;
     const factor = 1 + (markupVal / 100);
     const sharedPerPax = netShared / (totalPax || 1);
 
     const priceAdult = (netAdult + sharedPerPax) * factor;
     const priceChild = (netChild + sharedPerPax) * factor;
     const priceInfant = (netInfant + sharedPerPax) * factor;
     
     const total = (priceAdult * nAdult) + (priceChild * nChild) + (priceInfant * nInfant);
     const totalNet = (netAdult * nAdult) + (netChild * nChild) + (netInfant * nInfant) + netShared;
 
     return { 
       total,
       totalNet,
       perPassenger: total / (totalPax || 1),
       perAdult: priceAdult,
       perChild: priceChild,
       perInfant: priceInfant
     };
   };

  const generateAutoInclusions = (option) => {
    if (!option.services || option.services.length === 0) return "";
    const items = [];
    
    // Vuelos
    const flights = option.services.filter(s => s.type === 'vuelo');
    if (flights.length > 0) {
      const hasBaggage = flights.some(f => f.data.equipaje && f.data.equipaje.toLowerCase().includes('incli') || f.data.equipaje.toLowerCase().includes('kg'));
      items.push(`• Pasajes aéreos ${hasBaggage ? 'con equipaje incluido' : 'en tarifa básica'}`);
    }
  
    // Hoteles
    const hotels = option.services.filter(s => s.type === 'hotel');
    hotels.forEach(h => {
      items.push(`• ${h.data.noches || 0} noches en ${h.data.nombre || 'Hotel'} (${h.data.regimen || 'Desayuno'})`);
    });
  
    // Traslados
    const transfers = option.services.filter(s => s.type === 'traslado');
    if (transfers.length > 0) {
      const types = [...new Set(transfers.map(t => t.data.tipo))];
      items.push(`• Traslados ${types.join(' y ')}`);
    }
  
    // Asistencia
    const assistance = option.services.filter(s => s.type === 'asistencia');
    if (assistance.length > 0) {
      items.push(`• Asistencia al viajero ${assistance[0].data.compania ? `(${assistance[0].data.compania})` : ''}`);
    }
  
    // Actividades
    const activities = option.services.filter(s => s.type === 'actividad');
    if (activities.length > 0) {
      items.push(`• Excursiones y actividades mencionadas`);
    }
  
    // Autos
    const cars = option.services.filter(s => s.type === 'auto');
    cars.forEach(c => {
      items.push(`• Alquiler de auto ${c.data.modelo} (${c.data.compania})`);
    });

    // Otros transportes
    const otherPlat = option.services.filter(s => ['tren', 'ferry', 'bus', 'catamaran', 'motorhome'].includes(s.type));
    if (otherPlat.length > 0) {
        items.push(`• Tickets de transporte interno según itinerario`);
    }
  
    return items.join('\n');
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Embeber el desglose de pasajeros dentro de cada opción (el campo `options` sí es JSONB)
      const optionsWithPax = (formData.options || []).map(opt => ({
        ...opt,
        _paxAdult: parseInt(formData.passengersAdult) || 0,
        _paxChild: parseInt(formData.passengersChild) || 0,
        _paxInfant: parseInt(formData.passengersInfant) || 0,
      }));

      // Excluir campos que no existen como columnas en Supabase
      const { id, created_at, passengersAdult, passengersChild, passengersInfant, options: _orig, ...cleanData } = formData;
      const totalPax = (parseInt(formData.passengersAdult) || 0) + (parseInt(formData.passengersChild) || 0) + (parseInt(formData.passengersInfant) || 0);
      
      const payload = { 
        ...cleanData, 
        options: optionsWithPax,
        passengers: totalPax,
        user_id: user.id 
      };

      if (quoteId) await updateQuotation(quoteId, payload);
      else await createQuotation(payload);
      onBack();
    } catch (e) { 
      console.error("Save Error:", e);
      alert("Error al guardar: " + e.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const generatePDF = async (allOptions = false) => {
    setPreviewAllOpts(allOptions);
    setPreviewMode(true);
    setLoading(true);
    const printAll = allOptions === true;
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const element = document.getElementById('preview-content');
    if (!element) { setLoading(false); return; }

    const originalStyle = element.style.cssText;
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const sideMargin = 10; // Margen lateral en mm
      const innerWidth = 210 - (sideMargin * 2); // 190mm de ancho útil
      const pageHeight = 297;
      const topMargin = 15;
      let currentY = topMargin;

      // Función para añadir un elemento al PDF con control de salto de página
      const addElementToPDF = async (el, isFirst = false) => {
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, windowWidth: 1000, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const elHeight = (canvas.height * innerWidth) / canvas.width;

        if (currentY + elHeight > pageHeight - topMargin && !isFirst) {
          pdf.addPage();
          currentY = topMargin;
        }

        pdf.addImage(imgData, 'JPEG', sideMargin, currentY, innerWidth, elHeight);
        currentY += elHeight + 5; // Un pequeño respiro entre bloques
      };

      // 1. Capturar Header
      const header = element.querySelector('.pdf-header-container');
      if (header) await addElementToPDF(header, true);

      // 2. Capturar cada Bloque de Opción y sus servicios
      const optionBlocks = element.querySelectorAll('.pdf-option-container');
      for (const opt of optionBlocks) {
        // Título de la opción
        const optHeader = opt.querySelector('.pdf-option-header');
        if (optHeader) await addElementToPDF(optHeader);

        // Resumen de inclusiones
        const inclusions = opt.querySelector('.pdf-inclusions-container');
        if (inclusions) await addElementToPDF(inclusions);

        // Cada servicio de la opción
        const services = opt.querySelectorAll('.pdf-service-item');
        for (const s of services) {
          await addElementToPDF(s);
        }

        // Totales de la opción
        const totals = opt.querySelector('.pdf-option-footer');
        if (totals) await addElementToPDF(totals);
      }

      // 3. Capturar Cierre
      const footer = element.querySelector('.pdf-footer-container');
      if (footer) await addElementToPDF(footer);

      const fileName = printAll ? `Propuesta_Voraz_Completa_${formData.tripName || 'Viaje'}.pdf` : `Cotizacion_Voraz_${formData.tripName || 'Propuesta'}.pdf`;
      pdf.save(fileName);
    } catch (error) { 
      console.error('PDF Error:', error); 
    } finally {
      element.style.cssText = originalStyle;
      setLoading(false); 
      setPreviewMode(false);
      setPreviewAllOpts(false);
    }
  };


  const handleSendEmail = () => {
    const hour = new Date().getHours();
    let greeting = "Hola";
    if (hour >= 5 && hour < 12) greeting = "Buenos días";
    else if (hour >= 12 && hour < 20) greeting = "Buenas tardes";
    else greeting = "Buenas noches";

    const proposalUrl = `${window.location.origin}${window.location.pathname}?proposal=${quoteId}`;
    
    const subject = encodeURIComponent(`Nuestra propuesta de viaje Voraz - ${formData.tripName || 'Itinerario'}`);
    const body = encodeURIComponent(
      `${greeting} ${formData.customerName || 'viajero/a'},\n\n` +
      `Es un gusto saludarte. Hemos diseñado una experiencia web interactiva exclusivamente para tu viaje a ${formData.tripName}.\n\n` +
      `Puedes ver todos los detalles, fotos e itinerario aquí:\n${proposalUrl}\n\n` +
      `Quedo a tu disposición para cualquier duda o ajuste que desees realizar.\n\n` +
      `¡Saludos!\n\n` +
      `Federico Espeleta`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const currentOption = formData.options && formData.options.length > 0 ? formData.options[activeOptionIdx] : INITIAL_OPTION;
  const currentStats = calculateTotals(currentOption);

  return (
    <div className="quotation-form-container" style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '1.5rem 3rem' }}>
      
      {/* HEADER DE ACCIONES ORIGINAL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><ArrowLeft size={20}/></button>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
               Propuesta Voraz <span style={{ color: '#cbd5e1' }}>•</span> {formData.tripName || 'Vacaciones'}
            </h2>
         </div>
         <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { setPreviewAllOpts(false); setPreviewMode(true); }} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '13px' }}><Eye size={16}/> Vista Previa</button>
            <button onClick={handleSave} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '13px' }}><Save size={16}/> Guardar</button>
            <button onClick={handleSendEmail} className="btn" style={{ padding: '0.5rem 1.25rem', fontSize: '13px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16}/> Mail</button>
            <button onClick={() => generatePDF(false)} className="btn" style={{ padding: '0.5rem 1.25rem', fontSize: '13px', backgroundColor: '#64748b', color: '#fff' }}><FileText size={16}/> PDF</button>
            <button onClick={() => generatePDF(true)} className="btn" style={{ padding: '0.5rem 1.25rem', fontSize: '13px', backgroundColor: '#0F172A', color: '#fff' }}><ClipboardList size={16}/> PDF Todas</button>
         </div>
      </div>

      {/* SECCIÓN DE INFORMACIÓN GENERAL (DOS COLUMNAS) */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem' }}>
            
            {/* COLUMNA IZQUIERDA: GESTIÓN Y PASAJERO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ClipboardList size={18} style={{ color: '#94a3b8' }}/> Gestión y Pasajero
               </h3>
               
               <div className="form-group">
                  <label className="form-label">Estado comercial</label>
                  <select className="form-select" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ backgroundColor: '#f0f9ff', color: '#0369a1', borderColor: '#bae6fd', fontWeight: 900 }}>
                     <option value="BORRADOR">🔵 BORRADOR</option>
                     <option value="ENVIADA">🟢 ENVIADA</option>
                     <option value="ACEPTADA">🟡 ACEPTADA</option>
                     <option value="CANCELADA">🔴 CANCELADA</option>
                  </select>
               </div>

               <div className="form-group"><label className="form-label">Nombre del Viaje</label><input value={formData.tripName} onChange={(e) => setFormData({...formData, tripName: e.target.value})} placeholder="Vacaciones a Mexico" /></div>
               <div className="form-group"><label className="form-label">Número de File</label><input value={formData.fileNumber} onChange={(e) => setFormData({...formData, fileNumber: e.target.value})} placeholder="EJ: 4040" /></div>
               <div className="form-group"><label className="form-label">Nombre del Cliente</label><input value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} placeholder="Nombre completo" /></div>
               <div className="form-group"><label className="form-label">WhatsApp</label><input value={formData.customerPhone} onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} placeholder="+598 00 000 000" /></div>
            </div>

            {/* COLUMNA DERECHA: ITINERARIO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Globe size={18} style={{ color: '#94a3b8' }}/> Itinerario
               </h3>

               <div className="form-group" style={{ position: 'relative' }} ref={searchRef}>
                  <label className="form-label">Destinos</label>
                  <div style={{ position: 'relative' }}>
                     <input className="form-input-search" placeholder="🔍 Buscar IATA o Ciudad..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }} onKeyDown={handleKeyDown} />
                  </div>
                  {showResults && results && results.length > 0 && (
                     <div className="glass-card" style={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 100, border: '1px solid #e2e8f0', borderRadius: '12px', marginTop: '5px' }}>
                        {results.map((a, i) => (
                           <div key={a.iata} onClick={() => selectDestination(a)} style={{ padding: '0.75rem 1.25rem', cursor: 'pointer', backgroundColor: focusedIdx === i ? '#f8fafc' : '#fff' }}><strong>{a.city}</strong> ({a.iata})</div>
                        ))}
                     </div>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                     {(formData.destinations || []).map(d => (
                        <span key={d.iata} style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e2e8f0' }}>{d.iata} <X size={10} style={{ cursor: 'pointer' }} onClick={() => removeDestination(d.iata)}/></span>
                     ))}
                  </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                     <label className="form-label">Experiencia</label>
                     <select className="form-select" value={formData.tripType} onChange={(e) => setFormData({...formData, tripType: e.target.value})}>
                        {TRIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>
                  <div className="form-group"><label className="form-label">Adultos</label><input type="number" min="0" value={formData.passengersAdult} onChange={(e) => setFormData({...formData, passengersAdult: parseInt(e.target.value) || 0})} /></div>
                  <div className="form-group"><label className="form-label">Niños</label><input type="number" min="0" value={formData.passengersChild} onChange={(e) => setFormData({...formData, passengersChild: parseInt(e.target.value) || 0})} /></div>
                  <div className="form-group"><label className="form-label">Bebés</label><input type="number" min="0" value={formData.passengersInfant} onChange={(e) => setFormData({...formData, passengersInfant: parseInt(e.target.value) || 0})} /></div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                     <label className="form-label">Salida</label>
                     <input type="date" value={formData.startDate} onChange={(e) => {
                        const newStart = e.target.value;
                        const nights = parseInt(formData.nights) || 0;
                        let newEnd = formData.endDate;
                        if (newStart && nights > 0) {
                           const d = new Date(newStart + 'T00:00:00');
                           d.setDate(d.getDate() + nights);
                           newEnd = d.toISOString().split('T')[0];
                        }
                        setFormData({...formData, startDate: newStart, endDate: newEnd});
                     }} />
                  </div>
                  <div className="form-group">
                     <label className="form-label">Noches</label>
                     <input type="number" value={formData.nights} onChange={(e) => {
                        const nights = parseInt(e.target.value) || 0;
                        let newEnd = formData.endDate;
                        if (formData.startDate && nights >= 0) {
                           const d = new Date(formData.startDate + 'T00:00:00');
                           d.setDate(d.getDate() + nights);
                           newEnd = d.toISOString().split('T')[0];
                        }
                        setFormData({...formData, nights: e.target.value, endDate: newEnd});
                     }} />
                  </div>
                  <div className="form-group">
                     <label className="form-label">Regreso</label>
                     <input type="date" value={formData.endDate} onChange={(e) => {
                        const newEnd = e.target.value;
                        let newNights = formData.nights;
                        if (formData.startDate && newEnd) {
                           const start = new Date(formData.startDate + 'T00:00:00');
                           const end = new Date(newEnd + 'T00:00:00');
                           const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
                           newNights = diff >= 0 ? diff.toString() : '0';
                        }
                        setFormData({...formData, endDate: newEnd, nights: newNights});
                     }} />
                  </div>
               </div>
            </div>
         </div>

         {/* SELECTOR DE OPCIONES (ABAJO DE LA SECCIÓN GENERAL) */}
         <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {(formData.options || []).map((opt, idx) => (
             <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                   onClick={() => setActiveOptionIdx(idx)}
                   style={{ 
                      padding: '0.6rem 1.5rem', 
                      borderRadius: '8px 0 0 8px', 
                      border: 'none',
                      backgroundColor: activeOptionIdx === idx ? '#0F172A' : 'transparent',
                      color: activeOptionIdx === idx ? '#fff' : '#475569',
                      fontWeight: 900,
                      fontSize: '13px',
                      cursor: 'pointer',
                      borderRight: '1px solid #f1f5f9'
                   }}
                >
                   {opt.title}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeOption(idx); }} 
                  style={{ 
                    padding: '0.6rem 0.8rem', 
                    borderRadius: '0 8px 8px 0', 
                    border: 'none', 
                    backgroundColor: activeOptionIdx === idx ? '#0F172A' : '#f8fafc', 
                    color: activeOptionIdx === idx ? '#94a3b8' : '#cbd5e1', 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = activeOptionIdx === idx ? '#94a3b8' : '#cbd5e1'; }}
                >
                  <Trash2 size={12} />
                </button>
             </div>
            ))}
            <button onClick={addOption} title="Nueva Opción Vacía" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</button>
            <button onClick={copyOption} title="Clonar Opción Actual" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e2e8f0', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={16} /></button>
         </div>
      </div>

      {/* CONSTRUCTOR DE SERVICIOS */}
      <div className="card" style={{ padding: '2.5rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
         <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
               <input 
                  value={currentOption.title} 
                  onChange={(e) => {
                     const n = [...formData.options];
                     n[activeOptionIdx].title = e.target.value;
                     setFormData({...formData, options: n});
                  }}
                  style={{ 
                     fontSize: '1.5rem', 
                     fontWeight: 950, 
                     color: '#0F172A', 
                     letterSpacing: '-0.5px', 
                     border: 'none', 
                     background: 'transparent',
                     padding: '0',
                     width: 'auto',
                     minWidth: '200px',
                     outline: 'none',
                     borderBottom: '2px solid transparent',
                     transition: 'all 0.2s'
                  }} 
                  onFocus={(e) => e.target.style.borderBottomColor = '#cbd5e1'}
                  onBlur={(e) => e.target.style.borderBottomColor = 'transparent'}
                  placeholder="Nombre de la opción..."
               />
                <Edit2 size={16} color="#94a3b8" />
             </div>

             <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                   <label className="form-label" style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 0 }}>
                      ¿Qué incluye este precio? (Mini resumen para el pasajero)
                   </label>
                   <button 
                      onClick={() => {
                         const n = [...formData.options];
                         n[activeOptionIdx].inclusions = generateAutoInclusions(currentOption);
                         setFormData({...formData, options: n});
                      }}
                      style={{ 
                         fontSize: '10px', 
                         fontWeight: 900, 
                         color: '#3b82f6', 
                         backgroundColor: '#eff6ff', 
                         border: '1px solid #dbeafe', 
                         padding: '4px 10px', 
                         borderRadius: '6px', 
                         cursor: 'pointer',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '4px'
                      }}
                   >
                      <Sparkles size={10} /> Auto-generar desde servicios
                   </button>
                </div>
                <textarea 
                   value={currentOption.inclusions || ''} 
                   onChange={(e) => {
                      const n = [...formData.options];
                      n[activeOptionIdx].inclusions = e.target.value;
                      setFormData({...formData, options: n});
                   }}
                   placeholder="Ej: Incluye aéreos con equipaje, 7 noches de hotel con desayuno, todos los traslados y asistencia médica..."
                   style={{ 
                      width: '100%', 
                      minHeight: '80px', 
                      padding: '12px 16px', 
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0', 
                      fontSize: '13px', 
                      lineHeight: '1.5',
                      outline: 'none',
                      transition: 'all 0.2s',
                      resize: 'vertical'
                   }}
                   onFocus={(e) => e.target.style.borderColor = '#0F172A'}
                   onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
             </div>
             
             <div style={{ 
                display: 'flex', 
                gap: '10px', 
                flexWrap: 'wrap',
                padding: '5px'
             }}>
               {[
                  { id: 'vuelo', icon: Plane, label: 'Vuelo' },
                  { id: 'hotel', icon: Bed, label: 'Hotel' },
                  { id: 'auto', icon: Car, label: 'Auto' },
                  { id: 'traslado', icon: Bus, label: 'Traslado' },
                  { id: 'actividad', icon: Map, label: 'Actividad' },
                  { id: 'asistencia', icon: ShieldCheck, label: 'Asistencia' },
                  { id: 'tren', icon: Train, label: 'Tren' },
                  { id: 'ferry', icon: Ship, label: 'Ferry' },
                  { id: 'motorhome', icon: Truck, label: 'Motorhome' },
                  { id: 'bus', icon: Bus, label: 'Bus' },
                  { id: 'catamaran', icon: Anchor, label: 'Catamarán' },
                  { id: 'otros', icon: Sparkles, label: 'Otros' }
               ].map((service) => (
                  <button 
                     key={service.id}
                     onClick={() => addService(service.id)}
                     style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '8px 14px', 
                        borderRadius: '12px', 
                        backgroundColor: '#fff', 
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        fontSize: '12px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                     }}
                     onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0F172A';
                        e.currentTarget.style.color = '#0F172A';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                     }}
                     onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.transform = 'translateY(0)';
                     }}
                  >
                     <service.icon size={14} />
                     {service.label}
                  </button>
               ))}
            </div>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {(currentOption?.services || []).map((s, idx) => (
               <div key={s.id} className="service-editor-card" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', backgroundColor: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)', transition: 'all 0.3s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(15,23,42,0.2)' }}>
                           {renderServiceIcon(s.type, 20)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                           <span style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px' }}>Categoría</span>
                           <span style={{ fontSize: '13px', fontWeight: 950, color: '#0F172A', textTransform: 'uppercase' }}>{s.type}</span>
                        </div>
                     </div>
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => moveService(idx, -1)} style={{ width: '34px', height: '34px', border: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: '10px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronUp size={16}/></button>
                        <button onClick={() => moveService(idx, 1)} style={{ width: '34px', height: '34px', border: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: '10px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronDown size={16}/></button>
                        <button onClick={() => removeService(idx)} style={{ width: '34px', height: '34px', border: '1px solid #fef2f2', background: '#fff1f2', borderRadius: '10px', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fee2e2', cursor: 'pointer' }}><Trash2 size={16}/></button>
                     </div>
                  </div>

                  {/* FORMULARIOS POR TIPO */}
                  <div className="grid-cols-3" style={{ marginBottom: '15px', gap: '10px' }}>
                     <div className="form-group"><label className="form-label" style={{ fontSize: '8px' }}>Costo ADT</label><input type="number" placeholder="USD" value={s.data.precioAdulto || ''} onChange={(e) => updateService(idx, 'precioAdulto', e.target.value)} /></div>
                     <div className="form-group"><label className="form-label" style={{ fontSize: '8px' }}>Costo CHD</label><input type="number" placeholder="USD" value={s.data.precioNino || ''} onChange={(e) => updateService(idx, 'precioNino', e.target.value)} /></div>
                     <div className="form-group"><label className="form-label" style={{ fontSize: '8px' }}>Costo INF</label><input type="number" placeholder="USD" value={s.data.precioBebe || ''} onChange={(e) => updateService(idx, 'precioBebe', e.target.value)} /></div>
                  </div>

                  {s.type === 'vuelo' && (
                     <>
                        <div className="grid-cols-1">
                           <textarea value={s.data.pnr_raw || ''} onChange={(e) => updateService(idx, 'pnr_raw', e.target.value)} placeholder="Pegar PNR aquí..." style={{ minHeight: '100px', fontSize: '11px', fontFamily: 'monospace', backgroundColor: '#f8fafc', padding: '15px' }} />
                        </div>
                        <div className="grid-cols-2" style={{ marginTop: '10px' }}>
                           <input value={s.data.equipaje || ''} onChange={(e) => updateService(idx, 'equipaje', e.target.value)} placeholder="Equipaje (Ej: 23kg + Carry-on)..." />
                           <input type="number" placeholder="Costo General (Shared) USD" value={s.data.precio || ''} onChange={(e) => updateService(idx, 'precio', e.target.value)} />
                        </div>
                     </>
                  )}

                  {s.type === 'hotel' && (
                     <div className="grid-cols-1" style={{ gap: '10px' }}>
                        <div className="grid-cols-2">
                           <input value={s.data.nombre || ''} onChange={(e) => updateService(idx, 'nombre', e.target.value)} placeholder="Hotel..." />
                           <input value={s.data.ubicacion || ''} onChange={(e) => updateService(idx, 'ubicacion', e.target.value)} placeholder="Ubicación/Zona..." />
                        </div>
                        <div className="grid-cols-2">
                           <select className="form-select" value={s.data.tipoHab || 'Estándar'} onChange={(e) => updateService(idx, 'tipoHab', e.target.value)}>
                              {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                           </select>
                           <select className="form-select" value={s.data.regimen || 'Desayuno Incluido'} onChange={(e) => updateService(idx, 'regimen', e.target.value)}>
                              {HOTEL_REGIMENS.map(hr => <option key={hr} value={hr}>{hr}</option>)}
                           </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 80px', gap: '1rem' }}>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Check-in</label>
                              <input type="date" value={s.data.checkin || ''} onChange={(e) => updateService(idx, 'checkin', e.target.value)} />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Check-out</label>
                              <input type="date" value={s.data.checkout || ''} onChange={(e) => updateService(idx, 'checkout', e.target.value)} />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Noches</label>
                              <input type="number" readOnly value={s.data.noches || '0'} style={{ backgroundColor: '#f8fafc', textAlign: 'center' }} />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Estrellas</label>
                              <input type="number" min="1" max="5" value={s.data.rating || '5'} onChange={(e) => updateService(idx, 'rating', e.target.value)} style={{ textAlign: 'center' }} />
                           </div>
                        </div>
                        <div className="grid-cols-2">
                           <input value={s.data.image || ''} onChange={(e) => updateService(idx, 'image', e.target.value)} placeholder="URL Imagen del Hotel..." />
                           <input type="number" placeholder="Costo General (Shared) USD" value={s.data.precio || ''} onChange={(e) => updateService(idx, 'precio', e.target.value)} />
                        </div>
                     </div>
                  )}

                  {s.type === 'auto' && (
                     <div className="grid-cols-1" style={{ gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                           {AUTO_CATEGORIES.map(cat => <div key={cat} onClick={() => updateService(idx, 'modelo', cat)} style={{ flex: '0 0 auto', padding: '5px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', backgroundColor: s.data.modelo === cat ? '#0F172A' : '#f1f5f9', color: s.data.modelo === cat ? '#fff' : '#64748b' }}>{cat}</div>)}
                        </div>
                        <div className="grid-cols-2">
                           <input value={s.data.modelo || ''} onChange={(e) => updateService(idx, 'modelo', e.target.value)} placeholder="Modelo..." />
                           <select className="form-select" value={s.data.compania || ''} onChange={(e) => updateService(idx, 'compania', e.target.value)}>
                               <option value="">Seleccionar Rentadora</option>
                               {AUTO_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                           </select>
                        </div>
                        <div className="grid-cols-2">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Lugar Retiro</label>
                              <input value={s.data.retiro || ''} onChange={(e) => updateService(idx, 'retiro', e.target.value)} placeholder="Ej. Aeropuerto MEX..." />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Hora Retiro</label>
                              <input type="time" value={s.data.horaRetiro || ''} onChange={(e) => updateService(idx, 'horaRetiro', e.target.value)} />
                           </div>
                        </div>
                        <div className="grid-cols-2">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Lugar Devolución</label>
                              <input value={s.data.devolucion || ''} onChange={(e) => updateService(idx, 'devolucion', e.target.value)} placeholder="Ej. Hotel Reforma..." />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Hora Devolución</label>
                              <input type="time" value={s.data.horaDevolucion || ''} onChange={(e) => updateService(idx, 'horaDevolucion', e.target.value)} />
                           </div>
                        </div>
                        <div className="grid-cols-2">
                           <input value={s.data.image || ''} onChange={(e) => updateService(idx, 'image', e.target.value)} placeholder="URL Imagen..." />
                           <input type="number" value={s.data.precio || ''} onChange={(e) => updateService(idx, 'precio', e.target.value)} placeholder="Costo General (Shared) USD..." />
                        </div>
                     </div>
                  )}

                  {s.type === 'traslado' && (
                     <div className="grid-cols-1" style={{ gap: '15px' }}>
                        <div className="grid-cols-2">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Tipo de Servicio</label>
                              <select className="form-select" value={s.data.tipo || 'Privado'} onChange={(e) => updateService(idx, 'tipo', e.target.value)}>
                                 {TRANSFER_TYPES.map(tt => <option key={tt.name} value={tt.name}>{tt.name}</option>)}
                              </select>
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Ruta / Trayecto</label>
                              <input value={s.data.ruta || ''} onChange={(e) => updateService(idx, 'ruta', e.target.value)} placeholder="Ej. Aeropuerto JFK ➔ Hotel Marriott..." />
                           </div>
                        </div>
                        <input type="number" placeholder="Costo General (Shared) USD" value={s.data.precio || ''} onChange={(e) => updateService(idx, 'precio', e.target.value)} />
                     </div>
                  )}

                  {s.type === 'asistencia' && (
                     <div className="grid-cols-1" style={{ gap: '10px' }}>
                        <div className="grid-cols-2">
                           <select className="form-select" value={s.data.compania || 'Urban Global Travel'} onChange={(e) => updateService(idx, 'compania', e.target.value)}>
                              {ASSISTANCE_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                           <select className="form-select" value={s.data.plan || 'Medica y no medica USD 5 Millones'} onChange={(e) => updateService(idx, 'plan', e.target.value)}>
                              {ASSISTANCE_PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                           </select>
                        </div>
                        <input type="number" placeholder="Costo General (Shared) USD" value={s.data.precio || ''} onChange={(e) => updateService(idx, 'precio', e.target.value)} />
                     </div>
                  )}

                  {s.type === 'actividad' && (
                     <div className="grid-cols-1" style={{ gap: '10px' }}>
                        <div className="grid-cols-2">
                           <input value={s.data.nombre || ''} onChange={(e) => updateService(idx, 'nombre', e.target.value)} placeholder="Nombre de Actividad..." />
                           <input type="date" value={s.data.fecha || ''} onChange={(e) => updateService(idx, 'fecha', e.target.value)} title="Fecha" />
                        </div>
                        <div className="grid-cols-1">
                           <input value={s.data.descripcion || ''} onChange={(e) => updateService(idx, 'descripcion', e.target.value)} placeholder="Descripción Breve..." />
                        </div>
                        <div className="grid-cols-2">
                           <input value={s.data.image || ''} onChange={(e) => updateService(idx, 'image', e.target.value)} placeholder="URL Imagen..." />
                           <input type="number" value={s.data.precio || ''} onChange={(e) => updateService(idx, 'precio', e.target.value)} placeholder="Costo General (Shared) USD..." />
                        </div>
                     </div>
                  )}

                  {s.type === 'tren' && (
                     <div className="grid-cols-1" style={{ gap: '10px' }}>
                        <div className="grid-cols-2">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Trayecto</label>
                              <input value={s.data.ruta || ''} onChange={(e) => updateService(idx, 'ruta', e.target.value)} placeholder="Ej. Madrid - Barcelona..." />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Clase</label>
                              <select className="form-select" value={s.data.clase || 'Primera'} onChange={(e) => updateService(idx, 'clase', e.target.value)}>
                                 <option value="Turista">Turista</option>
                                 <option value="Primera">Primera</option>
                                 <option value="Business">Business</option>
                                 <option value="Preferente">Preferente</option>
                              </select>
                           </div>
                        </div>
                        <div className="grid-cols-3">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Fecha</label>
                              <input type="date" value={s.data.fecha || ''} onChange={(e) => updateService(idx, 'fecha', e.target.value)} />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Hora Salida</label>
                              <input type="time" value={s.data.hora || ''} onChange={(e) => updateService(idx, 'hora', e.target.value)} />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Nº Tren / Ref</label>
                              <input value={s.data.numeroTren || ''} onChange={(e) => updateService(idx, 'numeroTren', e.target.value)} placeholder="AVE 031..." />
                           </div>
                        </div>
                        <div className="form-group">
                           <label className="form-label" style={{ fontSize: '9px' }}>Precio Total USD</label>
                           <input type="number" value={s.data.precio || ''} onChange={(e) => updateService(idx, 'precio', e.target.value)} placeholder="Costo del ticket..." />
                        </div>
                     </div>
                  )}

                  {s.type === 'ferry' && (
                     <div className="grid-cols-1" style={{ gap: '10px' }}>
                        <div className="grid-cols-2">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Ruta Ferry / Fluvial</label>
                              <input value={s.data.ruta || ''} onChange={(e) => updateService(idx, 'ruta', e.target.value)} placeholder="Ej. Buenos Aires - Colonia..." />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Compañía</label>
                              <input value={s.data.compania || ''} onChange={(e) => updateService(idx, 'compania', e.target.value)} placeholder="Ej. Buquebus..." />
                           </div>
                        </div>
                        <div className="grid-cols-3">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Fecha</label>
                              <input type="date" value={s.data.fecha || ''} onChange={(e) => updateService(idx, 'fecha', e.target.value)} />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Hora</label>
                              <input type="time" value={s.data.hora || ''} onChange={(e) => updateService(idx, 'hora', e.target.value)} />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Clase</label>
                              <input value={s.data.clase || ''} onChange={(e) => updateService(idx, 'clase', e.target.value)} placeholder="Ej. Premium..." />
                           </div>
                        </div>
                        <div className="form-group">
                           <label className="form-label" style={{ fontSize: '9px' }}>Precio Total USD</label>
                           <input type="number" value={s.data.precio || ''} onChange={(e) => updateService(idx, 'precio', e.target.value)} placeholder="Costo total Ferry..." />
                        </div>
                     </div>
                  )}

                  {s.type === 'motorhome' && (
                     <div className="grid-cols-1" style={{ gap: '10px' }}>
                        <div className="grid-cols-2">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Modelo Motorhome</label>
                              <input value={s.data.modelo || ''} onChange={(e) => updateService(idx, 'modelo', e.target.value)} placeholder="Ej. Apollo Euro Deluxe..." />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Compañía</label>
                              <input value={s.data.compania || ''} onChange={(e) => updateService(idx, 'compania', e.target.value)} placeholder="Ej. Apollo RV..." />
                           </div>
                        </div>
                        <div className="grid-cols-2">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Lugar de Retiro (Pick-up)</label>
                              <input value={s.data.pickUp || ''} onChange={(e) => updateService(idx, 'pickUp', e.target.value)} placeholder="Ciudad de retiro..." />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Lugar de Entrega (Drop-off)</label>
                              <input value={s.data.dropOff || ''} onChange={(e) => updateService(idx, 'dropOff', e.target.value)} placeholder="Ciudad de entrega..." />
                           </div>
                        </div>
                        <div className="grid-cols-2">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Fecha Inicio</label>
                              <input type="date" value={s.data.startDate || ''} onChange={(e) => updateService(idx, 'startDate', e.target.value)} />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Fecha Fin</label>
                              <input type="date" value={s.data.endDate || ''} onChange={(e) => updateService(idx, 'endDate', e.target.value)} />
                           </div>
                        </div>
                        <div className="form-group">
                           <label className="form-label" style={{ fontSize: '9px' }}>Precio Total USD</label>
                           <input type="number" value={s.data.precio || ''} onChange={(e) => updateService(idx, 'precio', e.target.value)} placeholder="Costo total alquiler..." />
                        </div>
                     </div>
                  )}

                  {s.type === 'bus' && (
                     <div className="grid-cols-1" style={{ gap: '10px' }}>
                        <div className="grid-cols-2">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Trayecto en Bus / Ómnibus</label>
                              <input value={s.data.ruta || ''} onChange={(e) => updateService(idx, 'ruta', e.target.value)} placeholder="Ej. Montevideo - Punta del Este..." />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Empresa</label>
                              <input value={s.data.compania || ''} onChange={(e) => updateService(idx, 'compania', e.target.value)} placeholder="Ej. COT / Cynsa..." />
                           </div>
                        </div>
                        <div className="grid-cols-3">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Fecha</label>
                              <input type="date" value={s.data.fecha || ''} onChange={(e) => updateService(idx, 'fecha', e.target.value)} />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Hora</label>
                              <input type="time" value={s.data.hora || ''} onChange={(e) => updateService(idx, 'hora', e.target.value)} />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '9px' }}>Tipo de Asiento</label>
                              <select className="form-select" value={s.data.clase || 'Semicama'} onChange={(e) => updateService(idx, 'clase', e.target.value)}>
                                 <option value="Semicama">Semicama</option>
                                 <option value="Cama">Cama / Ejecutivo</option>
                                 <option value="Suite">Cama Suite / Premium</option>
                              </select>
                           </div>
                        </div>
                        <div className="form-group">
                           <label className="form-label" style={{ fontSize: '9px' }}>Precio Total USD</label>
                           <input type="number" value={s.data.precio || ''} onChange={(e) => updateService(idx, 'precio', e.target.value)} placeholder="Costo total ticket..." />
                        </div>
                     </div>
                  )}

                  {s.type === 'catamaran' && (
                     <div className="grid-cols-1" style={{ gap: '10px' }}>
                        <div className="grid-cols-2">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '10px' }}>Navegación / Ruta</label>
                              <input value={s.data.ruta || ''} onChange={(e) => updateService(idx, 'ruta', e.target.value)} placeholder="Ej. Crucero por el Sena..." />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '10px' }}>Compañía</label>
                              <input value={s.data.compania || ''} onChange={(e) => updateService(idx, 'compania', e.target.value)} placeholder="Ej. Bateaux Mouches..." />
                           </div>
                        </div>
                        <div className="grid-cols-3">
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '10px' }}>Fecha</label>
                              <input type="date" value={s.data.fecha || ''} onChange={(e) => updateService(idx, 'fecha', e.target.value)} />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '10px' }}>Hora</label>
                              <input type="time" value={s.data.hora || ''} onChange={(e) => updateService(idx, 'hora', e.target.value)} />
                           </div>
                           <div className="form-group">
                              <label className="form-label" style={{ fontSize: '10px' }}>Clase / Servicio</label>
                              <input value={s.data.clase || ''} onChange={(e) => updateService(idx, 'clase', e.target.value)} placeholder="Ej. Cena Gourmet..." />
                           </div>
                        </div>
                        <div className="form-group">
                           <label className="form-label" style={{ fontSize: '10px' }}>Precio Total USD</label>
                           <input type="number" value={s.data.precio || ''} onChange={(e) => updateService(idx, 'precio', e.target.value)} placeholder="Costo navegación..." />
                        </div>
                     </div>
                  )}

                  {s.type === 'otros' && (
                     <div className="grid-cols-1" style={{ gap: '10px' }}>
                        <div className="form-group">
                           <label className="form-label" style={{ fontSize: '10px' }}>Servicio Especial</label>
                           <input value={s.data.servicio || ''} onChange={(e) => updateService(idx, 'servicio', e.target.value)} placeholder="Ej. Entradas Museo del Louvre..." />
                        </div>
                        <div className="form-group">
                           <label className="form-label" style={{ fontSize: '10px' }}>Descripción / Detalles</label>
                           <input value={s.data.descripcion || ''} onChange={(e) => updateService(idx, 'descripcion', e.target.value)} placeholder="Detalles adicionales..." />
                        </div>
                        <div className="form-group">
                           <label className="form-label" style={{ fontSize: '10px' }}>Precio Total USD</label>
                           <input type="number" value={s.data.precio || ''} onChange={(e) => updateService(idx, 'precio', e.target.value)} placeholder="Costo del servicio..." />
                        </div>
                     </div>
                  )}
               </div>
            ))}
         </div>

          {/* TOTALES POR OPCIÓN - DISEÑO PREMIUM Y TRANSPARENTE */}
          <div style={{ marginTop: '3rem', padding: '2.5rem', backgroundColor: '#f8fafc', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                
                {/* Métricas Izquierda */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                   <div style={{ display: 'flex', gap: '3rem', marginBottom: '2rem' }}>
                      <div>
                         <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inversión Neta</div>
                         <div style={{ fontSize: '24px', fontWeight: 950, color: '#0F172A' }}>{formatCurrency(currentStats.totalNet)}</div>
                      </div>
                      <div>
                         <div style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Venta Total (Paquete)</div>
                         <div style={{ fontSize: '24px', fontWeight: 950, color: '#0F172A' }}>{formatCurrency(currentStats.total)}</div>
                      </div>
                   </div>

                   <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                      <div className="form-group" style={{ marginBottom: 0, width: '100px' }}>
                         <label className="form-label" style={{ fontSize: '10px', fontWeight: 800 }}>Markup %</label>
                         <input type="number" step="0.1" value={currentOption?.markup || 0} onChange={(e) => { 
                            const n = [...(formData.options||[])]; 
                            if(n[activeOptionIdx]) {
                               n[activeOptionIdx].markup = parseFloat(e.target.value);
                               n[activeOptionIdx].manualPrice = null;
                            }
                            setFormData({...formData, options: n}); 
                         }} />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                         <label className="form-label" style={{ fontSize: '10px', color: '#c5a059', fontWeight: 800 }}>Precio Manual (Sobrescribir Total USD)</label>
                         <input type="number" placeholder="Ej: 6500" value={currentOption?.manualPrice || ''} onChange={(e) => { const val = e.target.value; const n = [...(formData.options||[])]; if(n[activeOptionIdx]) n[activeOptionIdx].manualPrice = val === '' ? null : parseFloat(val); setFormData({...formData, options: n}); }} style={{ borderColor: '#c5a059', backgroundColor: '#fffdf5' }} />
                      </div>
                   </div>
                </div>

                {/* Destacado Derecha */}
                <div style={{ backgroundColor: '#fff', padding: '2rem 3rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', textAlign: 'right', minWidth: '300px' }}>
                   <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{ fontSize: '11px', fontWeight: 900, color: '#3b82f6', letterSpacing: '1px', textTransform: 'uppercase' }}>Inversión por Pasajero</span>
                      <div style={{ fontSize: '42px', fontWeight: 950, color: '#0F172A', letterSpacing: '-2px', lineHeight: 1.1 }}>{formatCurrency(currentStats.perAdult)}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginTop: '4px' }}>Precio final ADULTOS</div>
                   </div>

                   {(formData.passengersChild > 0 || formData.passengersInfant > 0) && (
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1.5rem' }}>
                         {formData.passengersChild > 0 && (
                            <div>
                               <div style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>NIÑOS (CHD)</div>
                               <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>{formatCurrency(currentStats.perChild)}</div>
                            </div>
                         )}
                         {formData.passengersInfant > 0 && (
                            <div>
                               <div style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8' }}>INFANTES (INF)</div>
                               <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>{formatCurrency(currentStats.perInfant)}</div>
                            </div>
                         )}
                      </div>
                   )}
                </div>
             </div>
             {currentOption?.manualPrice && (
                <div style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: '#fffdf5', borderRadius: '8px', border: '1px dashed #c5a059', fontSize: '11px', color: '#854d0e', display: 'inline-block' }}>
                   ⚠️ <strong>Modo Precio Manual:</strong> Los cálculos de markup están desactivados.
                </div>
             )}
          </div>
      </div>

      {/* PREVISUALIZACIÓN PDF */}
      {previewMode && (
         <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.95)', zIndex: 100, display: 'flex', justifyContent: 'center', overflowY: 'auto', padding: '40px' }}>
            <div style={{ position: 'relative', width: '210mm', backgroundColor: '#fff' }}>
               <button onClick={() => setPreviewMode(false)} style={{ position: 'fixed', right: '40px', top: '40px', backgroundColor: '#fff', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 110 }}><X size={24}/></button>
               <div style={{ border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                  <ProposalContent 
                     option={currentOption} 
                     formData={formData} 
                     calculateTotals={calculateTotals} 
                     settings={settings} 
                     allOptions={previewAllOpts} 
                  />
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default QuotationForm;
