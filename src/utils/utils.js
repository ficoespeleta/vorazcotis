import { AIRPORTS } from '../data/airports';

/**
 * PNR Parser v6 - Pro Traveler Experience
 * Ahora captura nombres de aeropuertos y prepara etiquetas descriptivas
 */
export const parsePNR = (pnrText) => {
  if (!pnrText || pnrText.length < 10) return null;

  const lines = pnrText.split('\n');
  const flights = [];

  const AIRLINES = {
    "AM": "Aeroméxico", "LA": "LATAM Airlines", "IB": "Iberia", "UX": "Air Europa",
    "AR": "Aerolíneas Argentinas", "AA": "American Airlines", "CM": "Copa Airlines",
    "AV": "Avianca", "AF": "Air France", "LH": "Lufthansa", "BA": "British Airways",
    "EK": "Emirates", "QR": "Qatar Airways", "JJ": "LATAM Brasil", "G3": "GOL"
  };

  const MONTHS = {
    "JAN": "Enero", "FEB": "Febrero", "MAR": "Marzo", "APR": "Abril", "MAY": "Mayo", "JUN": "Junio",
    "JUL": "Julio", "AUG": "Agosto", "SEP": "Septiembre", "OCT": "Octubre", "NOV": "Noviembre", "DEC": "Diciembre"
  };

  lines.forEach(line => {
    const airlineMatch = line.match(/([A-Z0-9]{2})\s?(\d{2,4})\s?([A-Z])?\b/);
    const dateMatch = line.match(/(\d{2})([A-Z]{3})/);
    const timesMatch = line.match(/(\d{4})\s+(\d{4})/);
    
    let validIatas = [];
    const combinedIata = line.match(/\b([A-Z]{6})\b/);
    if (combinedIata) {
      validIatas = [combinedIata[1].substring(0, 3), combinedIata[1].substring(3, 6)];
    } else {
      const individualIatas = line.match(/\b([A-Z]{3})\b/g) || [];
      validIatas = individualIatas.filter(code => 
        code !== (airlineMatch ? airlineMatch[1] : '') && 
        AIRPORTS.some(a => a.iata === code)
      );
    }

    if (airlineMatch && dateMatch && timesMatch) {
      const airlineCode = airlineMatch[1];
      const flightNum = airlineMatch[2];
      const day = dateMatch[1];
      const monthCode = dateMatch[2];
      const monthLabel = MONTHS[monthCode] || monthCode;
      
      const [depTime, arrTime] = [timesMatch[1], timesMatch[2]];

      const originIata = validIatas[0] || "---";
      const destIata = validIatas[1] || "---";

      const originData = AIRPORTS.find(a => a.iata === originIata);
      const destData = AIRPORTS.find(a => a.iata === destIata);

      flights.push({
        airline: AIRLINES[airlineCode] || airlineCode,
        flightNumber: `${airlineCode}${flightNum}`,
        departureCity: originData?.city || originIata,
        departureAirport: originData?.name || "",
        departureIata: originIata,
        arrivalCity: destData?.city || destIata,
        arrivalAirport: destData?.name || "",
        arrivalIata: destIata,
        dateFriendly: `${day} de ${monthLabel}`,
        departureTimeFormatted: `${depTime.substring(0,2)}:${depTime.substring(2,4)}`,
        arrivalTimeFormatted: `${arrTime.substring(0,2)}:${arrTime.substring(2,4)}`
      });
    }
  });

  return flights.length > 0 ? flights : null;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '---';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

export const formatCurrency = (amount) => {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};
