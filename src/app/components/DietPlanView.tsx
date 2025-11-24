'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DietPlan, FoodItem } from '@/lib/nutrition';
import { UtensilsCrossed, Clock, Edit2 } from 'lucide-react';

interface DietPlanViewProps {
  dietPlan: DietPlan;
  onUpdate: (updatedDietPlan: DietPlan) => void;
}

// Lista de alimentos alternativos com informações nutricionais
const foodAlternatives: { [key: string]: FoodItem[] } = {
  breakfast: [
    { name: 'Aveia com leite', quantity: '50g + 200ml', calories: 180, protein: 8, carbs: 30, fat: 4 },
    { name: 'Pão francês', quantity: '2 unidades', calories: 200, protein: 6, carbs: 40, fat: 2 },
    { name: 'Cereal matinal', quantity: '40g', calories: 160, protein: 4, carbs: 32, fat: 1 },
    { name: 'Iogurte natural', quantity: '200g', calories: 120, protein: 10, carbs: 12, fat: 3 },
  ],
  snack: [
    { name: 'Maçã', quantity: '1 unidade média', calories: 80, protein: 0, carbs: 22, fat: 0 },
    { name: 'Banana', quantity: '1 unidade média', calories: 105, protein: 1, carbs: 27, fat: 0 },
    { name: 'Nozes', quantity: '20g', calories: 120, protein: 3, carbs: 3, fat: 12 },
    { name: 'Iogurte grego', quantity: '150g', calories: 100, protein: 15, carbs: 6, fat: 2 },
  ],
  lunch: [
    { name: 'Arroz branco', quantity: '4 colheres', calories: 200, protein: 4, carbs: 44, fat: 0 },
    { name: 'Macarrão', quantity: '1 prato', calories: 250, protein: 8, carbs: 50, fat: 2 },
    { name: 'Batata frita', quantity: '100g', calories: 300, protein: 4, carbs: 35, fat: 15 },
    { name: 'Salada mista', quantity: '1 prato', calories: 50, protein: 2, carbs: 10, fat: 0 },
  ],
  dinner: [
    { name: 'Peixe assado', quantity: '150g', calories: 200, protein: 30, carbs: 0, fat: 8 },
    { name: 'Carne bovina', quantity: '150g', calories: 300, protein: 35, carbs: 0, fat: 15 },
    { name: 'Frango assado', quantity: '150g', calories: 220, protein: 40, carbs: 0, fat: 5 },
    { name: 'Legumes refogados', quantity: '1 xícara', calories: 80, protein: 3, carbs: 15, fat: 2 },
  ],
};

