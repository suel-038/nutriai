// Cálculos nutricionais e geração de dieta

export interface UserData {
  height: number; // cm
  weight: number; // kg
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
}

export interface NutritionPlan {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  micronutrients: {
    fiber: number;
    vitaminC: number;
    vitaminB: number;
    vitaminD: number;
    magnesium: number;
    omega3: number;
  };
}

export interface Meal {
  name: string;
  foods: FoodItem[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietPlan {
  meals: {
    breakfast: Meal;
    morningSnack: Meal;
    lunch: Meal;
    afternoonSnack: Meal;
    dinner: Meal;
    eveningSnack?: Meal;
  };
  dailyTotal: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Cálculo da Taxa Metabólica Basal (TMB) - Fórmula de Mifflin-St Jeor
export function calculateBMR(userData: UserData): number {
  const { weight, height, age, gender } = userData;
  
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Cálculo do Gasto Calórico Diário Total (TDEE)
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  
  return bmr * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.2);
}

// Cálculo das calorias alvo baseado no objetivo
export function calculateTargetCalories(tdee: number, goal: string): number {
  switch (goal) {
    case 'lose':
      return tdee - 500; // Déficit de 500 kcal
    case 'gain':
      return tdee + 300; // Superávit de 300 kcal
    case 'maintain':
    default:
      return tdee;
  }
}

// Cálculo dos macronutrientes
export function calculateMacros(targetCalories: number, weight: number, goal: string) {
  let proteinPerKg = 2.0; // g/kg para ganho muscular
  let fatPercentage = 0.25; // 25% das calorias
  
  if (goal === 'lose') {
    proteinPerKg = 2.2; // Mais proteína para preservar massa muscular
    fatPercentage = 0.25;
  } else if (goal === 'maintain') {
    proteinPerKg = 1.8;
    fatPercentage = 0.25;
  }
  
  const protein = weight * proteinPerKg;
  const fatCalories = targetCalories * fatPercentage;
  const fat = fatCalories / 9; // 9 kcal por grama de gordura
  
  const proteinCalories = protein * 4; // 4 kcal por grama de proteína
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = carbCalories / 4; // 4 kcal por grama de carboidrato
  
  return {
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
}

// Cálculo dos micronutrientes recomendados
export function calculateMicronutrients(weight: number, age: number): NutritionPlan['micronutrients'] {
  return {
    fiber: Math.round(14 * (weight * 0.035)), // 14g por 1000 kcal
    vitaminC: age < 50 ? 90 : 100, // mg
    vitaminB: 2.4, // mcg (B12)
    vitaminD: age < 70 ? 600 : 800, // IU
    magnesium: Math.round(weight * 5), // mg
    omega3: 1.6, // g
  };
}

// Gerar plano nutricional completo
export function generateNutritionPlan(userData: UserData): NutritionPlan {
  const bmr = calculateBMR(userData);
  const tdee = calculateTDEE(bmr, userData.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, userData.goal);
  const macros = calculateMacros(targetCalories, userData.weight, userData.goal);
  const micronutrients = calculateMicronutrients(userData.weight, userData.age);
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    macros,
    micronutrients,
  };
}

// Gerar plano de dieta completo
export function generateDietPlan(nutritionPlan: NutritionPlan): DietPlan {
  const { targetCalories, macros } = nutritionPlan;
  
  // Distribuição de calorias por refeição (%)
  const distribution = {
    breakfast: 0.25,
    morningSnack: 0.10,
    lunch: 0.30,
    afternoonSnack: 0.10,
    dinner: 0.25,
  };
  
  const meals = {
    breakfast: generateMeal('Café da Manhã', targetCalories * distribution.breakfast, macros, distribution.breakfast),
    morningSnack: generateMeal('Lanche da Manhã', targetCalories * distribution.morningSnack, macros, distribution.morningSnack),
    lunch: generateMeal('Almoço', targetCalories * distribution.lunch, macros, distribution.lunch),
    afternoonSnack: generateMeal('Lanche da Tarde', targetCalories * distribution.afternoonSnack, macros, distribution.afternoonSnack),
    dinner: generateMeal('Jantar', targetCalories * distribution.dinner, macros, distribution.dinner),
  };
  
  const dailyTotal = {
    calories: Object.values(meals).reduce((sum, meal) => sum + meal.totalCalories, 0),
    protein: Object.values(meals).reduce((sum, meal) => sum + meal.macros.protein, 0),
    carbs: Object.values(meals).reduce((sum, meal) => sum + meal.macros.carbs, 0),
    fat: Object.values(meals).reduce((sum, meal) => sum + meal.macros.fat, 0),
  };
  
  return { meals, dailyTotal };
}

function generateMeal(name: string, calories: number, dailyMacros: any, percentage: number): Meal {
  const mealMacros = {
    protein: Math.round(dailyMacros.protein * percentage),
    carbs: Math.round(dailyMacros.carbs * percentage),
    fat: Math.round(dailyMacros.fat * percentage),
  };
  
  let foods: FoodItem[] = [];
  
  // Exemplos de alimentos por refeição
  if (name === 'Café da Manhã') {
    foods = [
      { name: 'Ovos mexidos', quantity: '3 unidades', calories: 210, protein: 18, carbs: 2, fat: 14 },
      { name: 'Pão integral', quantity: '2 fatias', calories: 160, protein: 8, carbs: 28, fat: 2 },
      { name: 'Abacate', quantity: '1/2 unidade', calories: 120, protein: 1, carbs: 6, fat: 11 },
      { name: 'Café com leite desnatado', quantity: '200ml', calories: 60, protein: 6, carbs: 9, fat: 0 },
    ];
  } else if (name === 'Lanche da Manhã') {
    foods = [
      { name: 'Iogurte grego natural', quantity: '150g', calories: 100, protein: 15, carbs: 6, fat: 2 },
      { name: 'Banana', quantity: '1 unidade média', calories: 105, protein: 1, carbs: 27, fat: 0 },
    ];
  } else if (name === 'Almoço') {
    foods = [
      { name: 'Peito de frango grelhado', quantity: '150g', calories: 240, protein: 45, carbs: 0, fat: 5 },
      { name: 'Arroz integral', quantity: '4 colheres de sopa', calories: 180, protein: 4, carbs: 38, fat: 1 },
      { name: 'Feijão carioca', quantity: '2 conchas', calories: 140, protein: 9, carbs: 24, fat: 1 },
      { name: 'Brócolis cozido', quantity: '1 xícara', calories: 55, protein: 4, carbs: 11, fat: 0 },
      { name: 'Salada verde', quantity: '1 prato', calories: 30, protein: 2, carbs: 6, fat: 0 },
    ];
  } else if (name === 'Lanche da Tarde') {
    foods = [
      { name: 'Whey protein', quantity: '1 scoop (30g)', calories: 120, protein: 24, carbs: 3, fat: 1 },
      { name: 'Castanhas mistas', quantity: '20g', calories: 120, protein: 3, carbs: 4, fat: 11 },
    ];
  } else if (name === 'Jantar') {
    foods = [
      { name: 'Salmão grelhado', quantity: '150g', calories: 280, protein: 34, carbs: 0, fat: 15 },
      { name: 'Batata doce', quantity: '1 unidade média', calories: 130, protein: 2, carbs: 30, fat: 0 },
      { name: 'Aspargos grelhados', quantity: '1 xícara', calories: 40, protein: 4, carbs: 8, fat: 0 },
      { name: 'Azeite de oliva', quantity: '1 colher de sopa', calories: 120, protein: 0, carbs: 0, fat: 14 },
    ];
  }
  
  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = foods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = foods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = foods.reduce((sum, food) => sum + food.fat, 0);
  
  return {
    name,
    foods,
    totalCalories,
    macros: {
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    },
  };
}
