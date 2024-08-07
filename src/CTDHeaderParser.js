// CTDHeaderParser.js

export function parseCTDHeader(headerContentBuffer) {
  const decoder = new TextDecoder('iso-8859-1');
  const headerContent = decoder.decode(headerContentBuffer);

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

  /*
  Variables are on lines like this one:
  # name 14 = flECO-AFL: Fluorescence, WET Labs ECO-AFL/FL [mg/m^3]
  where the string between = and : is the variable name, the string after : is the variable description,
  and the bracketed string is the variable unit.
  */
  const variables = [];
  const lines = headerContent.split('\n');
  lines.forEach(line => {
    // parse the line
    const varMatch = line.match(/^# name \d+ = ([^:]+): (.*)/);
    if (varMatch) {
      const name = varMatch[1];
      const suffix = varMatch[2];
      const unitMatch = suffix.match(/(.*) \[(.*)\]/);
      if (unitMatch) {
        const description = unitMatch[1];
        const unit = unitMatch[2];
        variables.push({
          name,
          description,
          unit
        });
      } else {
        variables.push({
          name,
          description: suffix,
          unit: ''
        });
      }
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