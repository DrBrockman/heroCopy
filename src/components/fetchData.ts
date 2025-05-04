import { supabase } from "../supabaseClient"; // Import the supabase client

export async function fetchSpreadsheetData() {
  // Replace the fetch call with a Supabase query
  const { data, error } = await supabase
    .from("people") // Specify the table name
    .select("*"); // Select all columns

  if (error) {
    console.error("Error fetching data from Supabase:", error);
    throw new Error("Failed to fetch data");
  }

  // The fetched data is directly available in the 'data' variable
  return data;
}
