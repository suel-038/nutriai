export interface FoodOption {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: 'protein' | 'carb' | 'fat' | 'vegetable' | 'fruit' | 'dairy' | 'other';
}

export const foodDatabase: FoodOption[] = [
  // Proteínas
  { name: 'Peito de frango grelhado', quantity: '150g', calories: 240, protein: 45, carbs: 0, fat: 5, category: 'protein' },
  { name: 'Salmão grelhado', quantity: '150g', calories: 280, protein: 34, carbs: 0, fat: 15, category: 'protein' },
  { name: 'Ovos mexidos', quantity: '3 unidades', calories: 210, protein: 18, carbs: 2, fat: 14, category: 'protein' },
  { name: 'Atum em água', quantity: '100g', calories: 120, protein: 26, carbs: 0, fat: 1, category: 'protein' },
  { name: 'Whey protein', quantity: '1 scoop (30g)', calories: 120, protein: 24, carbs: 3, fat: 1, category: 'protein' },
  { name: 'Queijo cottage', quantity: '150g', calories: 110, protein: 14, carbs: 3, fat: 4, category: 'protein' },
  { name: 'Tofu firme', quantity: '150g', calories: 180, protein: 20, carbs: 3, fat: 11, category: 'protein' },

  // Carboidratos
  { name: 'Arroz integral', quantity: '4 colheres de sopa', calories: 180, protein: 4, carbs: 38, fat: 1, category: 'carb' },
  { name: 'Batata doce', quantity: '1 unidade média', calories: 130, protein: 2, carbs: 30, fat: 0, category: 'carb' },
  { name: 'Pão integral', quantity: '2 fatias', calories: 160, protein: 8, carbs: 28, fat: 2, category: 'carb' },
  { name: 'Quinoa cozida', quantity: '4 colheres de sopa', calories: 140, protein: 5, carbs: 25, fat: 2, category: 'carb' },
  { name: 'Aveia em flocos', quantity: '40g', calories: 150, protein: 5, carbs: 27, fat: 3, category: 'carb' },
  { name: 'Massa integral', quantity: '1 prato (cozida)', calories: 220, protein: 8, carbs: 42, fat: 1, category: 'carb' },

  // Gorduras
  { name: 'Abacate', quantity: '1/2 unidade', calories: 120, protein: 1, carbs: 6, fat: 11, category: 'fat' },
  { name: 'Azeite de oliva', quantity: '1 colher de sopa', calories: 120, protein: 0, carbs: 0, fat: 14, category: 'fat' },
  { name: 'Castanhas mistas', quantity: '20g', calories: 120, protein: 3, carbs: 4, fat: 11, category: 'fat' },
  { name: 'Manteiga de amendoim', quantity: '1 colher de sopa', calories: 95, protein: 4, carbs: 3, fat: 8, category: 'fat' },

  // Vegetais
  { name: 'Brócolis cozido', quantity: '1 xícara', calories: 55, protein: 4, carbs: 11, fat: 0, category: 'vegetable' },
  { name: 'Aspargos grelhados', quantity: '1 xícara', calories: 40, protein: 4, carbs: 8, fat: 0, category: 'vegetable' },
  { name: 'Salada verde', quantity: '1 prato', calories: 30, protein: 2, carbs: 6, fat: 0, category: 'vegetable' },
  { name: 'Cenoura cozida', quantity: '1 xícara', calories: 55, protein: 1, carbs: 13, fat: 0, category: 'vegetable' },
  { name: 'Espinafre refogado', quantity: '1 xícara', calories: 40, protein: 5, carbs: 7, fat: 0, category: 'vegetable' },

  // Frutas
  { name: 'Banana', quantity: '1 unidade média', calories: 105, protein: 1, carbs: 27, fat: 0, category: 'fruit' },
  { name: 'Maçã', quantity: '1 unidade média', calories: 95, protein: 0, carbs: 25, fat: 0, category: 'fruit' },
  { name: 'Laranja', quantity: '1 unidade média', calories: 60, protein: 1, carbs: 15, fat: 0, category: 'fruit' },
  { name: 'Morango', quantity: '1 xícara', calories: 50, protein: 1, carbs: 12, fat: 0, category: 'fruit' },

  // Lácteos
  { name: 'Iogurte grego natural', quantity: '150g', calories: 100, protein: 15, carbs: 6, fat: 2, category: 'dairy' },
  { name: 'Leite desnatado', quantity: '200ml', calories: 70, protein: 7, carbs: 10, fat: 0, category: 'dairy' },
  { name: 'Café com leite desnatado', quantity: '200ml', calories: 60, protein: 6, carbs: 9, fat: 0, category: 'dairy' },

  // Outros
  { name: 'Feijão carioca', quantity: '2 conchas', calories: 140, protein: 9, carbs: 24, fat: 1, category: 'other' },
  { name: 'Lentilha cozida', quantity: '4 colheres de sopa', calories: 115, protein: 9, carbs: 20, fat: 0, category: 'other' },
];

export function getAlternativeFoods(category: string): FoodOption[] {
  return foodDatabase.filter(food => food.category === category);
}

export function findFoodByName(name: string): FoodOption | undefined {
  return foodDatabase.find(food => food.name === name);
}