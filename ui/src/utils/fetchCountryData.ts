export async function fetchCountryData(country: string, token?: string) {
    try {
      const response = await fetch(`/api/glossary?country=${country}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
          "Accept": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json(); // Return the fetched data
    } catch (error) {
      console.error("Error fetching country data:", error);
      return null; // Return null on error to handle gracefully
    }
  }
  