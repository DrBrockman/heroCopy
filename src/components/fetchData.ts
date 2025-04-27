export async function fetchSpreadsheetData() {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbw7fO3QrGqPd3DM1dp6_FRDI8DYDSwPESHC0A83mjed1sTmFQeVowVUPpXv7o89tyADbg/exec?action=fetchSpreadsheetData",
    );
  
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
  
    return data;
  }
  