// src/services/healthService.js

// Harris-Benedict formülüne göre Bazal Metabolizma Hızı (BMR) hesaplaması
const calculateBMR = (weight, height, age, gender = 'male') => {
  if (gender === 'female') {
    return 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
  }
  // Varsayılan olarak erkek
  return 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
};

// Aktivite seviyesine göre toplam günlük kalori ihtiyacı (TDEE)
const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };
  return bmr * (multipliers[activityLevel] || 1.55);
};

/**
 * Kullanıcının profiline göre kişiselleştirilmiş makro hedeflerini hesaplar.
 * @param {object} userProfile - Kullanıcının profil verileri (weight, height, age, activityLevel, goal)
 * @returns {object} - { calories, protein, carbs, fat } içeren bir obje döner.
 */
export const calculateTargetMacros = (userProfile) => {
  if (!userProfile || !userProfile.weight || !userProfile.height || !userProfile.age) {
    // Eğer profil bilgileri eksikse, varsayılan hedefler dön.
    return { calories: 2200, protein: 140, carbs: 250, fat: 70 };
  }

  const { weight, height, age, activityLevel, goal } = userProfile;

  const bmr = calculateBMR(weight, height, age);
  const tdee = calculateTDEE(bmr, activityLevel);

  let targetCalories = tdee;

  // Hedefe göre kalori ayarlaması
  if (goal === 'fatLoss') {
    targetCalories -= 400; // Yaklaşık olarak 400 kalori açık
  } else if (goal === 'muscleGain') {
    targetCalories += 300; // Yaklaşık olarak 300 kalori fazlası
  }

  // Makroları kaloriye göre dağıtma (örnek bir dağılım: 40% Karbonhidrat, 30% Protein, 30% Yağ)
  const targetProtein = Math.round((targetCalories * 0.30) / 4); // 1g protein = 4 kcal
  const targetCarbs = Math.round((targetCalories * 0.40) / 4);   // 1g karbonhidrat = 4 kcal
  const targetFat = Math.round((targetCalories * 0.30) / 9);     // 1g yağ = 9 kcal

  return {
    calories: Math.round(targetCalories),
    protein: targetProtein,
    carbs: targetCarbs,
    fat: targetFat,
  };
};