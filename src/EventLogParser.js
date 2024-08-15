import Papa from 'papaparse';

export async function parseEventLog(csvContent) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.replace(/"/g, ''),
      transform: (value, field) => {
        // Remove surrounding quotes from all fields
        value = value.replace(/^"(.*)"$/, '$1');

        switch (field) {
          case 'dateTime8601':
            return new Date(value);
          case 'Latitude':
          case 'Longitude':
            if (value === 'NaN') {
              console.log(`NaN for ${field}`);
              return null;
            }
            return parseFloat(value);
          default:
            return value;
        }
      },
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    });
  });
}