export default function DietPlanView({ dietPlan, onUpdate }: DietPlanViewProps) {
  const [editingMeal, setEditingMeal] = useState<string | null>(null);
  const [editingFoodIndex, setEditingFoodIndex] = useState<number | null>(null);
  const [localDietPlan, setLocalDietPlan] = useState<DietPlan>(dietPlan);

  const meals = [
    { key: 'breakfast', icon: '🌅', time: '07:00 - 08:00', category: 'breakfast' },
    { key: 'morningSnack', icon: '☕', time: '10:00 - 10:30', category: 'snack' },
    { key: 'lunch', icon: '🍽️', time: '12:00 - 13:00', category: 'lunch' },
    { key: 'afternoonSnack', icon: '🥤', time: '15:00 - 16:00', category: 'snack' },
    { key: 'dinner', icon: '🌙', time: '19:00 - 20:00', category: 'dinner' },
  ];

  const handleFoodChange = (mealKey: string, foodIndex: number, newFood: FoodItem) => {
    const updatedDietPlan = { ...localDietPlan };
    const meal = updatedDietPlan.meals[mealKey as keyof typeof updatedDietPlan.meals];
    if (meal) {
      meal.foods[foodIndex] = newFood;

      // Recalcular totais da refeição
      meal.totalCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
      meal.macros.protein = meal.foods.reduce((sum, food) => sum + food.protein, 0);
      meal.macros.carbs = meal.foods.reduce((sum, food) => sum + food.carbs, 0);
      meal.macros.fat = meal.foods.reduce((sum, food) => sum + food.fat, 0);

      // Recalcular totais diários
      updatedDietPlan.dailyTotal.calories = Object.values(updatedDietPlan.meals).reduce((sum, m) => sum + (m?.totalCalories || 0), 0);
      updatedDietPlan.dailyTotal.protein = Object.values(updatedDietPlan.meals).reduce((sum, m) => sum + (m?.macros.protein || 0), 0);
      updatedDietPlan.dailyTotal.carbs = Object.values(updatedDietPlan.meals).reduce((sum, m) => sum + (m?.macros.carbs || 0), 0);
      updatedDietPlan.dailyTotal.fat = Object.values(updatedDietPlan.meals).reduce((sum, m) => sum + (m?.macros.fat || 0), 0);

      setLocalDietPlan(updatedDietPlan);
      onUpdate(updatedDietPlan);
    }
    setEditingMeal(null);
    setEditingFoodIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900/50 border-orange-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
            <UtensilsCrossed className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Plano Alimentar Diário</h2>
            <p className="text-sm text-gray-400">Refeições personalizadas para atingir suas metas</p>
          </div>
        </div>

        {/* Daily Totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/30 p-4 rounded-lg border border-orange-500/20">
            <p className="text-gray-400 text-sm">Total Diário</p>
            <p className="text-2xl font-bold text-orange-400">{localDietPlan.dailyTotal.calories} kcal</p>
          </div>
          <div className="bg-black/30 p-4 rounded-lg border border-orange-500/20">
            <p className="text-gray-400 text-sm">Proteína</p>
            <p className="text-2xl font-bold text-orange-400">{localDietPlan.dailyTotal.protein}g</p>
          </div>
          <div className="bg-black/30 p-4 rounded-lg border border-orange-500/20">
            <p className="text-gray-400 text-sm">Carboidratos</p>
            <p className="text-2xl font-bold text-orange-400">{localDietPlan.dailyTotal.carbs}g</p>
          </div>
          <div className="bg-black/30 p-4 rounded-lg border border-orange-500/20">
            <p className="text-gray-400 text-sm">Gorduras</p>
            <p className="text-2xl font-bold text-orange-400">{localDietPlan.dailyTotal.fat}g</p>
          </div>
        </div>
      </Card>

      {/* Meals */}
      {meals.map(({ key, icon, time, category }) => {
        const meal = localDietPlan.meals[key as keyof typeof localDietPlan.meals];
        if (!meal) return null;

        return (
          <Card key={key} className="bg-gray-900/50 border-orange-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{meal.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-400">{meal.totalCalories} kcal</p>
                <p className="text-xs text-gray-400">
                  P: {meal.macros.protein}g • C: {meal.macros.carbs}g • G: {meal.macros.fat}g
                </p>
              </div>
            </div>

            {/* Foods List */}
            <div className="space-y-3">
              {meal.foods.map((food, index) => (
                <div
                  key={index}
                  className="bg-black/30 border border-orange-500/20 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    {editingMeal === key && editingFoodIndex === index ? (
                      <Select
                        onValueChange={(value) => {
                          const selectedFood = foodAlternatives[category].find(f => f.name === value);
                          if (selectedFood) {
                            handleFoodChange(key, index, selectedFood);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full bg-gray-800 border-orange-500/30">
                          <SelectValue placeholder="Selecione um alimento alternativo" />
                        </SelectTrigger>
                        <SelectContent>
                          {foodAlternatives[category].map((altFood) => (
                            <SelectItem key={altFood.name} value={altFood.name}>
                              {altFood.name} - {altFood.calories} kcal
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <>
                        <h4 className="font-semibold text-white">{food.name}</h4>
                        <p className="text-sm text-gray-400">{food.quantity}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-white">{food.calories} kcal</p>
                      <p className="text-xs text-gray-400">
                        P: {food.protein}g • C: {food.carbs}g • G: {food.fat}g
                      </p>
                    </div>
                    {editingMeal !== key || editingFoodIndex !== index ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingMeal(key);
                          setEditingFoodIndex(index);
                        }}
                        className="text-orange-400 hover:text-orange-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingMeal(null);
                          setEditingFoodIndex(null);
                        }}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Meal Macros Summary */}
            <div className="mt-4 pt-4 border-t border-orange-500/20">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Proteína</p>
                  <p className="text-lg font-bold text-orange-400">{meal.macros.protein}g</p>
                  <p className="text-xs text-gray-500">
                    {((meal.macros.protein * 4 / meal.totalCalories) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Carboidratos</p>
                  <p className="text-lg font-bold text-orange-400">{meal.macros.carbs}g</p>
                  <p className="text-xs text-gray-500">
                    {((meal.macros.carbs * 4 / meal.totalCalories) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Gorduras</p>
                  <p className="text-lg font-bold text-orange-400">{meal.macros.fat}g</p>
                  <p className="text-xs text-gray-500">
                    {((meal.macros.fat * 9 / meal.totalCalories) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Info Card */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-orange-400">💡 Dica:</span> Clique no ícone de edição ao lado de cada alimento para substituí-lo por uma alternativa. As informações nutricionais serão atualizadas automaticamente.
        </p>
      </div>
    </div>
  );
}