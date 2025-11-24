'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Sparkles } from 'lucide-react';
import { UserData, generateNutritionPlan, generateDietPlan, NutritionPlan, DietPlan } from '@/lib/nutrition';

interface DietCalculatorProps {
  onPlanGenerated: (plan: NutritionPlan, diet: DietPlan, userData: UserData) => void;
}

export default function DietCalculator({ onPlanGenerated }: DietCalculatorProps) {
  const [formData, setFormData] = useState<UserData>({
    height: 170,
    weight: 70,
    age: 30,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simular delay para efeito visual
    await new Promise(resolve => setTimeout(resolve, 1000));

    const nutritionPlan = generateNutritionPlan(formData);
    const dietPlan = generateDietPlan(nutritionPlan);
    
    onPlanGenerated(nutritionPlan, dietPlan, formData);
    setIsGenerating(false);
  };

  return (
    <Card className="bg-gray-900/50 border-orange-500/20 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
          <Calculator className="w-6 h-6 text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Calculadora de Dieta</h2>
          <p className="text-sm text-gray-400">Preencha seus dados para gerar seu plano personalizado</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height" className="text-gray-300">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
              className="bg-black/30 border-orange-500/30 text-white focus:border-orange-500"
              min="100"
              max="250"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-gray-300">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
              className="bg-black/30 border-orange-500/30 text-white focus:border-orange-500"
              min="30"
              max="300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-gray-300">Idade</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              className="bg-black/30 border-orange-500/30 text-white focus:border-orange-500"
              min="10"
              max="120"
              required
            />
          </div>
        </div>

        {/* Gênero */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-gray-300">Sexo Biológico</Label>
          <Select
            value={formData.gender}
            onValueChange={(value: 'male' | 'female') => setFormData({ ...formData, gender: value })}
          >
            <SelectTrigger className="bg-black/30 border-orange-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-orange-500/30">
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Feminino</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nível de Atividade */}
        <div className="space-y-2">
          <Label htmlFor="activity" className="text-gray-300">Nível de Atividade Física</Label>
          <Select
            value={formData.activityLevel}
            onValueChange={(value: any) => setFormData({ ...formData, activityLevel: value })}
          >
            <SelectTrigger className="bg-black/30 border-orange-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-orange-500/30">
              <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
              <SelectItem value="light">Leve (exercício 1-3x/semana)</SelectItem>
              <SelectItem value="moderate">Moderado (exercício 3-5x/semana)</SelectItem>
              <SelectItem value="active">Ativo (exercício 6-7x/semana)</SelectItem>
              <SelectItem value="very_active">Muito Ativo (exercício 2x/dia)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Objetivo */}
        <div className="space-y-2">
          <Label htmlFor="goal" className="text-gray-300">Objetivo</Label>
          <Select
            value={formData.goal}
            onValueChange={(value: 'lose' | 'maintain' | 'gain') => setFormData({ ...formData, goal: value })}
          >
            <SelectTrigger className="bg-black/30 border-orange-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-orange-500/30">
              <SelectItem value="lose">Perder Peso (déficit calórico)</SelectItem>
              <SelectItem value="maintain">Manter Peso (manutenção)</SelectItem>
              <SelectItem value="gain">Ganhar Peso (superávit calórico)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botão de Gerar */}
        <Button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold py-6 text-lg transition-all duration-300 hover:scale-105"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Gerando seu plano...
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5 mr-2" />
              Gerar Plano Nutricional
            </>
          )}
        </Button>
      </form>

      {/* Info Card */}
      <div className="mt-6 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-orange-400">💡 Dica:</span> Após gerar seu plano, você poderá visualizar suas metas calóricas, macronutrientes e micronutrientes recomendados na aba "Plano".
        </p>
      </div>
    </Card>
  );
}
