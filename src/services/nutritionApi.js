// src/services/nutritionApi.js

// EDAMAM API Bilgileri - ÜCRETSİZ PLAN
const API_ID = "b27560a0";
const API_KEY = "3a793c15fe03b5f7e8b2332e2a056068";

/**
 * Edamam API'sini kullanarak online yemek veritabanında arama yapar.
 * @param {string} query - Kullanıcının aradığı yemek (örn: "apple" veya "tavuk göğsü")
 * @returns {Promise<Array>} Arama sonuçlarını içeren bir dizi döner.
 */
export const searchFoods = async (query) => {
  if (!query) return [];

  const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${API_ID}&app_key=${API_KEY}&ingr=${encodeURIComponent(query)}&nutrition-type=logging`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // API'den gelen veriyi uygulamamızın anlayacağı formata dönüştürüyoruz.
    return data.hints.map(item => {
      const nutrients = item.food.nutrients;
      return {
        name: item.food.label,
        // API verileri 100g başına olduğu için direkt kullanabiliriz.
        caloriesPer100g: nutrients.ENERC_KCAL || 0,
        proteinPer100g: nutrients.PROCNT || 0,
        carbsPer100g: nutrients.CHOCDF || 0,
        fatPer100g: nutrients.FAT || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching food data from Edamam API:", error);
    return []; // Hata durumunda boş bir dizi dönüyoruz.
  }
};