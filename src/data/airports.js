// Base de datos IATA global con los aeropuertos más importantes del mundo
// Fuente: OpenFlights + ICAO, curada y traducida para uso en agencias de viajes hispanohablantes

export const AIRPORTS = [
  // ARGENTINA
  { iata: "EZE", city: "Buenos Aires", country: "Argentina", name: "Ezeiza Ministro Pistarini" },
  { iata: "AEP", city: "Buenos Aires", country: "Argentina", name: "Jorge Newbery Aeroparque" },
  { iata: "COR", city: "Córdoba", country: "Argentina", name: "Córdoba Ingeniero Ambrosio" },
  { iata: "MDZ", city: "Mendoza", country: "Argentina", name: "El Plumerillo" },
  { iata: "ROS", city: "Rosario", country: "Argentina", name: "Islas Malvinas" },
  { iata: "BRC", city: "Bariloche", country: "Argentina", name: "Teniente Candelaria" },
  { iata: "USH", city: "Ushuaia", country: "Argentina", name: "Malvinas Argentinas" },
  { iata: "IGR", city: "Iguazú", country: "Argentina", name: "Cataratas del Iguazú" },
  { iata: "SLA", city: "Salta", country: "Argentina", name: "Salta Martín Miguel de Güemes" },
  { iata: "TUC", city: "Tucumán", country: "Argentina", name: "Benjamín Matienzo" },
  // URUGUAY
  { iata: "MVD", city: "Montevideo", country: "Uruguay", name: "Carrasco Internacional" },
  { iata: "PDP", city: "Punta del Este", country: "Uruguay", name: "Capitán de Corbeta Curbelo" },
  // BRASIL
  { iata: "GRU", city: "São Paulo", country: "Brasil", name: "Guarulhos" },
  { iata: "CGH", city: "São Paulo", country: "Brasil", name: "Congonhas" },
  { iata: "GIG", city: "Río de Janeiro", country: "Brasil", name: "Galeão Antonio Carlos Jobim" },
  { iata: "SDU", city: "Río de Janeiro", country: "Brasil", name: "Santos Dumont" },
  { iata: "BSB", city: "Brasilia", country: "Brasil", name: "Presidente Juscelino Kubitschek" },
  { iata: "SSA", city: "Salvador", country: "Brasil", name: "Deputado Luís Eduardo Magalhães" },
  { iata: "FOR", city: "Fortaleza", country: "Brasil", name: "Pinto Martins" },
  { iata: "REC", city: "Recife", country: "Brasil", name: "Guararapes-Gilberto Freyre" },
  { iata: "FLN", city: "Florianópolis", country: "Brasil", name: "Hercílio Luz" },
  { iata: "POA", city: "Porto Alegre", country: "Brasil", name: "Salgado Filho" },
  { iata: "BEL", city: "Belém", country: "Brasil", name: "Val de Cans" },
  { iata: "MAO", city: "Manaos", country: "Brasil", name: "Eduardo Gomes" },
  { iata: "NAT", city: "Natal", country: "Brasil", name: "Aluízio Alves" },
  // CHILE
  { iata: "SCL", city: "Santiago", country: "Chile", name: "Arturo Merino Benítez" },
  { iata: "PMC", city: "Puerto Montt", country: "Chile", name: "El Tepual" },
  { iata: "IQQ", city: "Iquique", country: "Chile", name: "Diego Aracena" },
  { iata: "ANF", city: "Antofagasta", country: "Chile", name: "Cerro Moreno" },
  // PERÚ
  { iata: "LIM", city: "Lima", country: "Perú", name: "Jorge Chávez" },
  { iata: "CUZ", city: "Cusco", country: "Perú", name: "Alejandro Velasco Astete" },
  // COLOMBIA
  { iata: "BOG", city: "Bogotá", country: "Colombia", name: "El Dorado" },
  { iata: "MDE", city: "Medellín", country: "Colombia", name: "José María Córdova" },
  { iata: "CTG", city: "Cartagena", country: "Colombia", name: "Rafael Núñez" },
  { iata: "CLO", city: "Cali", country: "Colombia", name: "Alfonso Bonilla Aragón" },
  // ECUADOR
  { iata: "UIO", city: "Quito", country: "Ecuador", name: "Mariscal Sucre" },
  { iata: "GYE", city: "Guayaquil", country: "Ecuador", name: "José Joaquín de Olmedo" },
  // VENEZUELA
  { iata: "CCS", city: "Caracas", country: "Venezuela", name: "Simón Bolívar" },
  // BOLIVIA
  { iata: "LPB", city: "La Paz", country: "Bolivia", name: "El Alto" },
  { iata: "VVI", city: "Santa Cruz", country: "Bolivia", name: "Viru Viru" },
  // PARAGUAY
  { iata: "ASU", city: "Asunción", country: "Paraguay", name: "Silvio Pettirossi" },
  // MEXICO
  { iata: "MEX", city: "Ciudad de México", country: "México", name: "Benito Juárez" },
  { iata: "NLU", city: "Ciudad de México", country: "México", name: "Felipe Ángeles" },
  { iata: "TQO", city: "Tulum", country: "México", name: "Felipe Carrillo Puerto" },
  { iata: "CUN", city: "Cancún", country: "México", name: "Cancún" },
  { iata: "GDL", city: "Guadalajara", country: "México", name: "Miguel Hidalgo" },
  { iata: "MTY", city: "Monterrey", country: "México", name: "General Mariano Escobedo" },
  { iata: "PVR", city: "Puerto Vallarta", country: "México", name: "Gustavo Díaz Ordaz" },
  { iata: "MID", city: "Mérida", country: "México", name: "Manuel Crescencio Rejón" },
  { iata: "HUX", city: "Huatulco", country: "México", name: "Bahías de Huatulco" },
  { iata: "SJD", city: "Los Cabos", country: "México", name: "Los Cabos" },
  { iata: "ZIH", city: "Ixtapa-Zihuatanejo", country: "México", name: "Ixtapa-Zihuatanejo" },
  // CUBA
  { iata: "HAV", city: "La Habana", country: "Cuba", name: "José Martí" },
  { iata: "VRA", city: "Varadero", country: "Cuba", name: "Juan Gualberto Gómez" },
  // REP. DOMINICANA
  { iata: "PUJ", city: "Punta Cana", country: "Rep. Dominicana", name: "Punta Cana" },
  { iata: "SDQ", city: "Santo Domingo", country: "Rep. Dominicana", name: "Las Américas" },
  // COSTA RICA
  { iata: "SJO", city: "San José", country: "Costa Rica", name: "Juan Santamaría" },
  // PANAMÁ
  { iata: "PTY", city: "Panamá", country: "Panamá", name: "Tocumen" },
  // USA
  { iata: "JFK", city: "Nueva York", country: "Estados Unidos", name: "John F. Kennedy" },
  { iata: "EWR", city: "Nueva York", country: "Estados Unidos", name: "Newark Liberty" },
  { iata: "LGA", city: "Nueva York", country: "Estados Unidos", name: "LaGuardia" },
  { iata: "MIA", city: "Miami", country: "Estados Unidos", name: "Miami" },
  { iata: "FLL", city: "Fort Lauderdale", country: "Estados Unidos", name: "Fort Lauderdale" },
  { iata: "LAX", city: "Los Ángeles", country: "Estados Unidos", name: "Los Ángeles" },
  { iata: "ORD", city: "Chicago", country: "Estados Unidos", name: "O'Hare" },
  { iata: "MCO", city: "Orlando", country: "Estados Unidos", name: "Orlando" },
  { iata: "SFO", city: "San Francisco", country: "Estados Unidos", name: "San Francisco" },
  { iata: "LAS", city: "Las Vegas", country: "Estados Unidos", name: "Harry Reid" },
  { iata: "ATL", city: "Atlanta", country: "Estados Unidos", name: "Hartsfield-Jackson" },
  { iata: "IAD", city: "Washington", country: "Estados Unidos", name: "Dulles" },
  { iata: "DFW", city: "Dallas", country: "Estados Unidos", name: "Dallas/Fort Worth" },
  { iata: "SEA", city: "Seattle", country: "Estados Unidos", name: "Seattle-Tacoma" },
  { iata: "BOS", city: "Boston", country: "Estados Unidos", name: "Logan" },
  { iata: "HNL", city: "Honolulu", country: "Estados Unidos", name: "Daniel K. Inouye" },
  { iata: "MIA", city: "Miami", country: "Estados Unidos", name: "Miami" },
  // CANADÁ
  { iata: "YYZ", city: "Toronto", country: "Canadá", name: "Pearson" },
  { iata: "YVR", city: "Vancouver", country: "Canadá", name: "Vancouver" },
  { iata: "YUL", city: "Montreal", country: "Canadá", name: "Trudeau" },
  // ESPAÑA
  { iata: "MAD", city: "Madrid", country: "España", name: "Adolfo Suárez Barajas" },
  { iata: "BCN", city: "Barcelona", country: "España", name: "Josep Tarradellas El Prat" },
  { iata: "PMI", city: "Palma de Mallorca", country: "España", name: "Palma de Mallorca" },
  { iata: "AGP", city: "Málaga", country: "España", name: "Costa del Sol" },
  { iata: "VLC", city: "Valencia", country: "España", name: "Valencia" },
  { iata: "IBZ", city: "Ibiza", country: "España", name: "Ibiza" },
  { iata: "SVQ", city: "Sevilla", country: "España", name: "San Pablo" },
  { iata: "BIO", city: "Bilbao", country: "España", name: "Bilbao" },
  { iata: "LPA", city: "Las Palmas", country: "España", name: "Gran Canaria" },
  { iata: "TFS", city: "Tenerife Sur", country: "España", name: "Tenerife Sur" },
  // PORTUGAL
  { iata: "LIS", city: "Lisboa", country: "Portugal", name: "Humberto Delgado" },
  { iata: "OPO", city: "Oporto", country: "Portugal", name: "Francisco Sá Carneiro" },
  { iata: "FAO", city: "Faro", country: "Portugal", name: "Faro" },
  // FRANCIA
  { iata: "CDG", city: "París", country: "Francia", name: "Charles de Gaulle" },
  { iata: "ORY", city: "París", country: "Francia", name: "Orly" },
  { iata: "NCE", city: "Niza", country: "Francia", name: "Côte d'Azur" },
  { iata: "MRS", city: "Marsella", country: "Francia", name: "Provence" },
  { iata: "LYS", city: "Lyon", country: "Francia", name: "Saint-Exupéry" },
  // REINO UNIDO
  { iata: "LHR", city: "Londres", country: "Reino Unido", name: "Heathrow" },
  { iata: "LGW", city: "Londres", country: "Reino Unido", name: "Gatwick" },
  { iata: "STN", city: "Londres", country: "Reino Unido", name: "Stansted" },
  { iata: "MAN", city: "Mánchester", country: "Reino Unido", name: "Manchester" },
  { iata: "EDI", city: "Edimburgo", country: "Reino Unido", name: "Edinburgh" },
  // ITALIA
  { iata: "FCO", city: "Roma", country: "Italia", name: "Leonardo da Vinci-Fiumicino" },
  { iata: "CIA", city: "Roma", country: "Italia", name: "Ciampino" },
  { iata: "MXP", city: "Milán", country: "Italia", name: "Malpensa" },
  { iata: "LIN", city: "Milán", country: "Italia", name: "Linate" },
  { iata: "VCE", city: "Venecia", country: "Italia", name: "Marco Polo" },
  { iata: "NAP", city: "Nápoles", country: "Italia", name: "Naples-Capodichino" },
  { iata: "BLQ", city: "Bolonia", country: "Italia", name: "Guglielmo Marconi" },
  { iata: "PSA", city: "Pisa", country: "Italia", name: "Galileo Galilei" },
  { iata: "PMO", city: "Palermo", country: "Italia", name: "Falcone Borsellino" },
  // ALEMANIA
  { iata: "FRA", city: "Fráncfort", country: "Alemania", name: "Frankfurt am Main" },
  { iata: "MUC", city: "Múnich", country: "Alemania", name: "Franz Josef Strauss" },
  { iata: "BER", city: "Berlín", country: "Alemania", name: "Brandenburg" },
  { iata: "HAM", city: "Hamburgo", country: "Alemania", name: "Hamburg Helmut Schmidt" },
  // PAÍSES BAJOS
  { iata: "AMS", city: "Ámsterdam", country: "Países Bajos", name: "Schiphol" },
  // BÉLGICA
  { iata: "BRU", city: "Bruselas", country: "Bélgica", name: "Brussels" },
  // SUÍZA
  { iata: "ZRH", city: "Zúrich", country: "Suiza", name: "Zurich Kloten" },
  { iata: "GVA", city: "Ginebra", country: "Suiza", name: "Geneva" },
  // AUSTRIA
  { iata: "VIE", city: "Viena", country: "Austria", name: "Vienna Schwechat" },
  // GRECIA
  { iata: "ATH", city: "Atenas", country: "Grecia", name: "Eleftherios Venizelos" },
  { iata: "JTR", city: "Santorini", country: "Grecia", name: "Santorini Thira" },
  { iata: "JMK", city: "Mykonos", country: "Grecia", name: "Mykonos" },
  { iata: "HER", city: "Heraklion (Creta)", country: "Grecia", name: "Nikos Kazantzakis" },
  { iata: "RHO", city: "Rodas", country: "Grecia", name: "Diagoras" },
  // TURQUÍA
  { iata: "IST", city: "Estambul", country: "Turquía", name: "Istanbul" },
  { iata: "AYT", city: "Antalya", country: "Turquía", name: "Antalya" },
  // CROACIA
  { iata: "DBV", city: "Dubrovnik", country: "Croacia", name: "Dubrovnik" },
  { iata: "SPU", city: "Split", country: "Croacia", name: "Split" },
  { iata: "ZAG", city: "Zagreb", country: "Croacia", name: "Zagreb" },
  // NORUEGA
  { iata: "OSL", city: "Oslo", country: "Noruega", name: "Oslo Gardermoen" },
  // SUECIA
  { iata: "ARN", city: "Estocolmo", country: "Suecia", name: "Arlanda" },
  // DINAMARCA
  { iata: "CPH", city: "Copenhague", country: "Dinamarca", name: "Kastrup" },
  // FINLANDIA
  { iata: "HEL", city: "Helsinki", country: "Finlandia", name: "Helsinki Vantaa" },
  // IRLANDA
  { iata: "DUB", city: "Dublín", country: "Irlanda", name: "Dublin" },
  // HUNGRÍA
  { iata: "BUD", city: "Budapest", country: "Hungría", name: "Budapest Ferenc Liszt" },
  // CHEQUIA
  { iata: "PRG", city: "Praga", country: "República Checa", name: "Václav Havel" },
  // POLONIA
  { iata: "WAW", city: "Varsovia", country: "Polonia", name: "Chopin" },
  // RUMANIA
  { iata: "OTP", city: "Bucarest", country: "Rumania", name: "Henri Coandă" },
  // MARRUECOS
  { iata: "CMN", city: "Casablanca", country: "Marruecos", name: "Mohammed V" },
  { iata: "RAK", city: "Marrakech", country: "Marruecos", name: "Menara" },
  // EGIPTO
  { iata: "CAI", city: "El Cairo", country: "Egipto", name: "Cairo" },
  { iata: "HRG", city: "Hurghada", country: "Egipto", name: "Hurghada" },
  { iata: "SSH", city: "Sharm el-Sheikh", country: "Egipto", name: "Sharm el-Sheikh" },
  // SUDÁFRICA
  { iata: "JNB", city: "Johannesburgo", country: "Sudáfrica", name: "O.R. Tambo" },
  { iata: "CPT", city: "Ciudad del Cabo", country: "Sudáfrica", name: "Cape Town" },
  // KENIA
  { iata: "NBO", city: "Nairobi", country: "Kenia", name: "Jomo Kenyatta" },
  // TANZANIA
  { iata: "JRO", city: "Kilimanjaro", country: "Tanzania", name: "Kilimanjaro" },
  // EMIRATOS
  { iata: "DXB", city: "Dubái", country: "Emiratos Árabes", name: "Dubai International" },
  { iata: "AUH", city: "Abu Dabi", country: "Emiratos Árabes", name: "Abu Dhabi Zayed" },
  // QATAR
  { iata: "DOH", city: "Doha", country: "Qatar", name: "Hamad" },
  // INDIA
  { iata: "DEL", city: "Nueva Delhi", country: "India", name: "Indira Gandhi" },
  { iata: "BOM", city: "Bombay (Mumbai)", country: "India", name: "Chhatrapati Shivaji" },
  // TAILANDIA
  { iata: "BKK", city: "Bangkok", country: "Tailandia", name: "Suvarnabhumi" },
  { iata: "HKT", city: "Phuket", country: "Tailandia", name: "Phuket" },
  // SINGAPUR
  { iata: "SIN", city: "Singapur", country: "Singapur", name: "Changi" },
  // INDONESIA
  { iata: "DPS", city: "Bali", country: "Indonesia", name: "Ngurah Rai" },
  { iata: "CGK", city: "Yakarta", country: "Indonesia", name: "Soekarno-Hatta" },
  // VIETNAM
  { iata: "HAN", city: "Hanói", country: "Vietnam", name: "Noi Bai" },
  { iata: "SGN", city: "Ho Chi Minh", country: "Vietnam", name: "Tan Son Nhat" },
  // CAMBOYA
  { iata: "PNH", city: "Nom Pen", country: "Camboya", name: "Phnom Penh" },
  { iata: "REP", city: "Siem Riep (Angkor)", country: "Camboya", name: "Siem Reap" },
  // JAPÓN
  { iata: "NRT", city: "Tokio", country: "Japón", name: "Narita" },
  { iata: "HND", city: "Tokio", country: "Japón", name: "Haneda" },
  { iata: "KIX", city: "Osaka", country: "Japón", name: "Kansai" },
  { iata: "CTS", city: "Sapporo", country: "Japón", name: "New Chitose" },
  { iata: "OKA", city: "Okinawa", country: "Japón", name: "Naha" },
  // CHINA
  { iata: "PEK", city: "Pekín", country: "China", name: "Capital" },
  { iata: "PVG", city: "Shanghái", country: "China", name: "Pudong" },
  { iata: "CAN", city: "Guangzhou", country: "China", name: "Baiyun" },
  // HONG KONG
  { iata: "HKG", city: "Hong Kong", country: "Hong Kong", name: "Chek Lap Kok" },
  // COREA DEL SUR
  { iata: "ICN", city: "Seúl", country: "Corea del Sur", name: "Incheon" },
  // MALDIVAS
  { iata: "MLE", city: "Malé", country: "Maldivas", name: "Velana Internacional" },
  // AUSTRALIA
  { iata: "SYD", city: "Sídney", country: "Australia", name: "Kingsford Smith" },
  { iata: "MEL", city: "Melbourne", country: "Australia", name: "Tullamarine" },
  { iata: "BNE", city: "Brisbane", country: "Australia", name: "Brisbane" },
  // NUEVA ZELANDA
  { iata: "AKL", city: "Auckland", country: "Nueva Zelanda", name: "Auckland" },
  // ISLANDIA
  { iata: "KEF", city: "Reikiavik", country: "Islandia", name: "Keflavik" },
  // RUSIA
  { iata: "SVO", city: "Moscú", country: "Rusia", name: "Sheremetyevo" },
  { iata: "LED", city: "San Petersburgo", country: "Rusia", name: "Pulkovo" },
];
