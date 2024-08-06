// CTDHeaderParser.js

export function parseCTDHeader(headerContent) {
  // Extract NMEA UTC time
  const nmeaTimeMatch = headerContent.match(/\* NMEA UTC \(Time\) = (.+)/);
  const nmeaTime = nmeaTimeMatch ? new Date(nmeaTimeMatch[1] + " UTC") : null;

  // Extract System UTC time
  const systemTimeMatch = headerContent.match(/\* System UTC = (.+)/);
  const systemTime = systemTimeMatch ? new Date(systemTimeMatch[1] + " UTC") : null;

  // Extract latitude and longitude
  const latMatch = headerContent.match(/\* NMEA Latitude = (\d+) (\d+\.\d+) ([NS])/);
  const lonMatch = headerContent.match(/\* NMEA Longitude = (\d+) (\d+\.\d+) ([EW])/);

  let lat = null;
  let lon = null;

  if (latMatch && lonMatch) {
    lat = parseInt(latMatch[1]) + parseFloat(latMatch[2]) / 60;
    lon = parseInt(lonMatch[1]) + parseFloat(lonMatch[2]) / 60;

    if (latMatch[3] === 'S') lat = -lat;
    if (lonMatch[3] === 'W') lon = -lon;
  }

  // Extract variables
  const variables = [];
  const lines = headerContent.split('\n');
  lines.forEach(line => {
    const varMatch = line.match(/# name \d+ = (.+?)(:.*)?$/);
    if (varMatch) {
      variables.push(varMatch[1]);
    }
  });

  return {
    nmeaTime,
    systemTime,
    latitude: lat,
    longitude: lon,
    variables
  };
}